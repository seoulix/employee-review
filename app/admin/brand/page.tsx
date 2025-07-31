"use client"

import type React from "react"

import { useState,useEffect } from "react"
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
import { Plus, Edit, Trash2, Search } from "lucide-react"

interface Brand {
  id: number
  name: string
  description: string
  outlets: number
  status: "Active" | "Inactive"
  createdAt: string
}

export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  })
  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBrands(data.data);
        }
      });
  }, []);
  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingBrand != null) {
      setBrands(brands.map((brand) => (brand.id === editingBrand.id ? { ...brand, ...formData } : brand)))
      const res = await fetch(`/api/brands/${editingBrand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const { data } = await res.json();
        
        // Optionally fetch updated brands from backend here
      } else {
        console.log("Can not add brand report dev team")
      }
      setEditingBrand(null);
    } else {
      // Send POST request to backend
      console.log("In the add brand option")

      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData,logo_url:null}),
      });
      if (res.ok) {
        const { data } = await res.json();
        // Optionally fetch updated brands from backend here
      } else {
        // Handle error
      }
    }
    setIsDialogOpen(false)
    setEditingBrand(null)
    setFormData({ name: "", description: "", status: "Active" })
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      description: brand.description,
      status: brand.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/brands/${id}`, {method: 'DELETE',});
    
    if(res.ok)setBrands(brands.filter((brand) => brand.id !== id))
    else alert("Can not delete contact the dev team")

    
  }

  const openAddDialog = () => {
    setEditingBrand(null)
    setFormData({ name: "", description: "", status: "Active" })
    setIsDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Brand Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button  style={{borderRadius: "var(--border-radius)"}} onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Brand
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingBrand ? "Edit Brand" : "Add New Brand"}</DialogTitle>
                <DialogDescription>
                  {editingBrand ? "Update brand information" : "Create a new brand for your business"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Brand Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter brand name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter brand description"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      style={{borderRadius: "var(--border-radius)"}}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button  style={{borderRadius: "var(--border-radius)"}} type="submit">{editingBrand ? "Update Brand" : "Add Brand"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle>All Brands</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search brands..."
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
                  <TableHead>Brand Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Outlets</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell>{brand.description}</TableCell>
                    <TableCell>{brand.outlets}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          brand.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          
                        }`}
                        style={{borderRadius: "var(--border-radius)"}}
                      >
                        {brand.status}
                      </span>
                    </TableCell>
                    <TableCell>{brand.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button  style={{borderRadius: "var(--border-radius)"}}  variant="outline" size="sm" onClick={() => handleEdit(brand)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" size="sm" onClick={() => handleDelete(brand.id)}>
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
