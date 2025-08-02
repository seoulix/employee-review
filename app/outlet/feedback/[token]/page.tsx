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
import { useLoading } from "@/contexts/LoadingContext"

interface OutletData {
  outlet_name: string
  brand_name: string
  brand_logo_url?: string
  city_name: string
  state_name: string
  outlet_image?: string
}

interface Employee {
  id: number
  full_name: string
  position: string
  photo?: string
  totalReviews?: number
  rating?: number
  employee_code?: string
  outlet?: string
  brand?: string
  city?: string
  state?: string
  joinDate?: string
  status?: string
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
  const { showLoading, hideLoading, showToast } = useLoading()

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

        console.log('🔍 Feedback link data:', result.data)

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
          brand_logo_url: result.data.brand_logo_url,
          city_name: result.data.city_name,
          state_name: result.data.state_name,
          outlet_image: result.data.outlet_image,
        })
        setFeedbackLinkId(result.data.id)

        // Fetch employees for this outlet
        const employeesResponse = await fetch(`/api/employees/outlet/${result.data.outlet_id}`)
        const employeesResult = await employeesResponse.json()

        if (employeesResult.success) {
          console.log('👥 Employees loaded:', employeesResult.data)
          setEmployees(employeesResult.data)
        } else {
          console.error('❌ Failed to load employees:', employeesResult.message)
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

    showLoading("Submitting your feedback...")
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
        hideLoading()
        showToast("Thank you! Your feedback has been submitted successfully.", "success")
        setIsSubmitted(true)
      } else {
        hideLoading()
        showToast(result.message || "Failed to submit feedback", "error")
        setError(result.message || "Failed to submit feedback")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      hideLoading()
      showToast("Failed to submit feedback. Please try again.", "error")
      setError("Failed to submit feedback. Please try again.")
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
     
      <Card className="w-fit max-w-lg overflow-hidden rounded-3xl border-0 ">
        <CardHeader 
          className="relative p-0 overflow-hidden" 
          style={{
            backgroundImage: `url(${outletData?.outlet_image || '/uploads/outlets/default.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '300px'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          {/* Navigation/Action Icons (like in the photo) */}
          <div className="absolute top-4 left-4 z-20" onClick={()=>{
            router.back()
          }}>
            <button className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          {/* <div className="absolute top-4 right-4 z-20 flex space-x-2">
            <button className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div> */}

          {/* Image Counter (like in the photo) */}
          <div className="absolute bottom-4 right-4 z-20">
            <div className="bg-white bg-opacity-90 rounded-lg px-3 py-1 flex items-center space-x-1 shadow-lg">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">1/1</span>
            </div>
          </div>

          {/* Outlet Details Card (like in the photo) */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="bg-card rounded-t-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground mb-1">
                    {outletData?.outlet_name || 'Restaurant Name'}
                  </h1>
                  <p className="text-muted-foreground text-sm mb-2">
                    {outletData?.city_name}, {outletData?.state_name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {outletData?.brand_name} • Feedback Form
                  </p>
                </div>
                
                {/* Rating Box (like in the photo) */}
                {/* <div className="bg-green-500 text-white rounded-lg px-3 py-2 text-center ml-4">
                  <div className="text-lg font-bold">4.5 ★</div>
                  <div className="text-xs">Google</div>
                  <div className="text-xs">50+ reviews</div>
                </div> */}
              </div>

              {/* Action Icons (like in the photo) */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">Directions</span>
                </button>
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors" onClick={()=>{
                  window.open(`tel:${outletData?.Manager_Phone}`, '_blank')
                }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">Call</span>
                </button>
              </div>
            </div>
          </div>

          {/* Brand Logo (positioned like in the photo) */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
            {outletData?.brand_logo_url ? (
              <div className="w-20 h-20 rounded-full border-4 border-card bg-card shadow-lg flex items-center justify-center">
                <img 
                  src={outletData.brand_logo_url} 
                  alt={`${outletData.brand_name} logo`}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full bg-primary rounded-full flex items-center justify-center"><svg class="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg></div>';
                    }
                  }}
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-primary rounded-full border-4 border-card shadow-lg flex items-center justify-center">
                <Star className="w-8 h-8 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Welcome Message */}
        </CardHeader>

        <CardContent>
          {/* Extraordinary Animated Greeting Card */}
          <div className="relative overflow-hidden rounded-2xl p-6 mb-6 animate-fade-in-up animate-smooth-vibration">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 animate-gradient-shift bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 opacity-90"></div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
              <div className="particle particle-5"></div>
            </div>
            
            {/* Glowing Border */}
            <div className="absolute inset-0 rounded-2xl animate-glow-border"></div>
            
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Animated Icon */}
              {/* <div className="inline-flex items-center justify-center w-16 h-16 mb-4 animate-float">
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
                  <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    
                     
                  </div>
                </div>
              </div> */}
              
                          {/* Animated Text */}
            <h2 className="text-2xl font-bold text-white mb-2 animate-smooth-vibration drop-shadow-lg">
              Welcome back, {formData.customer_name}!
            </h2>
              
              <div className="space-y-1">
                <p className="text-white text-base leading-relaxed animate-slide-in-right drop-shadow-lg">
                  Thank you for choosing us today
                </p>
                <p className="text-blue-100 text-xs animate-fade-in-delay drop-shadow-lg">
                  Your feedback helps us create amazing experiences
                </p>
              </div>
              
              {/* Animated Decorative Elements */}
              <div className="flex justify-center space-x-2 mt-4">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Employee Selection - Enhanced UX with Animations */}
            <div className="space-y-3 animate-fade-in-up-delay">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-blue-600 text-xs font-bold animate-bounce">1</span>
                </div>
                <Label htmlFor="employee" className="text-base font-semibold text-gray-700 animate-slide-in-left">
                  Select Employee *
                </Label>
              </div>
              
              <Select
                value={formData.employee_id}
                onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
                required
              >
                <SelectTrigger className="h-14 text-base transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up">
                  <SelectValue placeholder="Choose the employee who served you" />
                </SelectTrigger>
                <SelectContent className="w-full max-w-md">
                  {employees.map((employee, index) => (
                    <SelectItem 
                      key={employee.id} 
                      value={employee.id.toString()}
                      className="transition-all duration-200 hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-2 min-w-0 w-full">
                        {/* Employee Photo */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {employee.photo ? (
                            <img 
                              src={employee.photo} 
                              alt={employee.full_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="text-gray-600 text-xs font-medium">${employee.full_name.charAt(0)}</span>`;
                                }
                              }}
                            />
                          ) : (
                            <span className="text-gray-600 text-xs font-medium">
                              {employee.full_name.charAt(0)}
                            </span>
                          )}
                        </div>
                        
                        {/* Employee Details */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{employee.full_name}</div>
                          <div className="text-xs text-gray-500 truncate">{employee.position}</div>
                          {employee.outlet && (
                            <div className="text-xs text-gray-400 truncate">{employee.outlet}</div>
                          )}
                        </div>
                        
                        {/* Rating Stats */}
                        <div className="text-right flex-shrink-0 ml-2">
                          {employee.rating && (
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400 text-xs">★</span>
                              <span className="text-xs font-medium text-foreground">{employee.rating}</span>
                            </div>
                          )}
                          {employee.totalReviews && (
                            <div className="text-xs text-muted-foreground">
                              {employee.totalReviews}
                            </div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Selected Employee Details Card */}
              {formData.employee_id && (() => {
                const selectedEmployee = employees.find(emp => emp.id.toString() === formData.employee_id);
                console.log('🎯 Selected employee:', selectedEmployee);
                if (!selectedEmployee) return null;
                
                return (
                  <div className="bg-gradient-to-r from-accent to-accent/50 rounded-xl p-4 border border-accent animate-fade-in-up">
                    <div className="flex items-center space-x-4">
                      {/* Employee Photo */}
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-background border-2 border-accent shadow-sm">
                        {selectedEmployee.photo ? (
                          <img 
                            src={selectedEmployee.photo} 
                            alt={selectedEmployee.full_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full bg-primary/20 rounded-full flex items-center justify-center"><span class="text-primary text-lg font-bold">${selectedEmployee.full_name.charAt(0)}</span></div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary text-lg font-bold">
                              {selectedEmployee.full_name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Employee Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{selectedEmployee.full_name}</h3>
                        <p className="text-muted-foreground">{selectedEmployee.position}</p>
                        {selectedEmployee.outlet && (
                          <p className="text-sm text-muted-foreground">{selectedEmployee.outlet}</p>
                        )}
                        {selectedEmployee.employee_code && (
                          <p className="text-xs text-muted-foreground">ID: {selectedEmployee.employee_code}</p>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className="text-right">
                        {selectedEmployee.rating && (
                          <div className="flex items-center space-x-1 mb-1">
                            <span className="text-yellow-400 text-lg">★</span>
                            <span className="text-lg font-bold text-foreground">{selectedEmployee.rating}</span>
                          </div>
                        )}
                        {selectedEmployee.totalReviews && (
                          <div className="text-sm text-muted-foreground">
                            {selectedEmployee.totalReviews} reviews
                          </div>
                        )}
                        {selectedEmployee.joinDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Since {new Date(selectedEmployee.joinDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Rating - Enhanced UX with Animations */}
            <div className="space-y-4 animate-fade-in-up-delay-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-orange-600 text-xs font-bold animate-bounce">2</span>
                </div>
                <Label className="text-base font-semibold text-foreground animate-slide-in-left">
                  Rate Your Experience *
                </Label>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm animate-fade-in-up">
                <div className="flex justify-center space-x-3">
                  {[1, 2, 3, 4, 5].map((rating, index) => (
                    <button  
                      key={rating}
                      type="button"
                      onClick={() => handleRatingClick(rating)}
                      className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 animate-smooth-vibration ${
                        formData.rating === rating
                          ? "border-orange-500 bg-orange-50 scale-110 shadow-lg animate-bounce"
                          : "border-border hover:border-orange-300 hover:scale-105 hover:shadow-md"
                      }`}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <span className="animate-pulse animate-smooth-vibration">{getRatingEmoji(rating)}</span>
                    </button>
                  ))}
                </div>
                
                {formData.rating > 0 && (
                  <div className="mt-4 text-center animate-fade-in-up">
                    <p className="text-lg font-semibold text-foreground mb-1 animate-slide-in-up">
                      {getRatingText(formData.rating)}
                    </p>
                    <div className="flex items-center justify-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star, index) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 transition-all duration-300 ${
                            star <= formData.rating ? 'text-yellow-400' : 'text-muted-foreground'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          {formData.rating > 0 && (
            <div className="space-y-4 animate-fade-in-up-delay-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-green-600 text-xs font-bold animate-bounce">3</span>
                </div>
                <Label className="text-base font-semibold text-foreground animate-slide-in-left">
                  {formData.rating && tiles[formData.rating].question}
                </Label>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm animate-fade-in-up">
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
                        className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 border-2 hover:scale-110 animate-smooth-vibration ${
                          isSelected 
                            ? "bg-green-500 text-white border-green-500 shadow-lg scale-105 animate-bounce"
                            : "bg-muted text-foreground border-border hover:border-green-300 hover:bg-green-50 hover:scale-105"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <span className="animate-pulse animate-smooth-vibration">{tile.trim()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          

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
