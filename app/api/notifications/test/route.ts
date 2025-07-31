import { type NextRequest, NextResponse } from "next/server"
import { NotificationService } from "@/lib/services/notification"

export async function POST(request: NextRequest) {
  try {
    const { email, whatsapp } = await request.json()

    const testData = {
      employeeName: "John Doe",
      customerName: "Test Customer",
      rating: 5,
      feedback: "This is a test notification to verify the system is working correctly.",
      outlet: "Test Outlet",
      brand: "Test Brand",
      submissionTime: new Date().toISOString(),
    }

    const results = []

    if (email) {
      const settings = await NotificationService.getNotificationSettings()
      if (settings && settings.admin_emails) {
        const adminEmails = settings.admin_emails
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email.length > 0)

        for (const adminEmail of adminEmails) {
          const result = await NotificationService.sendEmailNotification(testData, adminEmail, settings)
          results.push({ type: "email", recipient: adminEmail, result })
        }
      }
    }

    if (whatsapp) {
      const settings = await NotificationService.getNotificationSettings()
      if (settings && settings.admin_phones) {
        const adminPhones = settings.admin_phones
          .split(",")
          .map((phone) => phone.trim())
          .filter((phone) => phone.length > 0)

        for (const adminPhone of adminPhones) {
          const result = await NotificationService.sendWhatsAppNotification(testData, adminPhone, settings)
          results.push({ type: "whatsapp", recipient: adminPhone, result })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Test notifications sent",
      results,
    })
  } catch (error) {
    console.error("Error sending test notifications:", error)
    return NextResponse.json({ success: false, message: "Failed to send test notifications" }, { status: 500 })
  }
}
