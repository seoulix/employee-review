"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Settings, Bell, MessageSquare, Mail, Save, TestTube, AlertCircle, Loader2 } from "lucide-react"

interface NotificationSettings {
  id?: number
  email_notifications_enabled: boolean
  whatsapp_notifications_enabled: boolean
  high_rating_threshold: number
  low_rating_threshold: number
  admin_emails: string
  admin_phones: string
  email_template_subject: string
  email_template_body: string
  whatsapp_template_name: string
  doubletick_api_key: string
  sender_phone: string
  notification_frequency: string
  business_hours_only: boolean
  weekend_notifications: boolean
}

interface SystemSettings {
  id?: number
  system_name: string
  company_name: string
  support_email: string
  support_phone: string
  app_url: string
  timezone: string
  date_format: string
  currency: string
  language: string
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_notifications_enabled: true,
    whatsapp_notifications_enabled: true,
    high_rating_threshold: 4,
    low_rating_threshold: 2,
    admin_emails: "",
    admin_phones: "",
    email_template_subject: "🌟 Excellent Review Alert - {{employee_name}} ({{rating}}/5)",
    email_template_body: `New excellent review received!

Employee: {{employee_name}}
Customer: {{customer_name}}
Rating: {{rating}}/5
Outlet: {{outlet_name}} ({{brand_name}})
Feedback: {{feedback}}
Time: {{submission_time}}`,
    whatsapp_template_name: "excellent_review_alert",
    doubletick_api_key: "key_Ng2d1NHn1a",
    sender_phone: "",
    notification_frequency: "immediate",
    business_hours_only: false,
    weekend_notifications: true,
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    system_name: "Employee Review System",
    company_name: "Your Company",
    support_email: "support@yourcompany.com",
    support_phone: "+1234567890",
    app_url: process.env.APP_URL || "http://localhost:3000",
    timezone: "UTC",
    date_format: "DD/MM/YYYY",
    currency: "USD",
    language: "en",
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)

      // Load notification settings
      const notificationResponse = await fetch("/api/settings/notifications")
      if (notificationResponse.ok) {
        const notificationData = await notificationResponse.json()
        if (notificationData.data) {
          setNotificationSettings({ ...notificationSettings, ...notificationData.data })
        }
      }

      // Load system settings
      const systemResponse = await fetch("/api/settings/system")
      if (systemResponse.ok) {
        const systemData = await systemResponse.json()
        if (systemData.data) {
          setSystemSettings({ ...systemSettings, ...systemData.data })
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",

      })
    } finally {
      setLoading(false)
    }
  }

  const saveNotificationSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/settings/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationSettings),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Notification settings saved successfully",
        })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving notification settings:", error)
      toast({
        title: "Error",
        description: "Failed to save notification settings",

      })
    } finally {
      setSaving(false)
    }
  }

  const saveSystemSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/settings/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(systemSettings),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "System settings saved successfully",
        })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving system settings:", error)
      toast({
        title: "Error",
        description: "Failed to save system settings",

      })
    } finally {
      setSaving(false)
    }
  }

  const testNotifications = async () => {
    try {
      setTesting(true)
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: notificationSettings.email_notifications_enabled,
          whatsapp: notificationSettings.whatsapp_notifications_enabled,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Test Completed",
          description: `Test notifications sent. Check your email and WhatsApp.`,
        })
      } else {
        throw new Error(result.message || "Test failed")
      }
    } catch (error) {
      console.error("Error testing notifications:", error)
      toast({
        title: "Test Failed",
        description: "Failed to send test notifications",

      })
    } finally {
      setTesting(false)
    }
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
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-gray-500">Manage your system configuration and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Notification Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <div className="text-sm text-gray-500">Send email alerts for high ratings</div>
                      </div>
                      <Switch
                        checked={notificationSettings.email_notifications_enabled}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            email_notifications_enabled: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">WhatsApp Notifications</Label>
                        <div className="text-sm text-gray-500">Send WhatsApp alerts for high ratings</div>
                      </div>
                      <Switch
                        checked={notificationSettings.whatsapp_notifications_enabled}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            whatsapp_notifications_enabled: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="high-rating">High Rating Threshold</Label>
                      <Input
                        id="high-rating"
                        type="number"
                        min="1"
                        max="5"
                        value={notificationSettings.high_rating_threshold}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            high_rating_threshold: Number.parseInt(e.target.value),
                          })
                        }
                      />
                      <div className="text-sm text-gray-500">Send notifications for ratings above this value</div>
                    </div>

                    <div>
                      <Label htmlFor="low-rating">Low Rating Threshold</Label>
                      <Input
                        id="low-rating"
                        type="number"
                        min="1"
                        max="5"
                        value={notificationSettings.low_rating_threshold}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            low_rating_threshold: Number.parseInt(e.target.value),
                          })
                        }
                      />
                      <div className="text-sm text-gray-500">Send alerts for ratings below this value</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Admin Contact Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="admin-emails">Admin Email Addresses</Label>
                      <Textarea
                        id="admin-emails"
                        placeholder="admin1@company.com, admin2@company.com"
                        value={notificationSettings.admin_emails}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            admin_emails: e.target.value,
                          })
                        }
                      />
                      <div className="text-sm text-gray-500">Separate multiple emails with commas</div>
                    </div>

                    <div>
                      <Label htmlFor="admin-phones">Admin Phone Numbers</Label>
                      <Textarea
                        id="admin-phones"
                        placeholder="+1234567890, +0987654321"
                        value={notificationSettings.admin_phones}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            admin_phones: e.target.value,
                          })
                        }
                      />
                      <div className="text-sm text-gray-500">Include country code, separate with commas</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* WhatsApp Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    WhatsApp Configuration
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doubletick-key">DoubleTick API Key</Label>
                      <Input
                        id="doubletick-key"
                        type="password"
                        value={notificationSettings.doubletick_api_key}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            doubletick_api_key: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="sender-phone">Sender Phone Number</Label>
                      <Input
                        id="sender-phone"
                        placeholder="+1234567890"
                        value={notificationSettings.sender_phone}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            sender_phone: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsapp-template">WhatsApp Template Name</Label>
                      <Input
                        id="whatsapp-template"
                        value={notificationSettings.whatsapp_template_name}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            whatsapp_template_name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Email Templates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Template Configuration
                  </h3>

                  <div>
                    <Label htmlFor="email-subject">Email Subject Template</Label>
                    <Input
                      id="email-subject"
                      value={notificationSettings.email_template_subject}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          email_template_subject: e.target.value,
                        })
                      }
                    />
                    <div className="text-sm text-gray-500">
                      Use variables: {`{{employee_name}}, {{rating}}, {{outlet_name}}, {{brand_name}}`}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email-body">Email Body Template</Label>
                    <Textarea
                      id="email-body"
                      rows={6}
                      value={notificationSettings.email_template_body}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          email_template_body: e.target.value,
                        })
                      }
                    />
                    <div className="text-sm text-gray-500">
                      Available variables:{" "}
                      {`{{employee_name}}, {{customer_name}}, {{rating}}, {{outlet_name}}, {{brand_name}}, {{feedback}}, {{submission_time}}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button  style={{borderRadius: "var(--border-radius)"}} onClick={saveNotificationSettings} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Notification Settings
                      </>
                    )}
                  </Button>

                  <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={testNotifications} disabled={testing}>
                    {testing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <TestTube className="mr-2 h-4 w-4" />
                        Test Notifications
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="system-name">System Name</Label>
                      <Input
                        id="system-name"
                        value={systemSettings.system_name}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            system_name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        value={systemSettings.company_name}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            company_name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="support-email">Support Email</Label>
                      <Input
                        id="support-email"
                        type="email"
                        value={systemSettings.support_email}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            support_email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="support-phone">Support Phone</Label>
                      <Input
                        id="support-phone"
                        value={systemSettings.support_phone}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            support_phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="app-url">Application URL</Label>
                      <Input
                        id="app-url"
                        value={systemSettings.app_url}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            app_url: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        value={systemSettings.timezone}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            timezone: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="date-format">Date Format</Label>
                      <Input
                        id="date-format"
                        value={systemSettings.date_format}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            date_format: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        value={systemSettings.currency}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            currency: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button  style={{borderRadius: "var(--border-radius)"}} onClick={saveSystemSettings} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save System Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Business Hours Only</Label>
                      <div className="text-sm text-gray-500">Only send notifications during business hours</div>
                    </div>
                    <Switch
                      checked={notificationSettings.business_hours_only}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          business_hours_only: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Weekend Notifications</Label>
                      <div className="text-sm text-gray-500">Send notifications on weekends</div>
                    </div>
                    <Switch
                      checked={notificationSettings.weekend_notifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          weekend_notifications: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button  style={{borderRadius: "var(--border-radius)"}} onClick={saveNotificationSettings} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Advanced Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
