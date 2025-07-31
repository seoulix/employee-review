import { type NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"

export async function GET() {
  try {
    const settings = await Database.queryOne(`
      SELECT * FROM notification_settings 
      WHERE id = 1
    `)

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error("Error fetching notification settings:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch notification settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Check if settings exist
    const existingSettings = await Database.queryOne(`
      SELECT id FROM notification_settings WHERE id = 1
    `)

    if (existingSettings) {
      // Update existing settings
      await Database.update(
        `
        UPDATE notification_settings SET
          email_notifications_enabled = ?,
          whatsapp_notifications_enabled = ?,
          high_rating_threshold = ?,
          low_rating_threshold = ?,
          admin_emails = ?,
          admin_phones = ?,
          email_template_subject = ?,
          email_template_body = ?,
          whatsapp_template_name = ?,
          doubletick_api_key = ?,
          sender_phone = ?,
          notification_frequency = ?,
          business_hours_only = ?,
          weekend_notifications = ?,
          updated_at = NOW()
        WHERE id = 1
      `,
        [
          data.email_notifications_enabled,
          data.whatsapp_notifications_enabled,
          data.high_rating_threshold,
          data.low_rating_threshold,
          data.admin_emails,
          data.admin_phones,
          data.email_template_subject,
          data.email_template_body,
          data.whatsapp_template_name,
          data.doubletick_api_key,
          data.sender_phone,
          data.notification_frequency || "immediate",
          data.business_hours_only,
          data.weekend_notifications,
        ],
      )
    } else {
      // Insert new settings
      await Database.insert(
        `
        INSERT INTO notification_settings (
          id, email_notifications_enabled, whatsapp_notifications_enabled,
          high_rating_threshold, low_rating_threshold, admin_emails, admin_phones,
          email_template_subject, email_template_body, whatsapp_template_name,
          doubletick_api_key, sender_phone, notification_frequency,
          business_hours_only, weekend_notifications, created_at, updated_at
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
        [
          data.email_notifications_enabled,
          data.whatsapp_notifications_enabled,
          data.high_rating_threshold,
          data.low_rating_threshold,
          data.admin_emails,
          data.admin_phones,
          data.email_template_subject,
          data.email_template_body,
          data.whatsapp_template_name,
          data.doubletick_api_key,
          data.sender_phone,
          data.notification_frequency || "immediate",
          data.business_hours_only,
          data.weekend_notifications,
        ],
      )
    }

    return NextResponse.json({
      success: true,
      message: "Notification settings saved successfully",
    })
  } catch (error) {
    console.error("Error saving notification settings:", error)
    return NextResponse.json({ success: false, message: "Failed to save notification settings" }, { status: 500 })
  }
}
