"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Filter, FileText, Star, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface FeedbackEntry {
  id: number
  customerName: string
  employeeName: string
  outlet: string
  brand: string
  city: string
  state: string
  rating: number
  feedback: string
  created_at: string
  status: "Perfect" | "Counselling" | "Needs Review"
  customerContact?: string
  tiles: object
}

export default function FeedbackReportPage() {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [outlets, setOutlets] = useState<string[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackDetails, setFeedbackDetails] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/feedback"); // Adjust endpoint as needed
        const json = await res.json();
        if (json.success) {
          // The data is in json.data.feedback
          setFeedbackEntries(json.data.feedback.map(entry => ({
            id: entry.id,
            customerName: entry.customer_name,
            employeeName: entry.employee_name,
            outlet: entry.outlet_name,
            brand: entry.brand_name,
            city: entry.location.split(', ')[1], // if location is "State, City"
            state: entry.location.split(', ')[0],
            rating: entry.rating,
            feedback: entry.feedback_text,
            created_at: entry.created_at,
            status: entry.status,
            customerContact: entry.customer_phone,
            tiles: entry.tiles ? JSON.parse(entry.tiles) : null
          })));
        }
      } catch (e) {
        // handle error, maybe setFeedbackEntries([])
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch("/api/feedback/filters");
        const json = await res.json();
        if (json.success) {
          setBrands(json.data.brands);
          setStates(json.data.states);
          setCities(json.data.cities);
          setOutlets(json.data.outlets);
          setEmployees(json.data.employees);
        }
      } catch (e) {
        // handle error
      }
    };
    fetchFilters();
  }, []);

  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    brand: "All Brands",
    state: "All States",
    city: "All Cities",
    outlet: "All Outlets",
    employee: "All Employees",
    status: "All Status",
    dateFrom: "",
    dateTo: "",
  })

  const filteredEntries = feedbackEntries.filter((entry) => {
    const matchesSearch =
      entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.feedback.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilters =
      (filters.brand === "All Brands" || entry.brand === filters.brand) &&
      (filters.state === "All States" || entry.state === filters.state) &&
      (filters.city === "All Cities" || entry.city === filters.city) &&
      (filters.outlet === "All Outlets" || entry.outlet === filters.outlet) &&
      (filters.employee === "All Employees" || entry.employeeName === filters.employee) &&
      (filters.status === "All Status" || entry.status === filters.status)

    return matchesSearch && matchesFilters
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Perfect":
        return "bg-green-100 text-green-800"
      case "Counselling":
        return "bg-red-100 text-red-800"
      case "Needs Review":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const exportToCSV = () => {
    const headers = [
      "Customer Name",
      "Employee",
      "Outlet",
      "Brand",
      "City",
      "State",
      "Rating",
      "Feedback",
      "Status",
      "Date",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredEntries.map((entry) =>
        [
          entry.customerName,
          entry.employeeName,
          entry.outlet,
          entry.brand,
          entry.city,
          entry.state,
          entry.rating,
          `"${entry.feedback.replace(/"/g, '""')}"`,
          entry.status,
          entry.created_at,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "feedback-report.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToExcel = () => {
    // Mock Excel export - in real app, use a library like xlsx
    alert("Excel export functionality would be implemented here")
  }

  const handleViewFeedback = async (feedbackId:number,employeeName:string,employeeOutlet:string,outletBrand:string,outletLocation:string) => {
    
    setSelectedFeedback(feedbackId);
    const res = await fetch(`/api/feedback/${feedbackId}`);
    const json = await res.json();
    if (json.success) {
      json.data.feedback.employee_name = employeeName;
      json.data.feedback.outlet = employeeOutlet;
      json.data.feedback.brand = outletBrand;
      json.data.feedback.location = outletLocation;
      json.data.feedback.tiles =  json.data.feedback.tiles ? JSON.parse(json.data.feedback.tiles) : null;
      setFeedbackDetails(json.data);
    }
  };

  if (loading) {
    return <AdminLayout>
      <div>Loading...</div>
    </AdminLayout>
  }

  if (feedbackDetails) {
    return (
      <AdminLayout>
        <div className="space-y-6 overflow-auto max-h-screen">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Feedback Report</h1>
            <div className="flex space-x-2">
              <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={exportToExcel}>
                <FileText className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
                <div className="space-y-2">
                  <Label>Date From</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date To</Label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Brands">All Brands</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select value={filters.state} onValueChange={(value) => setFilters({ ...filters, state: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All States" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All States">All States</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={filters.city} onValueChange={(value) => setFilters({ ...filters, city: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Cities">All Cities</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Outlet</Label>
                  <Select value={filters.outlet} onValueChange={(value) => setFilters({ ...filters, outlet: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Outlets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Outlets">All Outlets</SelectItem>
                      {outlets.map((outlet) => (
                        <SelectItem key={outlet} value={outlet}>
                          {outlet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Employee</Label>
                  <Select value={filters.employee} onValueChange={(value) => setFilters({ ...filters, employee: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Employees" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Employees">All Employees</SelectItem>
                      {employees.map((employee) => (
                        <SelectItem key={employee} value={employee}>
                          {employee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Status">All Status</SelectItem>
                      <SelectItem value="Perfect">Perfect</SelectItem>
                      <SelectItem value="Counselling">Counselling</SelectItem>
                      <SelectItem value="Needs Review">Needs Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Button  style={{borderRadius: "var(--border-radius)"}}
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      brand: "All Brands",
                      state: "All States",
                      city: "All Cities",
                      outlet: "All Outlets",
                      employee: "All Employees",
                      status: "All Status",
                      dateFrom: "",
                      dateTo: "",
                    })
                  }
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search and Results */}
          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle>Feedback Entries ({filteredEntries.length})</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{entry.customerName}</div>
                          {entry.customerContact && <div className="text-sm text-gray-500">{entry.customerContact}</div>}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{entry.employeeName}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{entry.outlet}</div>
                          <div className="text-sm text-gray-500">{entry.brand}</div>
                          <div className="text-sm text-gray-500">
                            {entry.city}, {entry.state}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getRatingStars(entry.rating)}
                          <span className="ml-2 text-sm font-medium">{entry.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={entry.feedback}>
                          {entry.feedback}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button  style={{borderRadius: "var(--border-radius)"}}
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewFeedback(entry.id,entry.employeeName,entry.outlet,entry.brand,entry.location)}
                        >
                          <Eye/>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle className="text-lg">Perfect Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {filteredEntries.filter((entry) => entry.status === "Perfect").length}
                </div>
                <p className="text-sm text-gray-500">
                  {Math.round(
                    (filteredEntries.filter((entry) => entry.status === "Perfect").length / filteredEntries.length) * 100,
                  )}
                  % of total
                </p>
              </CardContent>
            </Card>

            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle className="text-lg">Needs Counselling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {filteredEntries.filter((entry) => entry.status === "Counselling").length}
                </div>
                <p className="text-sm text-gray-500">Requires immediate attention</p>
              </CardContent>
            </Card>

            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle className="text-lg">Needs Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {filteredEntries.filter((entry) => entry.status === "Needs Review").length}
                </div>
                <p className="text-sm text-gray-500">Follow-up required</p>
              </CardContent>
            </Card>

            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle className="text-lg">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(filteredEntries.reduce((sum, entry) => sum + entry.rating, 0) / filteredEntries.length).toFixed(1)}
                </div>
                <p className="text-sm text-gray-500">Out of 5.0 stars</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={!!selectedFeedback} onOpenChange={() => {
          setSelectedFeedback(null);
          setFeedbackDetails(null);
        }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
            </DialogHeader>
            {feedbackDetails ? (
              <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide space-y-6">
                {/* Main Feedback Info */}
                <Card  style={{borderRadius: "var(--border-radius)"}} className="bg-gray-50 border-none shadow-none">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold">{feedbackDetails.feedback.customer_name}</div>
                        <div className="text-sm text-gray-500">{feedbackDetails.feedback.created_at && new Date(feedbackDetails.feedback.created_at).toLocaleString()}</div>
                      </div>
                      <Badge className="text-xs" variant="secondary">{feedbackDetails.feedback.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Employee:</span>
                      <span>{feedbackDetails.feedback.employee_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Outlet:</span>
                      <span>{feedbackDetails.feedback.outlet || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Brand:</span>
                      <span>{feedbackDetails.feedback.brand || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Location:</span>
                      <span>{feedbackDetails.feedback.location || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Rating:</span>
                      <span className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < feedbackDetails.feedback.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                        ))}
                        <span className="ml-2 font-bold">{feedbackDetails.feedback.rating}/5</span>
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Feedback:</span>
                      <div className="bg-white border rounded p-2 mt-1 text-gray-700">{feedbackDetails.feedback.feedback_text || <span className="text-gray-400"  style={{borderRadius: "var(--border-radius)"}}>No feedback text</span>}</div>
                    </div>
                    <div>
                      <span className="font-medium">Tiles:</span>
                      <span className="ml-1 text-gray-700">{feedbackDetails.feedback.tiles.question || <span className="text-gray-400"  style={{borderRadius: "var(--border-radius)"}}>No tiles</span>}</span>
                     <div className="flex flex-wrap">

                      {feedbackDetails?.feedback && feedbackDetails.feedback.tiles && feedbackDetails.feedback.tiles.tiles.map((tile:any,index:number)=>(
                        <span key={index} className=" border rounded p-2 mt-1 bg-yellow-500 text-white shadow-md ">
                          {tile}
                        </span>
                      ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Deep Feedback Section */}
                {feedbackDetails.feedback.has_deep_feedback ? (
                  <Card  style={{borderRadius: "var(--border-radius)"}} className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-800 text-lg">Detailed Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {feedbackDetails.responses.map((resp) => (
                        <div key={resp.question_id} className="mb-2">
                          <div className="font-medium text-blue-900">
                            {resp.question} <span className="text-xs text-gray-500">({resp.type})</span>
                          </div>
                          <div className="ml-2 mt-1">
                            {(() => {
                              let value = resp.response_value;
                              try {
                                value = JSON.parse(resp.response_value);
                              } catch {}
                              if (Array.isArray(value)) {
                                return value.length > 0
                                  ? value.map((v, i) => <Badge key={i} variant="outline" className="mr-1">{v}</Badge>)
                                  : <span className="text-gray-400">No selection</span>;
                              } else {
                                return value !== undefined && value !== null && value !== ""
                                  ? <span className="bg-white border rounded px-2 py-1"  style={{borderRadius: "var(--border-radius)"}}>{value}</span>
                                  : <span className="text-gray-400">No response</span>;
                              }
                            })()}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-gray-500 text-center">No detailed feedback provided.</div>
                )}
              </div>
            ) : (
              <div>Loading...</div>
            )}
            <DialogFooter>
              <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={() => {
                setSelectedFeedback(null);
                setFeedbackDetails(null);
              }}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Feedback Report</h1>
          <div className="flex space-x-2">
            <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={exportToExcel}>
              <FileText className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
              <div className="space-y-2">
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Brands">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={filters.state} onValueChange={(value) => setFilters({ ...filters, state: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All States">All States</SelectItem>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Select value={filters.city} onValueChange={(value) => setFilters({ ...filters, city: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Cities">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Outlet</Label>
                <Select value={filters.outlet} onValueChange={(value) => setFilters({ ...filters, outlet: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Outlets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Outlets">All Outlets</SelectItem>
                    {outlets.map((outlet) => (
                      <SelectItem key={outlet} value={outlet}>
                        {outlet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Employee</Label>
                <Select value={filters.employee} onValueChange={(value) => setFilters({ ...filters, employee: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Employees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Employees">All Employees</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee} value={employee}>
                        {employee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Status">All Status</SelectItem>
                    <SelectItem value="Perfect">Perfect</SelectItem>
                    <SelectItem value="Counselling">Counselling</SelectItem>
                    <SelectItem value="Needs Review">Needs Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Button  style={{borderRadius: "var(--border-radius)"}}
                variant="outline"
                onClick={() =>
                  setFilters({
                    brand: "All Brands",
                    state: "All States",
                    city: "All Cities",
                    outlet: "All Outlets",
                    employee: "All Employees",
                    status: "All Status",
                    dateFrom: "",
                    dateTo: "",
                  })
                }
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Results */}
        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle>Feedback Entries ({filteredEntries.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search feedback..."
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{entry.customerName}</div>
                        {entry.customerContact && <div className="text-sm text-gray-500">{entry.customerContact}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{entry.employeeName}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{entry.outlet}</div>
                        <div className="text-sm text-gray-500">{entry.brand}</div>
                        <div className="text-sm text-gray-500">
                          {entry.city}, {entry.state}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getRatingStars(entry.rating)}
                        <span className="ml-2 text-sm font-medium">{entry.rating}/5</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={entry.feedback}>
                        {entry.feedback || "Not Entered"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button  style={{borderRadius: "var(--border-radius)"}}
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewFeedback(entry.id,entry.employeeName,entry.outlet,entry.brand,entry.city+", "+entry.state)}
                      >
                        <Eye/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="text-lg">Perfect Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {filteredEntries.filter((entry) => entry.status === "Perfect").length}
              </div>
              <p className="text-sm text-gray-500">
                {Math.round(
                  (filteredEntries.filter((entry) => entry.status === "Perfect").length / filteredEntries.length) * 100,
                )}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="text-lg">Needs Counselling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {filteredEntries.filter((entry) => entry.status === "Counselling").length}
              </div>
              <p className="text-sm text-gray-500">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="text-lg">Needs Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {filteredEntries.filter((entry) => entry.status === "Needs Review").length}
              </div>
              <p className="text-sm text-gray-500">Follow-up required</p>
            </CardContent>
          </Card>

          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="text-lg">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(filteredEntries.reduce((sum, entry) => sum + entry.rating, 0) / filteredEntries.length).toFixed(1)}
              </div>
              <p className="text-sm text-gray-500">Out of 5.0 stars</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedFeedback} onOpenChange={() => {
        setSelectedFeedback(null);
        setFeedbackDetails(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          {feedbackDetails ? (
            <div className="space-y-4">
              <div>
                <strong>Customer:</strong> {feedbackDetails.feedback.customer_name}
              </div>
              <div>
                <strong>Employee:</strong> {feedbackDetails.feedback.employee_name}
              </div>
              <div>
                <strong>Rating:</strong> {feedbackDetails.feedback.rating}
              </div>
              <div>
                <strong>Feedback:</strong> {feedbackDetails.feedback.feedback_text}
              </div>
              {/* Show deep feedback if present */}
              {feedbackDetails.feedback.has_deep_feedback ? (
                <div>
                  <h4 className="font-semibold mt-4 mb-2">Detailed Feedback</h4>
                  {feedbackDetails.responses.map((resp) => (
                    <div key={resp.question_id} className="mb-2">
                      <div className="font-medium">
                        {resp.question} <span className="text-xs text-gray-500">({resp.type})</span>
                      </div>
                      <div className="ml-2">
                        {(() => {
                          let value = resp.response_value;
                          // Try to parse as JSON (for arrays)
                          try {
                            value = JSON.parse(resp.response_value);
                          } catch {
                            // If not JSON, keep as is
                          }
                          if (Array.isArray(value)) {
                            return value.length > 0
                              ? value.map((v, i) => <div key={i}>• {v}</div>)
                              : <span className="text-gray-400">No selection</span>;
                          } else {
                            return value !== undefined && value !== null && value !== ""
                              ? value
                              : <span className="text-gray-400">No response</span>;
                          }
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No detailed feedback provided.</div>
              )}
            </div>
          ) : (
            <div>Loading...</div>
          )}
          <DialogFooter>
            <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={() => {
              setSelectedFeedback(null);
              setFeedbackDetails(null);
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
