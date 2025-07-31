import { type NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"

export async function GET() {
  try {
    const settings = await Database.queryOne(`
      SELECT * FROM theme_settings WHERE id = 1
    `)

    return NextResponse.json({
      success: true,
      settings,
    })
  } catch (error) {
    console.error("Error fetching theme settings:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch theme settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Check if settings exist
    const existingSettings = await Database.queryOne(`
      SELECT id FROM theme_settings WHERE id = 1
    `)

    if (existingSettings) {
      await Database.update(
        `
        UPDATE theme_settings SET
          app_name = ?, logo_url = ?, favicon_url = ?, primary_color = ?,
          secondary_color = ?, accent_color = ?, background_color = ?, text_color = ?,
          sidebar_color = ?, header_color = ?, custom_css = ?, dark_mode_enabled = ?,
          default_theme = ?, font_family = ?, font_size = ?, border_radius = ?,
          shadow_intensity = ?, updated_at = NOW()
        WHERE id = 1
      `,
        [
          data.app_name,
          data.logo_url,
          data.favicon_url,
          data.primary_color,
          data.secondary_color,
          data.accent_color,
          data.background_color,
          data.text_color,
          data.sidebar_color,
          data.header_color,
          data.custom_css,
          data.dark_mode_enabled,
          data.default_theme,
          data.font_family,
          data.font_size,
          data.border_radius,
          data.shadow_intensity,
        ],
      )
    } else {
      await Database.insert(
        `
        INSERT INTO theme_settings (
          id, app_name, logo_url, favicon_url, primary_color, secondary_color,
          accent_color, background_color, text_color, sidebar_color, header_color,
          custom_css, dark_mode_enabled, default_theme, font_family, font_size,
          border_radius, shadow_intensity, created_at, updated_at
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
        [
          data.app_name,
          data.logo_url,
          data.favicon_url,
          data.primary_color,
          data.secondary_color,
          data.accent_color,
          data.background_color,
          data.text_color,
          data.sidebar_color,
          data.header_color,
          data.custom_css,
          data.dark_mode_enabled,
          data.default_theme,
          data.font_family,
          data.font_size,
          data.border_radius,
          data.shadow_intensity,
        ],
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving theme settings:", error)
    return NextResponse.json({ success: false, message: "Failed to save theme settings" }, { status: 500 })
  }
}
