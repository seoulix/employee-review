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
import { Plus, Edit, Trash2, Search, MapPin } from "lucide-react"

interface Outlet {
  id: number
  name: string
  brand: string
  city: string
  state: string
  address: string
  manager: string
  employees: number
  status: "Active" | "Inactive"
  createdAt: string
}

interface Brand {
  id: number
  name: string
}

interface State {
  id: number
  name: string
  code: string
  cities: City[]
}

interface City {
  id: number
  name: string
}

export default function OutletPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [states, setStates] = useState<State[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    brandId: 0,
    cityId: 0,
    stateId: 0,
    address: "",
    manager: "",
    managerPhone: "",
    managerEmail: "",
    status: "Active" as "Active" | "Inactive",
  })

  const filteredOutlets = outlets.filter(
    (outlet) =>
      outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outlet.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outlet.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outlet.manager.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Fetch outlets and form data
  const getOutlets = async () => {
    try {
      const response = await fetch("/api/outlets");
      const json = await response.json();
      if (json.success) {
        setOutlets(json.data);
      }
    } catch (error) {
      console.error("Error fetching outlets:", error);
    }
  };

  const getFormData = async () => {
    try {
      const response = await fetch("/api/outlets/form-data");
      const json = await response.json();
      if (json.success) {
        setBrands(json.data.brands);
        setStates(json.data.states);
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  };

  // Load data on component mount
 useEffect(() => {
    getOutlets();
    getFormData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOutlet) {
        // Update existing outlet
        const response = await fetch(`/api/outlets/${editingOutlet.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const json = await response.json();
        if (json.success) {
          getOutlets(); // Refresh the list
        } else {
          alert(json.message || 'Failed to update outlet');
        }
      } else {
        // Create new outlet
        const response = await fetch('/api/outlets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const json = await response.json();
        if (json.success) {
          getOutlets(); // Refresh the list
        } else {
          alert(json.message || 'Failed to create outlet');
        }
      }
      setIsDialogOpen(false);
      setEditingOutlet(null);
      setFormData({
        name: "",
        brandId: 0,
        cityId: 0,
        stateId: 0,
        address: "",
        manager: "",
        managerPhone: "",
        managerEmail: "",
        status: "Active",
      });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  const handleEdit = (outlet: Outlet) => {
    setEditingOutlet(outlet)
    // Find the brand ID
    const brand = brands.find(b => b.name === outlet.brand);
    // Find the state and city IDs
    const state = states.find(s => s.name === outlet.state);
    const city = state?.cities.find(c => c.name === outlet.city);
    
    setFormData({
      name: outlet.name,
      brandId: brand?.id || 0,
      cityId: city?.id || 0,
      stateId: state?.id || 0,
      address: outlet.address,
      manager: outlet.manager,
      managerPhone: "",
      managerEmail: "",
      status: outlet.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this outlet?')) {
      try {
        const response = await fetch(`/api/outlets/${id}`, {
          method: 'DELETE'
        });
        const json = await response.json();
        if (json.success) {
          getOutlets(); // Refresh the list
        } else {
          alert(json.message || 'Failed to delete outlet');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
      }
    }
  }

  const openAddDialog = () => {
    setEditingOutlet(null)
    setFormData({
      name: "",
      brandId: 0,
      cityId: 0,
      stateId: 0,
      address: "",
      manager: "",
      managerPhone: "",
      managerEmail: "",
      status: "Active",
    })
    setIsDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Outlet Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button  style={{borderRadius: "var(--border-radius)"}} onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Outlet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingOutlet ? "Edit Outlet" : "Add New Outlet"}</DialogTitle>
                <DialogDescription>
                  {editingOutlet ? "Update outlet information" : "Create a new outlet location"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Outlet Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter outlet name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="brand">Brand</Label>
                      <select
                        id="brand"
                        value={formData.brandId}
                        onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                      >
                        <option value={0}>Select Brand</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="state">State</Label>
                      <select
                        id="state"
                        value={formData.stateId}
                        onChange={(e) => {
                          const stateId = Number(e.target.value);
                          setFormData({ 
                            ...formData, 
                            stateId: stateId, 
                            cityId: 0 
                          });
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                      >
                        <option value={0}>Select State</option>
                        {states.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <select
                        id="city"
                        value={formData.cityId}
                        onChange={(e) => setFormData({ ...formData, cityId: Number(e.target.value) })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                        disabled={!formData.stateId}
                      >
                        <option value={0}>Select City</option>
                        {formData.stateId > 0 &&
                          states.find(s => s.id === formData.stateId)?.cities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter full address"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="manager">Manager</Label>
                      <Input
                        id="manager"
                        value={formData.manager}
                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                        placeholder="Manager name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button  style={{borderRadius: "var(--border-radius)"}} type="submit">{editingOutlet ? "Update Outlet" : "Add Outlet"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle>All Outlets</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search outlets..."
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
                  <TableHead>Outlet Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOutlets.map((outlet) => (
                  <TableRow key={outlet.id}>
                    <TableCell className="font-medium">{outlet.name}</TableCell>
                    <TableCell>{outlet.brand}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <div>
                          <div>
                            {outlet.city}, {outlet.state}
                          </div>
                          <div className="text-sm text-gray-500">{outlet.address}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{outlet.manager}</TableCell>
                    <TableCell>{outlet.employees}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          outlet.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {outlet.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" size="sm" onClick={() => handleEdit(outlet)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" size="sm" onClick={() => handleDelete(outlet.id)}>
                          <Trash2 className="h-4 w-4" />
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
