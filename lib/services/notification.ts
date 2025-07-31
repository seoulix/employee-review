import Database from "../database"

const DOUBLETICK_API_URL = "https://public.doubletick.io/whatsapp/message/template"

interface NotificationData {
  employeeName: string
  customerName: string
  rating: number
  feedback: string
  outlet: string
  brand: string
  submissionTime: string
}

interface NotificationSettings {
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
  business_hours_only: boolean
  weekend_notifications: boolean
}

export class NotificationService {
  // Get notification settings from database
  static async getNotificationSettings(): Promise<NotificationSettings | null> {
    try {
      const settings = await Database.queryOne(`
        SELECT * FROM admin_notification_preferences WHERE id = 1
      `)
      return settings
    } catch (error) {
      console.error("Error fetching notification settings:", error)
      return null
    }
  }

  // Check if notifications should be sent based on business rules
  static shouldSendNotification(settings: NotificationSettings): boolean {
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay() // 0 = Sunday, 6 = Saturday

    // Check business hours (9 AM to 6 PM)
    if (settings.business_hours_only && (hour < 9 || hour > 18)) {
      return false
    }

    // Check weekend notifications
    if (!settings.weekend_notifications && (day === 0 || day === 6)) {
      return false
    }

    return true
  }

  // Replace template variables
  static replaceTemplateVariables(template: string, data: NotificationData): string {
    return template
      .replace(/\{\{employee_name\}\}/g, data.employeeName)
      .replace(/\{\{customer_name\}\}/g, data.customerName)
      .replace(/\{\{rating\}\}/g, data.rating.toString())
      .replace(/\{\{outlet_name\}\}/g, data.outlet)
      .replace(/\{\{brand_name\}\}/g, data.brand)
      .replace(/\{\{feedback\}\}/g, data.feedback)
      .replace(/\{\{submission_time\}\}/g, new Date(data.submissionTime).toLocaleString())
  }

  // Send WhatsApp notification
  static async sendWhatsAppNotification(data: NotificationData, adminPhone: string, settings: NotificationSettings) {
    try {
      const message = {
        messages: [
          {
            content: {
              language: "en",
              templateData: {
                header: {
                  type: "TEXT",
                  placeholder: "🌟 Review Alert!",
                },
                body: {
                  placeholders: [
                    data.employeeName,
                    data.customerName,
                    data.rating.toString(),
                    data.outlet,
                    data.brand,
                    data.feedback.substring(0, 100) + (data.feedback.length > 100 ? "..." : ""),
                    new Date(data.submissionTime).toLocaleString(),
                  ],
                },
              },
              templateName: settings.whatsapp_template_name,
            },
            from: settings.sender_phone,
            to: adminPhone,
            messageId: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          },
        ],
      }

      const response = await fetch(DOUBLETICK_API_URL, {
        method: "POST",
        headers: {
          Authorization: settings.doubletick_api_key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })

      const result = await response.json()

      if (response.ok) {
        console.log("WhatsApp notification sent successfully:", result)
        return { success: true, data: result }
      } else {
        console.error("WhatsApp notification failed:", result)
        return { success: false, error: result }
      }
    } catch (error) {
      console.error("Error sending WhatsApp notification:", error)
      return { success: false, error: error }
    }
  }

  // Send email notification (placeholder - integrate with your email service)
  static async sendEmailNotification(data: NotificationData, adminEmail: string, settings: NotificationSettings) {
    try {
      const subject = this.replaceTemplateVariables(settings.email_template_subject, data)
      const body = this.replaceTemplateVariables(settings.email_template_body, data)

      const emailData = {
        to: adminEmail,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">${data.rating > 4 ? "🌟 Excellent" : data.rating < 3 ? "⚠️ Poor" : "📊 Average"} Review Alert!</h1>
            </div>
            
            <div style="padding: 20px; background: #f8f9fa;">
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Review Details</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Employee:</td>
                    <td style="padding: 8px 0; color: #333;">${data.employeeName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Customer:</td>
                    <td style="padding: 8px 0; color: #333;">${data.customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Rating:</td>
                    <td style="padding: 8px 0; color: #333;">
                      <span style="background: ${data.rating >= 4 ? "#28a745" : data.rating >= 3 ? "#ffc107" : "#dc3545"}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                        ${data.rating}/5 ⭐
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Outlet:</td>
                    <td style="padding: 8px 0; color: #333;">${data.outlet} (${data.brand})</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Time:</td>
                    <td style="padding: 8px 0; color: #333;">${new Date(data.submissionTime).toLocaleString()}</td>
                  </tr>
                </table>
                
                <div style="margin-top: 20px;">
                  <h3 style="color: #333; margin-bottom: 10px;">Customer Feedback:</h3>
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid ${data.rating >= 4 ? "#28a745" : data.rating >= 3 ? "#ffc107" : "#dc3545"};">
                    <p style="margin: 0; color: #555; font-style: italic;">"${data.feedback}"</p>
                  </div>
                </div>
                
                <div style="margin-top: 20px; text-align: center;">
                  <a href="${process.env.APP_URL}/admin/dashboard" 
                     style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    View Dashboard
                  </a>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>This is an automated notification from Employee Review System</p>
            </div>
          </div>
        `,
        text: body,
      }

      // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
      console.log("Email notification prepared:", emailData)

      return { success: true, data: emailData }
    } catch (error) {
      console.error("Error preparing email notification:", error)
      return { success: false, error: error }
    }
  }

  // Process notification for ratings
  static async processRatingNotification(feedbackData: NotificationData) {
    try {
      const settings = await this.getNotificationSettings()
      if (!settings) {
        console.log("No notification settings found")
        return { success: false, error: "No notification settings configured" }
      }

      // Check if rating meets threshold
      const shouldNotify =
        feedbackData.rating >= settings.high_rating_threshold || feedbackData.rating <= settings.low_rating_threshold

      if (!shouldNotify) {
        console.log(`Rating ${feedbackData.rating} does not meet notification thresholds`)
        return { success: true, message: "Rating does not meet notification thresholds" }
      }

      // Check business rules
      if (!this.shouldSendNotification(settings)) {
        console.log("Notification blocked by business rules (hours/weekend)")
        return { success: true, message: "Notification blocked by business rules" }
      }

      const notifications = []

      // Parse admin emails and phones
      const adminEmails = settings.admin_emails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0)

      const adminPhones = settings.admin_phones
        .split(",")
        .map((phone) => phone.trim())
        .filter((phone) => phone.length > 0)

      // Send email notifications
      if (settings.email_notifications_enabled && adminEmails.length > 0) {
        for (const email of adminEmails) {
          const emailResult = await this.sendEmailNotification(feedbackData, email, settings)
          notifications.push({ type: "email", recipient: email, result: emailResult })
        }
      }

      // Send WhatsApp notifications
      if (settings.whatsapp_notifications_enabled && adminPhones.length > 0) {
        for (const phone of adminPhones) {
          const whatsappResult = await this.sendWhatsAppNotification(feedbackData, phone, settings)
          notifications.push({ type: "whatsapp", recipient: phone, result: whatsappResult })
        }
      }

      // Log notification attempts
      await Database.insert(
        `
        INSERT INTO notification_logs (
          feedback_id, notification_type, recipient_data, status, 
          notification_data, sent_at
        ) VALUES (?, ?, ?, ?, ?, NOW())
      `,
        [
          feedbackData.employeeName, // Using employee name as identifier
          feedbackData.rating >= settings.high_rating_threshold ? "high_rating_alert" : "low_rating_alert",
          JSON.stringify({ emails: adminEmails, phones: adminPhones }),
          "sent",
          JSON.stringify(notifications),
        ],
      )

      return { success: true, notifications }
    } catch (error) {
      console.error("Error processing rating notification:", error)
      return { success: false, error }
    }
  }
}
