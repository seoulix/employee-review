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
import { useLoading } from "@/contexts/LoadingContext"

interface Brand {
  id: number
  name: string
  description: string
  logo_url?: string
  outlets: number
  status: "Active" | "Inactive"
  createdAt: string
}

export default function BrandPage() {
  const { showLoading, hideLoading, showToast } = useLoading()
  const [brands, setBrands] = useState<Brand[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo_url: "",
    status: "Active" as "Active" | "Inactive",
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
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

  const handleLogoUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (result.success) {
        setFormData(prev => ({ ...prev, logo_url: result.data.url }))
        setLogoPreview(result.data.url)
        setLogoFile(null)
      } else {
        alert(result.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    showLoading(editingBrand ? "Updating brand..." : "Creating brand...")
    
    let finalFormData = { ...formData }
    
    // Upload logo if selected
    if (logoFile) {
      try {
        const formData = new FormData()
        formData.append('file', logoFile)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()
        
        if (result.success) {
          finalFormData.logo_url = result.data.url
        } else {
          hideLoading()
          showToast(result.message || 'Upload failed', 'error')
          return
        }
      } catch (error) {
        console.error('Upload error:', error)
        hideLoading()
        showToast('Upload failed', 'error')
        return
      }
    }

    try {
      if (editingBrand != null) {
        console.log('🔄 Updating brand with data:', finalFormData);
        setBrands(brands.map((brand) => (brand.id === editingBrand.id ? { ...brand, ...finalFormData } : brand)))
        const res = await fetch(`/api/brands/${editingBrand.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalFormData),
        });
        if (res.ok) {
          const { data } = await res.json();
          console.log('✅ Brand updated successfully');
          hideLoading()
          showToast('Brand updated successfully!', 'success')
        } else {
          console.log("❌ Can not update brand - report dev team")
          hideLoading()
          showToast('Failed to update brand', 'error')
        }
        setEditingBrand(null);
      } else {
        // Send POST request to backend
        console.log("🆕 Creating new brand with data:", finalFormData);

        const res = await fetch('/api/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalFormData),
        });
        if (res.ok) {
          const { data } = await res.json();
          console.log('✅ Brand created successfully');
          hideLoading()
          showToast('Brand created successfully!', 'success')
        } else {
          console.log("❌ Can not create brand - report dev team")
          hideLoading()
          showToast('Failed to create brand', 'error')
        }
      }
    } catch (error) {
      console.error('Brand operation failed:', error)
      hideLoading()
      showToast('Operation failed', 'error')
    }
    
    setIsDialogOpen(false)
    setEditingBrand(null)
    setFormData({ name: "", description: "", logo_url: "", status: "Active" })
    setLogoFile(null)
    setLogoPreview("")
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      description: brand.description,
      logo_url: brand.logo_url || "",
      status: brand.status,
    })
    setLogoPreview(brand.logo_url || "")
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    showLoading("Deleting brand...")
    
    try {
      const res = await fetch(`/api/brands/${id}`, {method: 'DELETE',});
      
      if(res.ok) {
        setBrands(brands.filter((brand) => brand.id !== id))
        hideLoading()
        showToast('Brand deleted successfully!', 'success')
      } else {
        hideLoading()
        showToast("Cannot delete brand", 'error')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      hideLoading()
      showToast('Failed to delete brand', 'error')
    }
  }

  const openAddDialog = () => {
    setEditingBrand(null)
    setFormData({ name: "", description: "", logo_url: "", status: "Active" })
    setLogoFile(null)
    setLogoPreview("")
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
                    <Label htmlFor="logo">Brand Logo</Label>
                    <div className="space-y-2">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        disabled={isUploading}
                        className="cursor-pointer"
                      />
                      {isUploading && (
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                      )}
                      {logoPreview && (
                        <div className="mt-2">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-20 h-20 object-contain border rounded-md"
                          />
                        </div>
                      )}
                    </div>
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
                  <TableHead>Logo</TableHead>
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
                    <TableCell>
                      {brand.logo_url ? (
                        <img 
                          src={brand.logo_url} 
                          alt={`${brand.name} logo`}
                          className="w-10 h-10 object-contain rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">No logo</span>
                        </div>
                      )}
                    </TableCell>
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
