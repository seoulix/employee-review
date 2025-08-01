import { NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const token = params.token
    
    // Get feedback link with outlet details
    const feedbackLink = await Database.queryOne(`
      SELECT 
        fl.id,
        fl.outlet_id,
        fl.token,
        fl.url,
        fl.status,
        fl.unique_id,
        fl.name,
        fl.phone,
        fl.email,
        fs.tiles,
        fl.arrival_date,
        o.name as outlet_name,
        b.name as brand_name,
        c.name as city_name,
        s.name as state_name
      FROM feedback_links fl
      LEFT JOIN outlets o ON fl.outlet_id = o.id
      LEFT JOIN brands b ON o.brand_id = b.id
      LEFT JOIN cities c ON o.city_id = c.id
      LEFT JOIN states s ON c.state_id = s.id
      JOIN feedback_settings as fs
      WHERE fl.token = ? AND fl.status = 'Active'
    `, [token])

    if (!feedbackLink) {
      return NextResponse.json({ success: false, message: "Invalid or expired feedback link" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: feedbackLink })
  } catch (error) {
    console.error("Error fetching feedback link:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch feedback link" }, { status: 500 })
  }
}
