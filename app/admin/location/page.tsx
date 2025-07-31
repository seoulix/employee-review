"use client"

import type React from "react"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Search } from "lucide-react"

interface State {
  id: number
  name: string
  code: string
  city_count: number
  status: "Active" | "Inactive"
}

interface City {
  id: number
  name: string
  stateId: number
  stateName: string
  outlets: number
  status: "Active" | "Inactive"
}

export default function LocationPage() {
  const [states, setStates] = useState<State[]>([])

  const [cities, setCities] = useState<City[]>([])

  
  const [isStateDialogOpen, setIsStateDialogOpen] = useState(false)
  const [isCityDialogOpen, setIsCityDialogOpen] = useState(false)
  const [editingState, setEditingState] = useState<State | null>(null)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [stateFormData, setStateFormData] = useState({
    name: "",
    code: "",
    status: "Active" as "Active" | "Inactive",
  })

  const [cityFormData, setCityFormData] = useState({
    name: "",
    stateId: 0,
    status: "Active" as "Active" | "Inactive",
  })

  const getStates = async ()=>{
    const response = await fetch("/api/locations/states")
const json = await response.json();
setStates(json.data);
  }

const getCities = async ()=>{
    const response = await fetch("/api/locations/cities")
const json = await response.json();
setCities(json.data);
  }


  useEffect(()=>{
try {
  getStates();
  getCities();
  
} catch (error) {
  console.log("Error in Fetching State")
}
  },[])

  const handleStateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingState) {
        // Update existing state
        const response = await fetch(`/api/locations/states/${editingState.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stateFormData)
        });
        const json = await response.json();
        if (json.success) {
          getStates(); // Refresh the list
        } else {
          alert(json.message || 'Failed to update state');
        }
      } else {
        // Create new state
        const response = await fetch('/api/locations/states', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stateFormData)
        });
        const json = await response.json();
        if (json.success) {
          getStates(); // Refresh the list
        } else {
          alert(json.message || 'Failed to create state');
        }
      }
      setIsStateDialogOpen(false)
      setEditingState(null)
      setStateFormData({ name: "", code: "", status: "Active" })
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  }

  const handleCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCity) {
        // Update existing city
        const response = await fetch(`/api/locations/cities/${editingCity.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cityFormData)
        });
        const json = await response.json();
        if (json.success) {
          getCities(); // Refresh the list
        } else {
          alert(json.message || 'Failed to update city');
        }
      } else {
        // Create new city
        const response = await fetch('/api/locations/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cityFormData)
        });
        const json = await response.json();
        if (json.success) {
          getCities(); // Refresh the list
        } else {
          alert(json.message || 'Failed to create city');
        }
      }
      setIsCityDialogOpen(false)
      setEditingCity(null)
      setCityFormData({ name: "", stateId: 0, status: "Active" })
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  }

  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.stateName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Location Management</h1>
        </div>

        <Tabs defaultValue="states" className="space-y-4">
          <TabsList>
            <TabsTrigger value="states">States</TabsTrigger>
            <TabsTrigger value="cities">Cities</TabsTrigger>
          </TabsList>

          <TabsContent value="states" className="space-y-4">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>States</CardTitle>
                  <Dialog open={isStateDialogOpen} onOpenChange={setIsStateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button  style={{borderRadius: "var(--border-radius)"}}
                        onClick={() => {
                          setEditingState(null)
                          setStateFormData({ name: "", code: "", status: "Active" })
                          setIsStateDialogOpen(true)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add State
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingState ? "Edit State" : "Add New State"}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleStateSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="stateName">State Name</Label>
                            <Input
                              id="stateName"
                              value={stateFormData.name}
                              onChange={(e) => setStateFormData({ ...stateFormData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="stateCode">State Code</Label>
                            <Input
                              id="stateCode"
                              value={stateFormData.code}
                              onChange={(e) => setStateFormData({ ...stateFormData, code: e.target.value })}
                              placeholder="e.g., CA, NY"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="stateStatus">Status</Label>
                            <select
                              id="stateStatus"
                              value={stateFormData.status}
                              onChange={(e) =>
                                setStateFormData({ ...stateFormData, status: e.target.value as "Active" | "Inactive" })
                              }
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              style={{borderRadius: "var(--border-radius)"}}>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                              <Button  style={{borderRadius: "var(--border-radius)"}} type="submit">{editingState ? "Update State" : "Add State"}</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search states..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>State Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Cities</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStates.map((state) => (
                      <TableRow key={state.id}>
                        <TableCell className="font-medium">{state.name}</TableCell>
                        <TableCell>{state.code}</TableCell>
                        <TableCell>{state.city_count}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              state.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                            style={{borderRadius: "var(--border-radius)"}}>
                            {state.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button  style={{borderRadius: "var(--border-radius)"}}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingState(state)
                                setStateFormData({
                                  name: state.name,
                                  code: state.code,
                                  status: state.status,
                                })
                                setIsStateDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button  style={{borderRadius: "var(--border-radius)"}}
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                if (confirm('Are you sure you want to delete this state?')) {
                                  try {
                                    const response = await fetch(`/api/locations/states/${state.id}`, {
                                      method: 'DELETE'
                                    });
                                    const json = await response.json();
                                    if (json.success) {
                                      getStates(); // Refresh the list
                                    } else {
                                      alert(json.message || 'Failed to delete state');
                                    }
                                  } catch (error) {
                                    console.error('Error:', error);
                                    alert('An error occurred');
                                  }
                                }
                              }}
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
          </TabsContent>

          <TabsContent value="cities" className="space-y-4">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cities</CardTitle>
                  <Dialog open={isCityDialogOpen} onOpenChange={setIsCityDialogOpen}>
                    <DialogTrigger asChild>
                      <Button  style={{borderRadius: "var(--border-radius)"}}
                        onClick={() => {
                          setEditingCity(null)
                          setCityFormData({ name: "", stateId: 0, status: "Active" })
                          setIsCityDialogOpen(true)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add City
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingCity ? "Edit City" : "Add New City"}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCitySubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="cityName">City Name</Label>
                            <Input
                              id="cityName"
                              value={cityFormData.name}
                              onChange={(e) => setCityFormData({ ...cityFormData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cityState">State</Label>
                            <select
                              id="cityState"
                              value={cityFormData.stateId}
                              onChange={(e) =>
                                setCityFormData({ ...cityFormData, stateId: Number.parseInt(e.target.value) })
                              }
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              required
                              style={{borderRadius: "var(--border-radius)"}}>
                              <option value={0}>Select State</option>
                              {states.map((state) => (
                                <option key={state.id} value={state.id}>
                                  {state.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cityStatus">Status</Label>
                            <select
                              id="cityStatus"
                              value={cityFormData.status}
                              onChange={(e) =>
                                setCityFormData({ ...cityFormData, status: e.target.value as "Active" | "Inactive" })
                              }
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              style={{borderRadius: "var(--border-radius)"}}>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button  style={{borderRadius: "var(--border-radius)"}} type="submit">{editingCity ? "Update City" : "Add City"}</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>City Name</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Outlets</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCities.map((city) => (
                      <TableRow key={city.id}>
                        <TableCell className="font-medium">{city.name}</TableCell>
                        <TableCell>{city.stateName}</TableCell>
                        <TableCell>{city.outlets}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              city.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                            style={{borderRadius: "var(--border-radius)"}}>
                            {city.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button  style={{borderRadius: "var(--border-radius)"}}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingCity(city)
                                setCityFormData({
                                  name: city.name,
                                  stateId: city.stateId,
                                  status: city.status,
                                })
                                setIsCityDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button  style={{borderRadius: "var(--border-radius)"}}
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                if (confirm('Are you sure you want to delete this city?')) {
                                  try {
                                    const response = await fetch(`/api/locations/cities/${city.id}`, {
                                      method: 'DELETE'
                                    });
                                    const json = await response.json();
                                    if (json.success) {
                                      getCities(); // Refresh the list
                                    } else {
                                      alert(json.message || 'Failed to delete city');
                                    }
                                  } catch (error) {
                                    console.error('Error:', error);
                                    alert('An error occurred');
                                  }
                                }
                              }}
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
