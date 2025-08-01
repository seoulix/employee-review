"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Gift, Clock, Star, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OutletData {
  outlet_name: string
  brand_name: string
  city_name: string
  state_name: string
}

interface Employee {
  id: number
  full_name: string
  position: string
}

interface FeedbackQuestion {
  id: number
  question: string
  type: "smiley" | "star" | "slider" | "text" | "checkbox"
  required: boolean
  options?: string[]
  min_value?: number
  max_value?: number
  placeholder?: string
  order_index: number
  is_active: boolean
}

export default function FeedbackFormPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [formData, setFormData] = useState({
    employee_id: "",
    rating: 0,
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    feedback_text: "",
    additional_details: "",
    wants_detailed_feedback: false,
    unique_id: "",
    tile:{question:"",tiles:[]} as {question:string,tiles:number[]|string[]}
  })


  const [detailedResponses, setDetailedResponses] = useState<Record<number, any>>({})

  const [timeLeft, setTimeLeft] = useState(10000)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [tiles, setTiles] = useState<any>({})
  const [outletData, setOutletData] = useState<OutletData | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [feedbackQuestions, setFeedbackQuestions] = useState<FeedbackQuestion[]>([])
  const [feedbackLinkId, setFeedbackLinkId] = useState<number | null>(null)


  const sendLowRatingAlert = async (feedback_id: number) => {
    const response = await fetch(`/api/messaging?feedback_id=${feedback_id}`)
    const result = await response.json()
    console.log(result)
  }
  // Load outlet and employee data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Fetch outlet data and employees by token
        const response = await fetch(`/api/feedback-links/token/${token}`)
        const result = await response.json()

        // Making the Tiles formating
        setTiles(JSON.parse(result.data.tiles));

        setFormData({
          ...formData,
          unique_id: result.data.unique_id,
          customer_name: result.data.name,
          customer_phone: result.data.phone,
          customer_email: result.data.email,
        })
        if (!result.success) {
          setError("Invalid or expired feedback link")
          setIsExpired(true)
          return
        }

        setOutletData({
          outlet_name: result.data.outlet_name,
          brand_name: result.data.brand_name,
          city_name: result.data.city_name,
          state_name: result.data.state_name,
        })
        setFeedbackLinkId(result.data.id)

        // Fetch employees for this outlet
        const employeesResponse = await fetch(`/api/employees/outlet/${result.data.outlet_id}`)
        const employeesResult = await employeesResponse.json()

        if (employeesResult.success) {
          setEmployees(employeesResult.data)
        }

        // Fetch feedback questions
        const questionsResponse = await fetch('/api/feedback-questions')
        const questionsResult = await questionsResponse.json()

        console.log('Feedback questions response:', questionsResult)

        if (questionsResult.success) {
          setFeedbackQuestions(questionsResult.questions || [])
        } else {
          console.error('Failed to fetch questions:', questionsResult.message)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load feedback form")
        setIsExpired(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      loadData()
    }
  }, [token])


  const handleRatingClick = (rating: number) => {
    
    setFormData({ ...formData, rating,tile:{question:tiles[rating].question,tiles:[]} })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Make the tiles array to string and add to the formData
    const tilesString = tiles[formData.rating].tiles
    .split(",")
    .filter((_, index:number) => formData.tile.tiles.includes(index));
    const tilesSelected = JSON.stringify({question:tiles[formData.rating].question,tiles:tilesString}) 
    
    if (!formData.employee_id || !formData.rating || !formData.customer_name) {
      setError("Please fill in all required fields")
      return
    }

    // Check if detailed feedback is required but not filled
    if (formData.wants_detailed_feedback) {
      const requiredQuestions = feedbackQuestions.filter(q => q.required && q.is_active)
      const missingRequired = requiredQuestions.filter(q => !detailedResponses[q.id])
      
      if (missingRequired.length > 0) {
        setError("Please fill in all required detailed feedback questions")
        return
      }
    }

    if (!feedbackLinkId) {
      setError("Invalid feedback link")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback_link_id: feedbackLinkId,
          employee_id: Number.parseInt(formData.employee_id),
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: formData.customer_email,
          rating: formData.rating,
          feedback_text: formData.feedback_text,
          additional_details: formData.additional_details,
          detailed_responses: formData.wants_detailed_feedback ? detailedResponses : null,
          has_deep_feedback: formData.wants_detailed_feedback,
          feedback_unique_id: formData.unique_id,
          tiles:tilesSelected
        }),
      })

      const result = await response.json()

      if (result.success) {
        if (formData.rating < 4) {
          await sendLowRatingAlert(result.data.id)
        }
        setIsSubmitted(true)
      } else {
        setError(result.message || "Failed to submit feedback")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      setError("Failed to submit feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingEmoji = (rating: number) => {
    const emojis = ["😞", "😕", "😐", "😊", "😍"]
    return emojis[rating - 1] || "😐"
  }

  const getRatingText = (rating: number) => {
    const texts = ["Very Poor", "Poor", "Average", "Good", "Excellent"]
    return texts[rating - 1] || "Not Rated"
  }


  // Helper functions for detailed feedback questions
  const renderQuestion = (question: FeedbackQuestion) => {
    const value = detailedResponses[question.id]
    
    // Debug logging
    console.log('Rendering question:', question)
    console.log('Question options:', question.options, 'Type:', typeof question.options)
    
    try {
    
    switch (question.type) {
      case 'smiley':
        return (
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setDetailedResponses(prev => ({ ...prev, [question.id]: rating }))}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all ${
                  value === rating
                    ? "border-blue-500 bg-blue-50 scale-110"
                    : "border-gray-300 hover:border-gray-400 hover:scale-105"
                }`}
                // style={{borderRadius: "var(--border-radius)"}}
              >
                {getRatingEmoji(rating)}
              </button>
            ))}
          </div>
        )
      
      case 'star':
        return (
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button  
                key={star}
                type="button"
                onClick={() => setDetailedResponses(prev => ({ ...prev, [question.id]: star }))}
                className={`text-2xl transition-colors rounded-full ${
                  value && star <= value ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400`}
                // style={{borderRadius: "var(--border-radius)"}}
              >
                ★
              </button>
            ))}
          </div>
        )
      
      case 'slider':
        const min = question.min_value || 1
        const max = question.max_value || 10
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={min}
              max={max}
              value={value || min}
              onChange={(e) => setDetailedResponses(prev => ({ ...prev, [question.id]: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{min}</span>
              <span className="font-medium">{value || min}</span>
              <span>{max}</span>
            </div>
          </div>
        )
      
      case 'text':
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => setDetailedResponses(prev => ({ ...prev, [question.id]: e.target.value }))}
            placeholder={question.placeholder || "Enter your response..."}
            rows={3}
          />
        )
      
      case 'checkbox':
        // Parse options from JSON string if it's a string, otherwise use as array
        let options = []
        try {
          if (typeof question.options === 'string') {
            options = JSON.parse(question.options || '[]')
          } else if (Array.isArray(question.options)) {
            options = question.options
          }
        } catch (error) {
          console.error('Error parsing checkbox options:', error)
          options = []
        }
        
        // Ensure options is always an array
        if (!Array.isArray(options)) {
          options = []
        }
        
        return (
          <div className="space-y-2">
            {options.length > 0 ? (
              options.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value && Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : []
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option)
                      setDetailedResponses(prev => ({ ...prev, [question.id]: newValues }))
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No options available</p>
            )}
          </div>
        )
      
      default:
        return null
    }
    } catch (error) {
      console.error('Error rendering question:', question, error)
      return (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">Error rendering this question. Please contact support.</p>
        </div>
      )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading feedback form...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isExpired || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-red-700">{error || "Time Expired"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {error || "Sorry, the feedback form has expired. Please request a new link from our staff."}
            </p>
            <p className="text-sm text-gray-500">
              Sorry But this feedback form either already submitted or Invalid/Expired
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-700">Thank You!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Your feedback has been submitted successfully!</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center mb-2">
                <Gift className="h-6 w-6 text-yellow-600 mr-2" />
                <span className="font-semibold text-yellow-800">Surprise Gift Voucher!</span>
              </div>
              <p className="text-sm text-yellow-700">
                You're now eligible to win a surprise gift voucher in our monthly draw!
              </p>
            </div>
            <p className="text-sm text-gray-500">Your feedback helps us improve our service quality.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 dark:text-white dark:bg-[url('https://aws.cloudprojectbootcamp.com/images/starfield.webp')]" >
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold">Hello {formData.customer_name} Thank For Visiting</CardTitle>

          {outletData && (
            <>
              <p className="text-gray-600">
                {outletData.outlet_name} - {outletData.brand_name}
              </p>
              <p className="text-sm text-gray-500">
                {outletData.city_name}, {outletData.state_name}
              </p>
            </>
          )}
          <CardTitle className="text-2xl font-bold">Please Share Your Experience</CardTitle>

          {/* Timer */}
          {/* <div className="flex items-center justify-center mt-4">
            <Clock className="h-4 w-4 text-orange-500 mr-2" />
            <Badge variant={timeLeft <= 5 ? "destructive" : "secondary"}>{timeLeft}s remaining</Badge>
          </div> */}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Employee Selection */}
            <div className="space-y-2">
              <Label htmlFor="employee">Select Employee *</Label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose the employee who served you" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.full_name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <Label>Rate Your Experience *</Label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button  
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl transition-all ${
                      formData.rating === rating
                        ? "border-blue-500 bg-blue-50 scale-110"
                        : "border-gray-300 hover:border-gray-400 hover:scale-105"
                    }`}
                    // style={{borderRadius: "var(--border-radius)"}}
                  >
                    {getRatingEmoji(rating)}
                  </button>
                ))}
              </div>
              {formData.rating > 0 && (
                <p className="text-center text-sm font-medium text-gray-700">{getRatingText(formData.rating)}</p>
              )}
            </div>

          {  formData.rating>0 && <div className="space-y-2 border border-gray-200 rounded-lg p-4">
             <Label htmlFor="Quick_Tiles">{formData.rating && tiles[formData.rating].question}</Label>
             <div className="flex flex-wrap gap-3">
  {formData.rating && tiles[formData.rating].tiles.split(",").map((tile: string, index: number) => {
    const isSelected = formData.tile.tiles.includes(index);

    return (
      <button
        type="button"
        key={index}
        onClick={() => {
          let newTile = [...formData.tile.tiles];
          if (isSelected) {
            newTile = newTile.filter((t) => t !== index);
          } else {
            newTile.push(index);
          }
          setFormData({ ...formData, tile: { ...formData.tile, tiles: newTile } });
        }}
        className={`px-4 py-2 rounded-md text-sm font-medium transition 
          ${isSelected 
            ? "bg-yellow-500 text-white shadow-md hover:bg-yellow-600"
            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"}
        `}
      >
        {tile.trim()}
      </button>
    );
  })}
</div>


            </div>}
          

            {/* Customer Name */}
            {/* <div className="space-y-2">
              <Label htmlFor="customer_name">Your Name *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div> */}

            {/* Optional Contact Info */}
            {/* <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer_phone">Phone (Optional)</Label>
                <Input
                  id="customer_phone"
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  placeholder="Your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email (Optional)</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  placeholder="Your email address"
                />
              </div>
            </div> */}

            {/* Feedback Text */}
            <div className="space-y-2">
              <Label htmlFor="feedback_text">Your Feedback (Optional)</Label>
              <Textarea
                id="feedback_text"
                value={formData.feedback_text}
                onChange={(e) => setFormData({ ...formData, feedback_text: e.target.value })}
                placeholder="Tell us about your experience..."
                rows={3}
              />
            </div>

            {/* Additional Details */}
            <div className="space-y-2">
              <Label htmlFor="additional_details">Additional Comments (Optional)</Label>
              <Textarea
                id="additional_details"
                value={formData.additional_details}
                onChange={(e) => setFormData({ ...formData, additional_details: e.target.value })}
                placeholder="Any additional details..."
                rows={2}
              />
            </div>

            {/* Detailed Feedback Option */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50  dark:text-white dark:bg-black">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="detailed_feedback"
                  checked={formData.wants_detailed_feedback}
                  onChange={(e) => setFormData({ ...formData, wants_detailed_feedback: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="detailed_feedback" className="font-medium">
                  Would you like to provide detailed feedback?
                </Label>
              </div>
              
              {formData.wants_detailed_feedback && (
                <div className="space-y-4 mt-4">
                  <p className="text-sm text-gray-600">
                    Help us improve by answering a few more questions about your experience.
                  </p>
                  
                  {feedbackQuestions.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center">No custom questions available</p>
                  ) : (
                    feedbackQuestions
                      .filter(q => q.is_active)
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((question) => {
                        // console.log('Rendering question:', question)
                        return (
                          <div key={question.id} className="space-y-3 p-4 bg-white dark:text-white dark:bg-gray-900 rounded-lg border">
                            <div className="flex items-center space-x-2">
                              <Label className="font-medium">
                                {question.question}
                                {question.required===true && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                            </div>
                            {renderQuestion(question)}
                          </div>
                        )
                      })
                  )}
                </div>
              )}
            </div>

            {/* Motivational Note */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Gift className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="font-semibold text-yellow-800">Win a Surprise Gift Voucher!</span>
              </div>
              <p className="text-sm text-yellow-700 text-center">
                {formData.wants_detailed_feedback?"Complete this":"Give Us a"} Detailed feedback and get a chance to win exciting prizes in our monthly draw!
              </p>
            </div>

            {/* Submit Button */}
            <Button  style={{borderRadius: "var(--border-radius)"}}
              type="submit"
              className="w-full border  bg-white text-black dark:text-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-800"
              disabled={
                !formData.employee_id || !formData.rating || !formData.customer_name || timeLeft === 0 || isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Your feedback is valuable to us and helps improve our service quality.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
