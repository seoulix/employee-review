"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  GripVertical,
  Smile,
  Star,
  Sliders,
  Type,
  CheckSquare,
  Loader2,
  ArrowUp,
} from "lucide-react"

interface FeedbackQuestion {
  id: string
  question: string
  type: "smiley" | "star" | "slider" | "text" | "checkbox"
  required: boolean
  options?: string[]
  min_value?: number
  max_value?: number
  placeholder?: string
  order_index: number
  is_active: boolean
  outlet_ids?: string[] // Add outlet_ids field
}

interface Outlet {
  id: string
  name: string
  address: string
  brand: string
  city: string
  state: string
}

const questionTypes = [
  { value: "smiley", label: "Smiley Selector", icon: Smile },
  { value: "star", label: "Star Rating", icon: Star },
  { value: "slider", label: "Slider/Scale", icon: Sliders },
  { value: "text", label: "Text Input", icon: Type },
  { value: "checkbox", label: "Checkbox", icon: CheckSquare },
]
import QRCode from "qrcode";
import { useLoading } from "@/contexts/LoadingContext"





export default function FeedbackQuestionsPage() {
  const [qrUrl,setQrUrl] = useState('');
  const [showQr,setShowQr] = useState(false);
  const { toast } = useToast()
  const { showLoading, hideLoading, showToast } = useLoading()
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [luckyDrawEnabled, setLuckyDrawEnabled] = useState(true)
  const [feedbackRequired, setFeedbackRequired] = useState(false)
  const [alert, setAlert] = useState<{
    show: boolean;
    title: string;
    message: string;
    icon?: any;
    iconColor?: string;
  }>({
    show: false,
    title: "",
    message: "",
    icon: null,
    iconColor: "success"
  })
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>([])
  const [newQuestion, setNewQuestion] = useState<Partial<FeedbackQuestion>>({
    question: "",
    type: "smiley",
    required: false,
    is_active: true,
    options: [],
    min_value: 1,
    max_value: 5,
    placeholder: "",
    outlet_ids: [],
  })

  const [checkboxOptions, setCheckboxOptions] = useState<string[]>([])
  const [newOption, setNewOption] = useState("")


  

  useEffect(() => {
    loadQuestions()
    fetchOutlets()
  }, [])

  // Debug useEffect to track state changes
  useEffect(() => {
    console.log('State changed - showAddForm:', showAddForm, 'editingId:', editingId)
  }, [showAddForm, editingId])

  const fetchOutlets = async () => {
    try {
      const response = await fetch("/api/outlets")
      if (response.ok) {
        const data = await response.json()
        setOutlets(data.data || [])
      }
    } catch (error) {
      console.error("Error loading outlets:", error)
    }
  }

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/feedback-questions")
      if (response.ok) {
        const data = await response.json()
        console.log("||------------Loading Questions------------||")
        console.log(data.questions)
        console.log("||--------------Questions Loaded----------||")
        setQuestions(data.questions || [])
        setLuckyDrawEnabled(data.settings?.lucky_draw_enabled ?? true)
        setFeedbackRequired(data.settings?.feedback_required ?? false)
      }
    } catch (error) {
      console.error("Error loading questions:", error)
      toast({
        title: "Error",
        description: "Failed to load feedback questions",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveQuestion = async (question: Partial<FeedbackQuestion>) => {
    showLoading(editingId ? "Updating question..." : "Saving question...");
    
    try {
      setSaving(true)
      const url = editingId 
        ? `/api/feedback-questions/${editingId}`
        : "/api/feedback-questions"
      
      const method = editingId ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      })

      if (response.ok) {
        hideLoading();
        showToast(editingId ? "Question updated successfully!" : "Question saved successfully!", "success");
        loadQuestions()
        setShowAddForm(false)
        setEditingId(null)
        resetForm()
      } else {
        throw new Error(editingId ? "Failed to update question" : "Failed to save question")
      }
    } catch (error) {
      console.error("Error saving question:", error)
      hideLoading();
      showToast(editingId ? "Failed to update question" : "Failed to save question", "error");
    } finally {
      setSaving(false)
    }
  }

  const deleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    showLoading("Deleting question...");

    try {
      const response = await fetch(`/api/feedback-questions/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        hideLoading();
        showToast("Question deleted successfully!", "success");
        loadQuestions()
      } else {
        throw new Error("Failed to delete question")
      }
    } catch (error) {
      console.error("Error deleting question:", error)
      hideLoading();
      showToast("Failed to delete question", "error");
    }
  }

  const saveSettings = async () => {
    showLoading("Saving settings...");
    
    try {
      setSaving(true)
      const response = await fetch("/api/feedback-questions/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lucky_draw_enabled: luckyDrawEnabled,
          feedback_required: feedbackRequired,
        }),
      })

      if (response.ok) {
        hideLoading();
        showToast("Settings saved successfully!", "success");
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      hideLoading();
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setNewQuestion({
      question: "",
      type: "smiley",
      required: false,
      is_active: true,
      options: [],
      min_value: 1,
      max_value: 5,
      placeholder: "",
      outlet_ids: [],
    })
    setCheckboxOptions([])
    setNewOption("")
    setSelectedOutlets([])
  }

  const startEditing = (question: FeedbackQuestion) => {
    console.log('startEditing called with question:', question)
    setEditingId(question.id)
    setShowAddForm(true)
    
    // Parse options for checkbox type
    let options: string[] = []
    if (question.type === "checkbox" && question.options) {
      try {
        if (typeof question.options === 'string') {
          options = JSON.parse(question.options)
        } else if (Array.isArray(question.options)) {
          options = question.options
        }
      } catch (error) {
        console.error('Error parsing checkbox options:', error)
        options = []
      }
    }
    
    // Parse outlet_ids
    let outletIds: string[] = []
    if (question.outlet_ids) {
      try {
        if (typeof question.outlet_ids === 'string' && question.outlet_ids.length>0) {
          outletIds = question.outlet_ids.split(',')
        } else if (Array.isArray(question.outlet_ids)) {
          outletIds = question.outlet_ids
        }
      } catch (error) {
        console.error('Error parsing outlet_ids:', error)
        outletIds = []
      }
    }
    
    console.log('Setting checkbox options:', options)
    console.log('Setting outlet IDs:', outletIds)
    setCheckboxOptions(options)
    setSelectedOutlets(outletIds)
    setNewQuestion({
      question: question.question,
      type: question.type,
      required: question.required,
      is_active: question.is_active,
      options: options,
      min_value: question.min_value,
      max_value: question.max_value,
      placeholder: question.placeholder,
      outlet_ids: outletIds,
    })
    console.log('Form should now be visible with editingId:', question.id)
  }

  const cancelEdit = () => {
    setShowAddForm(false)
    setEditingId(null)
    resetForm()
  }

  const getQuestionTypeIcon = (type: string) => {
    const typeConfig = questionTypes.find((t) => t.value === type)
    return typeConfig ? typeConfig.icon : Type
  }

  const renderQuestionPreview = (question: FeedbackQuestion) => {
    const IconComponent = getQuestionTypeIcon(question.type)

    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"  style={{borderRadius: "var(--border-radius)"}}>
        <div className="flex items-center gap-2 mb-2">
          <IconComponent className="h-4 w-4" />
          <span className="font-medium">{question.question}</span>
          {question.required && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
        </div>

        {question.type === "smiley" && (
          <div className="flex gap-2">
            {["😞", "😕", "😐", "😊", "😍"].map((emoji, index) => (
              <button  style={{borderRadius: "var(--border-radius)"}} key={index} className="text-2xl p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                {emoji}
              </button>
            ))}
          </div>
        )}

        {question.type === "star" && (
          <div className="flex gap-1">
            {Array.from({ length: question.max_value || 5 }, (_, i) => (
              <Star key={i} className="h-6 w-6 text-gray-300 hover:text-yellow-400" />
            ))}
          </div>
        )}

        {question.type === "slider" && (
          <div className="flex items-center gap-4">
            <span className="text-sm">{question.min_value || 1}</span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <span className="text-sm">{question.max_value || 5}</span>
          </div>
        )}

        {question.type === "text" && (
          <input
            type="text"
            placeholder={question.placeholder || "Enter your response..."}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            disabled
          />
        )}

        {question.type === "checkbox" && (
          <div className="space-y-2">
            {(() => {
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
              return Array.isArray(options) ? options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="checkbox" disabled />
                  <span className="text-sm">{option}</span>
                </div>
              )) : (
                <div className="flex items-center gap-2">
                  <input type="checkbox" disabled />
                  <span className="text-sm">No options configured</span>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {alert.show && <div className="fixed bg-white top-0 left-0 w-full bg-opacity-50 z-50 flex items-center justify-center">
        <div className=" p-4 rounded-lg">
          <h2 className="text-lg font-bold">{alert.title}{alert.icon != null && <alert.icon   className={`h-7 w-7 inline  text-${alert.iconColor=="success"?"green-500":"red-500"}`} />}</h2>
          <p className="text-sm text-gray-500">{alert.message}</p>
        </div>
      </div>}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Feedback Questions</h1>
            <p className="text-gray-500 dark:text-gray-400">Customize your feedback collection form</p>
          </div>
          <Button  style={{borderRadius: "var(--border-radius)"}} 
            onClick={() => {
              console.log('Add Question button clicked')
              console.log('Current showAddForm state:', showAddForm)
              setShowAddForm(true)
              console.log('Setting showAddForm to true')
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        {/* Settings Card */}
        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle>Feedback Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Lucky Draw Participation</Label>
                <div className="text-sm text-gray-500">Allow customers to participate in lucky draw</div>
              </div>
              <Switch checked={luckyDrawEnabled} onCheckedChange={setLuckyDrawEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Feedback Required</Label>
                <div className="text-sm text-gray-500">Make feedback questions mandatory</div>
              </div>
              <Switch checked={feedbackRequired} onCheckedChange={setFeedbackRequired} />
            </div>

            <Button  style={{borderRadius: "var(--border-radius)"}} onClick={saveSettings} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Add/Edit Question Form */}
        {showAddForm && (
          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingId ? "Edit Question" : "Add New Question"}</CardTitle>
                <Button  style={{borderRadius: "var(--border-radius)"}} variant="ghost" size="sm" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Debug info */}
              <div className="text-xs text-gray-500 mb-4">
                Debug: showAddForm={showAddForm.toString()}, editingId={editingId || 'null'}
              </div>
              
              <div>
                <Label htmlFor="question">Question Text</Label>
                <Input
                  id="question"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  placeholder="Enter your question..."
                />
              </div>

              <div>
                <Label htmlFor="type">Question Type</Label>
                <Select
                  value={newQuestion.type}
                  onValueChange={(value: any) => {
                    setNewQuestion({ ...newQuestion, type: value })
                    // Reset options when type changes
                    if (value !== "checkbox") {
                      setCheckboxOptions([])
                      setNewQuestion(prev => ({ ...prev, options: [] }))
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(newQuestion.type === "slider" || newQuestion.type === "star") && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_value">Min Value</Label>
                    <Input
                      id="min_value"
                      type="number"
                      value={newQuestion.min_value}
                      onChange={(e) => setNewQuestion({ ...newQuestion, min_value: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_value">Max Value</Label>
                    <Input
                      id="max_value"
                      type="number"
                      value={newQuestion.max_value}
                      onChange={(e) => setNewQuestion({ ...newQuestion, max_value: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              {newQuestion.type === "text" && (
                <div>
                  <Label htmlFor="placeholder">Placeholder Text</Label>
                  <Input
                    id="placeholder"
                    value={newQuestion.placeholder}
                    onChange={(e) => setNewQuestion({ ...newQuestion, placeholder: e.target.value })}
                    placeholder="Enter placeholder text..."
                  />
                </div>
              )}

              {newQuestion.type === "checkbox" && (
                <div className="space-y-3">
                  <Label>Checkbox Options</Label>
                  <div className="space-y-2">
                    {checkboxOptions.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...checkboxOptions]
                            newOptions[index] = e.target.value
                            setCheckboxOptions(newOptions)
                            setNewQuestion({ ...newQuestion, options: newOptions })
                          }}
                          placeholder="Option text..."
                        />
                        <Button  style={{borderRadius: "var(--border-radius)"}}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = checkboxOptions.filter((_, i) => i !== index)
                            setCheckboxOptions(newOptions)
                            setNewQuestion({ ...newQuestion, options: newOptions })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Add new option..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newOption.trim()) {
                            const newOptions = [...checkboxOptions, newOption.trim()]
                            setCheckboxOptions(newOptions)
                            setNewQuestion({ ...newQuestion, options: newOptions })
                            setNewOption("")
                          }
                        }}
                      />
                      <Button  style={{borderRadius: "var(--border-radius)"}}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (newOption.trim()) {
                            const newOptions = [...checkboxOptions, newOption.trim()]
                            setCheckboxOptions(newOptions)
                            setNewQuestion({ ...newQuestion, options: newOptions })
                            setNewOption("")
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={newQuestion.required}
                  onCheckedChange={(checked) => setNewQuestion({ ...newQuestion, required: checked })}
                />
                <Label htmlFor="required">Required Question</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newQuestion.is_active}
                  onCheckedChange={(checked) => setNewQuestion({ ...newQuestion, is_active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>

<div className="space-y-3">
  <Label>Select Outlets (Optional)</Label>
  <div className="space-y-2">
    <div className="text-sm text-gray-500 mb-2">
      Leave empty to make this question available for all outlets, or select specific outlets to make it exclusive.
    </div>
    <div className="max-h-40 overflow-y-auto border rounded-md p-2">
      {outlets.map((outlet) => (
        <div key={outlet.id} className="flex items-center space-x-2 py-1">
          <input
            type="checkbox"
            id={`outlet-${outlet.id}`}
            checked={selectedOutlets?.includes(`${outlet.id}`) }
            
            onChange={(e) => {
              console.log("||------------Outlet Checked------------||")
              console.log(e.target.checked)
              console.log(outlet.id)
              console.log(selectedOutlets)
              console.log("||--------------Outlet Checked----------||")
              if (e.target.checked) {
                const newSelected = [...selectedOutlets, outlet.id]
                setSelectedOutlets(newSelected)
                setNewQuestion({ ...newQuestion, outlet_ids: newSelected })
              } else {
                const newSelected = selectedOutlets.filter(id => id !== outlet.id)
                setSelectedOutlets(newSelected)
                setNewQuestion({ ...newQuestion, outlet_ids: newSelected })
              }
            }}
            className="rounded"
          />
          <label htmlFor={`outlet-${outlet.id}`} className="text-sm cursor-pointer flex-1">
            <div className="font-medium">{outlet.name}</div>
            <div className="text-xs text-gray-500">{outlet.address}</div>
            <div className="text-xs text-gray-400">{outlet.brand} • {outlet.city}, {outlet.state}</div>
          </label>
        </div>
      ))}
    </div>
    {selectedOutlets.length > 0 && (
      <div className="text-xs text-blue-600">
        Selected: {selectedOutlets.length} outlet(s)
      </div>
    )}
  </div>
</div>


              <div className="flex gap-2">
                <Button  style={{borderRadius: "var(--border-radius)"}} onClick={() => {
                  saveQuestion(newQuestion)
                  setAlert({show:true,title:"Question Saved",message:"The Question is now Saved"})
                  setTimeout(()=>setAlert({show:false,title:"",message:""}),2000)
                  }} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingId ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingId ? "Update Question" : "Save Question"}
                    </>
                  )}
                </Button>
                <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questions List */}
        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle>Current Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No questions configured yet. Add your first question above.
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                    <div className="flex items-start gap-4">
                      <div className="mt-2">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {questionTypes.find((t) => t.value === question.type)?.label}
                            </Badge>
                            {question.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                            {!question.is_active && (
                              <Badge variant="secondary" className="text-xs">
                                Inactive
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button  style={{borderRadius: "var(--border-radius)"}} variant="ghost" size="sm" onClick={() => {
                              
                              console.log('Edit button clicked for question:', question.id)
                              startEditing(question)
                              setAlert({show:true,icon:ArrowUp,iconColor:"success",title:"Go Above to Edit",message:"The Editing Section is now Open"})
                        setTimeout(()=>setAlert({show:false,icon:null,iconColor:"success",title:"",message:""}),6000)
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button  style={{borderRadius: "var(--border-radius)"}} variant="ghost" size="sm" onClick={() => deleteQuestion(question.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <h3 className="font-medium">{question.question}</h3>

                        {renderQuestionPreview(question)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
