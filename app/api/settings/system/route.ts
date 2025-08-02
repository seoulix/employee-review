import { type NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"

export async function GET() {
  try {
    const settings = await Database.queryOne(`
      SELECT * FROM system_settings 
      WHERE id = 1
    `)

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error("Error fetching system settings:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch system settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Check if settings exist
    const existingSettings = await Database.queryOne(`
      SELECT id FROM system_settings WHERE id = 1
    `)

    if (existingSettings) {
      // Update existing settings
      await Database.update(
        `
        UPDATE system_settings SET
          system_name = ?,
          company_name = ?,
          support_email = ?,
          support_phone = ?,
          app_url = ?,
          timezone = ?,
          date_format = ?,
          currency = ?,
          language = ?,
          copyright = ?,
          updated_at = NOW()
        WHERE id = 1
      `,
        [
          data.system_name,
          data.company_name,
          data.support_email,
          data.support_phone,
          data.app_url,
          data.timezone,
          data.date_format,
          data.currency,
          data.language,
          data.copyright,
        ],
      )
    } else {
      // Insert new settings
      await Database.insert(
        `
        INSERT INTO system_settings (
          id, system_name, company_name, support_email, support_phone,
          app_url, timezone, date_format, currency, language, copyright,
          created_at, updated_at
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
        [
          data.system_name,
          data.company_name,
          data.support_email,
          data.support_phone,
          data.app_url,
          data.timezone,
          data.date_format,
          data.currency,
          data.language,
          data.copyright,
        ],
      )
    }

    return NextResponse.json({
      success: true,
      message: "System settings saved successfully",
    })
  } catch (error) {
    console.error("Error saving system settings:", error)
    return NextResponse.json({ success: false, message: "Failed to save system settings" }, { status: 500 })
  }
}
