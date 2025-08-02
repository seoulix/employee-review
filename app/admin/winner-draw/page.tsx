"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Gift, Download, Shuffle, Star, Phone, Mail, MapPin, Eye } from "lucide-react"
import { useLoading } from "@/contexts/LoadingContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Winner {
  id: number
  name: string
  customer_phone: string
  customer_email: string
  total_reviews: number
  last_review_date: string,
  customer_name: string,
  photo?: string
  city?: string
  state?: string
  feedbackHighlight?: string
  reviews?: any[]
}

export default function WinnerDrawPage() {
  const { showLoading, hideLoading, showToast } = useLoading()
  
  const [filters, setFilters] = useState({
    outlet: "",
    city: "",
    state: "",
    brand: "",
    month: new Date().toISOString().slice(0, 7), // Current month
  })

  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const [outlets, setOutlets] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])

  const [loading, setLoading] = useState(false)

  const [eligibleCustomers, setEligibleCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Winner | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [reviewDetails, setReviewDetails] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      const res = await fetch("/api/feedback/filters")
      const json = await res.json()
      if (json.success) {
        setBrands(json.data.brands)
        setStates(json.data.states)
        setCities(json.data.cities)
        setOutlets(json.data.outlets)
      }
    }
    fetchFilters()
  }, [])

  useEffect(() => {
    const fetchEligibleCustomers = async () => {
      const res = await fetch("/api/winner-draw/eligible-customers");
      const json = await res.json();
      if (json.success) setEligibleCustomers(json.data);
      setLoading(false);
    };
    fetchEligibleCustomers();
  }, []);



  // Fetch on mount and when filters change


  const conductDraw = () => {
    if (eligibleCustomers.length === 0) return;
    setIsDrawing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * eligibleCustomers.length);
      setSelectedWinner(eligibleCustomers[randomIndex]);
      setIsDrawing(false);
    }, 2000);
  };

  const exportReport = () => {
    if (!selectedWinner) return

    const reportData = {
      "Winner Name": selectedWinner.customer_name,
      Phone: selectedWinner.customer_phone,
      Email: selectedWinner.customer_email,
      // "Average Rating": selectedWinner.totalReviews,
      "Total Reviews": selectedWinner.total_reviews,
      "Last Reviewed Date": new Date(selectedWinner.last_review_date).toLocaleDateString(),
      "Winner of Month": filters.month,
    }

    const csvContent = [
      Object.keys(reportData).join(","),
      Object.values(reportData)
        .map((value) => `"${value}"`)
        .join(","),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `winner-report-${filters.month}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }


  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Monthly Winner Draw</h1>
          {selectedWinner && (
            <Button  style={{borderRadius: "var(--border-radius)"}} onClick={exportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="mr-2 h-5 w-5" />
              Selection Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <Label>Month</Label>
                <input
                  type="month"
                  value={filters.month}
                  onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
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
                    <SelectItem value="all">All States</SelectItem>
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
                    <SelectItem value="all">All Cities</SelectItem>
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
                    <SelectItem value="all">All Outlets</SelectItem>
                    {outlets.map((outlet) => (
                      <SelectItem key={outlet} value={outlet}>
                        {outlet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex space-x-4">
              <Button  style={{borderRadius: "var(--border-radius)"}}
                variant="outline"
                onClick={() =>
                  setFilters({
                    outlet: "",
                    city: "",
                    state: "",
                    brand: "",
                    month: new Date().toISOString().slice(0, 7),
                  })
                }
              >
                Clear Filters
              </Button>
              <Button  style={{borderRadius: "var(--border-radius)"}}
                onClick={conductDraw}
                disabled={isDrawing || eligibleCustomers.length === 0}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Shuffle className={`mr-2 h-4 w-4 ${isDrawing ? "animate-spin" : ""}`} />
                {isDrawing ? "Drawing Winner..." : "Conduct Draw"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Eligible Customers */}
        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle>Eligible Customers ({eligibleCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading eligible customers...</div>
            ) : eligibleCustomers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No eligible customers found with current filters</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {eligibleCustomers.map((customer:Winner) => (
                  <div key={customer.customer_email + customer.customer_phone} className="p-4 border rounded-lg bg-card">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar>
                        <AvatarFallback>
                          {customer.customer_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground">{customer.customer_name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.customer_email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Reviews: {customer.total_reviews}</p>
                      <Badge variant="secondary">Customer</Badge>
                      <Button  style={{borderRadius: "var(--border-radius)"}}
        size="sm"
        variant="outline"
        className="mt-2"
        onClick={() => setSelectedCustomer(customer)}
      >
        <Eye/>
      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Winner Display */}
        {selectedWinner && (
          <Card  style={{borderRadius: "var(--border-radius)"}} className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Gift className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-yellow-800">🎉 Monthly Winner Selected! 🎉</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={selectedWinner.photo || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {selectedWinner.customer_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">{selectedWinner.customer_name}</h2>
                    <p className="text-lg text-gray-600">{selectedWinner.customer_email}</p>
                    <p className="text-md text-gray-500">{selectedWinner.customer_phone}</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card  style={{borderRadius: "var(--border-radius)"}}>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedWinner.customer_phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedWinner.customer_email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>
                          {/* Assuming city and state are available in selectedWinner or can be derived */}
                          {/* For now, using placeholder values or assuming they are part of the customer object */}
                          {selectedWinner.city || "N/A"}, {selectedWinner.state || "N/A"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card  style={{borderRadius: "var(--border-radius)"}}>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Total Reviews:</span>
                        <span className="font-bold">{selectedWinner.total_reviews}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last Reviewed Date:</span>
                        <span className="font-bold">{new Date(selectedWinner.last_review_date).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card  style={{borderRadius: "var(--border-radius)"}} className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Feedback Highlight</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="italic text-gray-700 border-l-4 border-yellow-400 pl-4">
                      "{selectedWinner.feedbackHighlight}"
                    </blockquote>
                  </CardContent>
                </Card>

                <div className="mt-6 text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    Congratulations the selected winner via Email Whatsapp as this month's winner!
                  </p>
                  <p className="text-gray-600 mt-2">
                    Selected from {eligibleCustomers.length} eligible customers for {filters.month}
                  </p>
                  <a href={`https://wa.me/${selectedWinner.customer_phone}?text=Hey%20Congratulation%20you%20have%20been%20selected%20as%20winner%20for%20your%20Feedback%20at%20Seoulix`} target="_blank">

                  <Button  style={{borderRadius: "var(--border-radius)"}} className="bg-green-400 btn rounded-lg py-3 cursor-pointer   text-white mx-2 my-5" >
Whatsapp
                  </Button>
                  </a>
                  <a className=" btn bg-blue-300 rounded-lg py-3 cursor-pointer hover:bg-black text-white  px-10 my-5" href={`mailto:${selectedWinner.customer_email}`} target="_blank">
Email
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {/* <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle>How Winner Selection Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Eligibility Criteria:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Minimum 4.0 average rating</li>
                  <li>• At least 20 customer reviews</li>
                  <li>• Active employee status</li>
                  <li>• No disciplinary actions in the month</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Selection Process:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Random selection from eligible employees</li>
                  <li>• Filters can be applied to narrow selection</li>
                  <li>• Winner details are automatically generated</li>
                  <li>• Report can be exported for records</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card> */}

        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Customer Details & Recent Reviews</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide space-y-4">
                <Card  style={{borderRadius: "var(--border-radius)"}} className="bg-card border-none shadow-none">
                  <CardContent className="p-4 space-y-2">
                    <div className="text-lg font-semibold text-foreground">{selectedCustomer.customer_name}</div>
                    <div className="text-sm text-muted-foreground">{selectedCustomer.customer_email}</div>
                    <div className="text-sm text-muted-foreground">{selectedCustomer.customer_phone}</div>
                    <div className="text-sm text-muted-foreground">Total Reviews: {selectedCustomer.total_reviews}</div>
                  </CardContent>
                </Card>
                <Card  style={{borderRadius: "var(--border-radius)"}} className="bg-accent border-accent">
                  <CardHeader>
                    <CardTitle className="text-accent-foreground text-lg">Recent Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedCustomer.reviews && selectedCustomer.reviews.length > 0 ? (
                      selectedCustomer.reviews.map((review) => (
                        <div key={review.id} className="mb-2 p-2 border rounded bg-background">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">Date:</span>
                            <span className="text-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">Rating:</span>
                            <span className="text-foreground">{review.rating}</span>
                          </div>
                          <div className="truncate text-foreground"><strong>Feedback:</strong> {review.feedback_text}</div>
                          <Button  style={{borderRadius: "var(--border-radius)"}}
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={async () => {
                              setReviewLoading(true);
                              setSelectedReviewId(review.id);
                              setReviewDetails(null); // Clear previous details
                              const res = await fetch(`/api/feedback/${review.id}`);
                              const json = await res.json();
                              if (json.success) setReviewDetails(json.data);
                              setReviewLoading(false);
                            }}
                          >
                            View Review
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground">No reviews found.</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            <DialogFooter>
              <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!selectedReviewId} onOpenChange={() => {
          setSelectedReviewId(null);
          setReviewDetails(null);
          setReviewLoading(false);
        }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            {reviewLoading ? (
              <div className="flex items-center justify-center h-32">
                <span className="animate-spin mr-2">🔄</span>
                <span>Loading review details...</span>
              </div>
            ) : reviewDetails ? (
              <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide space-y-4">
                {/* Use the same beautiful UI as in your feedback report modal */}
                {/* Example: */}
                <Card  style={{borderRadius: "var(--border-radius)"}} className="bg-card border-none shadow-none">
                  <CardContent className="p-4 space-y-2">
                    <div className="text-lg font-semibold text-foreground">{reviewDetails.feedback.customer_name}</div>
                    <div className="text-sm text-muted-foreground">{reviewDetails.feedback.created_at && new Date(reviewDetails.feedback.created_at).toLocaleString()}</div>
                    <div className="font-medium text-foreground">Rating: {reviewDetails.feedback.rating}</div>
                    <div className="font-medium text-foreground">Feedback: {reviewDetails.feedback.feedback_text || "No Feedback Text Entered"}</div>
                                          {reviewDetails.feedback.has_deep_feedback ? (
  <Card  style={{borderRadius: "var(--border-radius)"}} className="bg-accent border-accent mt-4">
    <CardHeader>
      <CardTitle className="text-accent-foreground text-lg">Detailed Feedback</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {reviewDetails.responses && reviewDetails.responses.length > 0 ? (
        reviewDetails.responses.map((resp) => (
          <div key={resp.question_id} className="mb-2">
            <div className="font-medium text-foreground">
              {resp.question} <span className="text-xs text-muted-foreground">({resp.type})</span>
            </div>
            <div className="ml-2 mt-1">
              {(() => {
                let value = resp.response_value;
                try { value = JSON.parse(resp.response_value); } catch {}
                if (Array.isArray(value)) {
                  return value.length > 0
                    ? value.map((v, i) => <Badge key={i} variant="outline" className="mr-1">{v}</Badge>)
                    : <span className="text-muted-foreground">No selection</span>;
                } else {
                  return value !== undefined && value !== null && value !== ""
                    ? <span className="bg-background border rounded px-2 py-1 text-foreground">{value}</span>
                    : <span className="text-muted-foreground">No response</span>;
                }
              })()}
            </div>
          </div>
        ))
      ) : (
        <div className="text-muted-foreground">No detailed feedback provided.</div>
      )}
    </CardContent>
  </Card>
) : (
  <div className="text-muted-foreground text-center mt-4">No detailed feedback provided.</div>
)}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div>No review details found.</div>
            )}
            <DialogFooter>
              <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={() => {
                setSelectedReviewId(null);
                setReviewDetails(null);
                setReviewLoading(false);
              }}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
