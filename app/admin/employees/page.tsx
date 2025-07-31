"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, Search, Upload, User, BarChart } from "lucide-react"
import Link from "next/link"

interface Employee {
  id: number
  name: string
  email: string
  phone: string
  outlet: string
  position: string
  photo: string
  status: "Active" | "Inactive"
  joinDate: string
  rating: number
  totalReviews: number
}

interface Outlet {
  id: number
  name: string
  brand: string
  city: string
  state: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [positions, setPositions] = useState<string[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    outletId: 0,
    position: "",
    photo: "",
    joinDate: "",
    status: "Active" as "Active" | "Inactive",
  })

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.outlet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Fetch employees and form data
  const getEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      const json = await response.json();
      if (json.success) {
        setEmployees(json.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const getFormData = async () => {
    try {
      const response = await fetch("/api/employees/form-data");
      const json = await response.json();
      if (json.success) {
        setOutlets(json.data.outlets); // This should be all outlets
        setPositions(json.data.positions);
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    getEmployees();
    getFormData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        // Update existing employee
        const response = await fetch(`/api/employees/${editingEmployee.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const json = await response.json();
        if (json.success) {
          getEmployees(); // Refresh the list
        } else {
          alert(json.message || 'Failed to update employee');
        }
      } else {
        // Create new employee
        const response = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const json = await response.json();
        if (json.success) {
          getEmployees(); // Refresh the list
        } else {
          alert(json.message || 'Failed to create employee');
        }
      }
      setIsDialogOpen(false);
      setEditingEmployee(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        outletId: 0,
        position: "",
        photo: "",
        joinDate: "",
        status: "Active",
      });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    // Find the outlet ID
    const outlet = outlets.find(o => o.name === employee.outlet);
    
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      outletId: outlet?.id || 0,
      position: employee.position,
      photo: employee.photo,
      joinDate: employee.joinDate,
      status: employee.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`/api/employees/${id}`, {
          method: 'DELETE'
        });
        const json = await response.json();
        if (json.success) {
          getEmployees(); // Refresh the list
        } else {
          alert(json.message || 'Failed to delete employee');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
      }
    }
  }

  const openAddDialog = () => {
    setEditingEmployee(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      outletId: 0,
      position: "",
      photo: "",
      joinDate: "",
      status: "Active",
    })
    setIsDialogOpen(true)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a server
      const photoUrl = URL.createObjectURL(file)
      setFormData({ ...formData, photo: photoUrl })
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button  style={{borderRadius: "var(--border-radius)"}} onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
                <DialogDescription>
                  {editingEmployee ? "Update employee information" : "Add a new employee to the system"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="photo">Photo</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={formData.photo || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <Button  style={{borderRadius: "var(--border-radius)"}}
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("photo")?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Photo
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="outlet">Outlet</Label>
                      <select
                        id="outlet"
                        value={formData.outletId}
                        onChange={(e) => setFormData({ ...formData, outletId: Number(e.target.value) })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                        style={{borderRadius: "var(--border-radius)"}}
                      >
                        <option value={0}>Select Outlet</option>
                        {outlets.map((outlet) => (
                          <option key={outlet.id} value={outlet.id}>
                            {outlet.name} - {outlet.brand} ({outlet.city}, {outlet.state})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="position">Position</Label>
                      <select
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                        style={{borderRadius: "var(--border-radius)"}}
                      >
                        <option value="">Select Position</option>
                        {positions.map((position) => (
                          <option key={position} value={position}>
                            {position}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={formData.joinDate}
                        onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      style={{borderRadius: "var(--border-radius)"}}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button  style={{borderRadius: "var(--border-radius)"}} type="submit">{editingEmployee ? "Update Employee" : "Add Employee"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle>All Employees</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={employee.photo || "/placeholder.svg"} />
                          <AvatarFallback>
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-gray-500">ID: {employee.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{employee.email}</div>
                        <div className="text-sm text-gray-500">{employee.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.outlet}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">★ {employee.rating ? Number(employee.rating).toFixed(1) : '0.0'}</div>
                        <div className="text-sm text-gray-500">{employee.totalReviews || 0} reviews</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                        style={{borderRadius: "var(--border-radius)"}}>
                        {employee.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" size="sm" onClick={() => handleEdit(employee)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" size="sm" onClick={() => handleDelete(employee.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" size="sm">
                        <Link href={`../employee/performance/${employee.id}`}>
                          <BarChart className="h-4 w-4" />
                        </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
