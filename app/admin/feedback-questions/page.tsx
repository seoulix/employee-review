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
}

const questionTypes = [
  { value: "smiley", label: "Smiley Selector", icon: Smile },
  { value: "star", label: "Star Rating", icon: Star },
  { value: "slider", label: "Slider/Scale", icon: Sliders },
  { value: "text", label: "Text Input", icon: Type },
  { value: "checkbox", label: "Checkbox", icon: CheckSquare },
]
import QRCode from "qrcode";





export default function FeedbackQuestionsPage() {
  const [qrUrl,setQrUrl] = useState('');
  const [showQr,setShowQr] = useState(false);
  const { toast } = useToast()
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [luckyDrawEnabled, setLuckyDrawEnabled] = useState(true)
  const [feedbackRequired, setFeedbackRequired] = useState(false)
  const [newQuestion, setNewQuestion] = useState<Partial<FeedbackQuestion>>({
    question: "",
    type: "smiley",
    required: false,
    is_active: true,
    options: [],
    min_value: 1,
    max_value: 5,
    placeholder: "",
  })

  const [checkboxOptions, setCheckboxOptions] = useState<string[]>([])
  const [newOption, setNewOption] = useState("")


  

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/feedback-questions")
      if (response.ok) {
        const data = await response.json()
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
    try {
      setSaving(true)
      const response = await fetch("/api/feedback-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Question saved successfully",
        })
        loadQuestions()
        setShowAddForm(false)
        setEditingId(null)
        setNewQuestion({
          question: "",
          type: "smiley",
          required: false,
          is_active: true,
          options: [],
          min_value: 1,
          max_value: 5,
          placeholder: "",
        })
      } else {
        throw new Error("Failed to save question")
      }
    } catch (error) {
      console.error("Error saving question:", error)
      toast({
        title: "Error",
        description: "Failed to save question",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      const response = await fetch(`/api/feedback-questions/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Question deleted successfully",
        })
        loadQuestions()
      } else {
        throw new Error("Failed to delete question")
      }
    } catch (error) {
      console.error("Error deleting question:", error)
      toast({
        title: "Error",
        description: "Failed to delete question",
      })
    }
  }

  const saveSettings = async () => {
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
        toast({
          title: "Success",
          description: "Settings saved successfully",
        })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
      })
    } finally {
      setSaving(false)
    }
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
              <Button  style={{borderRadius: "var(--border-radius)"}} key={index} className="text-2xl p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
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

        {/* Add Question Form */}
        {showAddForm && (
          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add New Question</CardTitle>
                <Button  style={{borderRadius: "var(--border-radius)"}} variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  onValueChange={(value: any) => setNewQuestion({ ...newQuestion, type: value })}
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

              <div className="flex gap-2">
                <Button  style={{borderRadius: "var(--border-radius)"}} onClick={() => saveQuestion(newQuestion)} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Question
                    </>
                  )}
                </Button>
                <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={() => setShowAddForm(false)}>
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
                            <Button  style={{borderRadius: "var(--border-radius)"}} variant="ghost" size="sm" onClick={() => setEditingId(question.id)}>
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
