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
import { Plus, Edit, Trash2, Search, MapPin, Upload, Star, MessageSquare, Link } from "lucide-react"
import { useLoading } from "@/contexts/LoadingContext"

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
  outlet_image: string
  gps_latitude: number | null
  gps_longitude: number | null
  phone_number: string | null
  email_id: string | null
  google_review_link: string | null
  custom_feedback_form: string | null
  review_link_config: string | null
  avg_rating: string | number
  total_reviews: string | number
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
  const { showLoading, hideLoading, showToast } = useLoading()
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
    outletImage: "",
    gpsLatitude: null as number | null,
    gpsLongitude: null as number | null,
    phoneNumber: "",
    emailId: "",
    googleReviewLink: "",
    customFeedbackForm: "",
    reviewLinkConfig: "",
  })

  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/outlet-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, outletImage: data.data.url }));
        setImagePreview(data.data.url);
        showToast("Image uploaded successfully!", "success");
      } else {
        showToast(data.message || "Failed to upload image", "error");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Failed to upload image", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            gpsLatitude: position.coords.latitude,
            gpsLongitude: position.coords.longitude,
          }));
          showToast("GPS location captured!", "success");
        },
        (error) => {
          console.error("Error getting location:", error);
          showToast("Failed to get GPS location", "error");
        }
      );
    } else {
      showToast("Geolocation is not supported by this browser", "error");
    }
  };

  // Load data on component mount
  useEffect(() => {
    getOutlets();
    getFormData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    showLoading(editingOutlet ? "Updating outlet..." : "Creating outlet...");
    
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
          hideLoading();
          showToast('Outlet updated successfully!', 'success');
        } else {
          hideLoading();
          showToast(json.message || 'Failed to update outlet', 'error');
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
          hideLoading();
          showToast('Outlet created successfully!', 'success');
        } else {
          hideLoading();
          showToast(json.message || 'Failed to create outlet', 'error');
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
        outletImage: "",
        gpsLatitude: null,
        gpsLongitude: null,
        phoneNumber: "",
        emailId: "",
        googleReviewLink: "",
        customFeedbackForm: "",
        reviewLinkConfig: "",
      });
    } catch (error) {
      console.error('Error:', error);
      hideLoading();
      showToast('An error occurred', 'error');
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
      outletImage: outlet.outlet_image || "",
      gpsLatitude: outlet.gps_latitude,
      gpsLongitude: outlet.gps_longitude,
      phoneNumber: outlet.phone_number || "",
      emailId: outlet.email_id || "",
      googleReviewLink: outlet.google_review_link || "",
      customFeedbackForm: outlet.custom_feedback_form || "",
      reviewLinkConfig: outlet.review_link_config || "",
    })
    setImagePreview(outlet.outlet_image || null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this outlet?')) {
      showLoading("Deleting outlet...");
      
      try {
        const response = await fetch(`/api/outlets/${id}`, {
          method: 'DELETE',
        });
        const json = await response.json();
        if (json.success) {
          getOutlets(); // Refresh the list
          hideLoading();
          showToast('Outlet deleted successfully!', 'success');
        } else {
          hideLoading();
          showToast(json.message || 'Failed to delete outlet', 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        hideLoading();
        showToast('An error occurred', 'error');
      }
    }
  };

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
      outletImage: "",
      gpsLatitude: null,
      gpsLongitude: null,
      phoneNumber: "",
      emailId: "",
      googleReviewLink: "",
      customFeedbackForm: "",
      reviewLinkConfig: "",
    })
    setImagePreview(null)
    setIsDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Outlet Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{borderRadius: "var(--border-radius)"}} onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Outlet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingOutlet ? "Edit Outlet" : "Add New Outlet"}</DialogTitle>
                <DialogDescription>
                  {editingOutlet ? "Update outlet information" : "Create a new outlet location"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 py-4">
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

                  {/* Outlet Image Upload */}
                  <div className="border-t pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="outletImage">Outlet Image *</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Input
                            id="outletImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file);
                              }
                            }}
                            className="cursor-pointer"
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('outletImage')?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? "Uploading..." : <Upload className="h-4 w-4" />}
                        </Button>
                      </div>
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Outlet preview"
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* GPS Location */}
                  <div className="border-t pt-4">
                    <div className="grid gap-2">
                      <Label>GPS Location</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Input
                            type="number"
                            step="any"
                            placeholder="Latitude"
                            value={formData.gpsLatitude || ""}
                            onChange={(e) => setFormData({ ...formData, gpsLatitude: e.target.value ? parseFloat(e.target.value) : null })}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            step="any"
                            placeholder="Longitude"
                            value={formData.gpsLongitude || ""}
                            onChange={(e) => setFormData({ ...formData, gpsLongitude: e.target.value ? parseFloat(e.target.value) : null })}
                          />
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={getCurrentLocation}
                            className="w-full"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Get Location
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder="+1234567890"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="emailId">Email ID</Label>
                        <Input
                          id="emailId"
                          type="email"
                          value={formData.emailId}
                          onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
                          placeholder="outlet@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Google Review Link */}
                  <div className="border-t pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="googleReviewLink">Google Review Link</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="googleReviewLink"
                          value={formData.googleReviewLink}
                          onChange={(e) => setFormData({ ...formData, googleReviewLink: e.target.value })}
                          placeholder="https://maps.google.com/..."
                        />
                        <Link className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Will appear after 4+ 5-star reviews
                      </div>
                    </div>
                  </div>

                  {/* Custom Feedback Form */}
                  <div className="border-t pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="customFeedbackForm">Custom Feedback Form (JSON)</Label>
                      <textarea
                        id="customFeedbackForm"
                        value={formData.customFeedbackForm}
                        onChange={(e) => setFormData({ ...formData, customFeedbackForm: e.target.value })}
                        placeholder='{"questions": [{"type": "rating", "text": "How was your experience?"}]}'
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        rows={4}
                      />
                      <div className="text-sm text-muted-foreground">
                        JSON configuration for custom feedback form
                      </div>
                    </div>
                  </div>

                  {/* Review Link Configuration */}
                  <div className="border-t pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="reviewLinkConfig">Review Link Configuration</Label>
                      <textarea
                        id="reviewLinkConfig"
                        value={formData.reviewLinkConfig}
                        onChange={(e) => setFormData({ ...formData, reviewLinkConfig: e.target.value })}
                        placeholder='{"minRating": 4, "minReviews": 4, "autoShow": true}'
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        rows={3}
                      />
                      <div className="text-sm text-muted-foreground">
                        Configuration for when to show review links
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button style={{borderRadius: "var(--border-radius)"}} type="submit">{editingOutlet ? "Update Outlet" : "Add Outlet"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card style={{borderRadius: "var(--border-radius)"}}>
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
                  <TableHead>Outlet</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOutlets.map((outlet) => (
                  <TableRow key={outlet.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {outlet.outlet_image && (
                          <img
                            src={outlet.outlet_image}
                            alt={outlet.name}
                            className="w-10 h-10 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <div className="font-medium">{outlet.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {outlet.employees} employees
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{outlet.brand}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        <div>
                          <div>
                            {outlet.city}, {outlet.state}
                          </div>
                          <div className="text-sm text-muted-foreground">{outlet.address}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{outlet.manager}</div>
                        {outlet.phone_number && (
                          <div className="text-muted-foreground">{outlet.phone_number}</div>
                        )}
                        {outlet.email_id && (
                          <div className="text-muted-foreground">{outlet.email_id}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">
                          {outlet.avg_rating ? Number(outlet.avg_rating).toFixed(1) : "0.0"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({Number(outlet.total_reviews)} reviews)
                        </span>
                      </div>
                    </TableCell>
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
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(outlet)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(outlet.id)}
                        >
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
