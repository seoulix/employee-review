import { type NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      outlet_id: searchParams.get("outlet_id") ? Number.parseInt(searchParams.get("outlet_id")!) : undefined,
      brand_id: searchParams.get("brand_id") ? Number.parseInt(searchParams.get("brand_id")!) : undefined,
      city_id: searchParams.get("city_id") ? Number.parseInt(searchParams.get("city_id")!) : undefined,
      state_id: searchParams.get("state_id") ? Number.parseInt(searchParams.get("state_id")!) : undefined,
    }

    // Get eligible employees (rating >= 4.0, reviews >= 20)
    const eligibleEmployees = await Database.query(
      `
      SELECT 
        eps.*,
        e.phone, e.email
      FROM employee_performance_summary eps
      JOIN employees e ON eps.id = e.id
      JOIN outlets o ON e.outlet_id = o.id
      JOIN brands b ON o.brand_id = b.id
      JOIN cities c ON o.city_id = c.id
      JOIN states s ON c.state_id = s.id
      WHERE eps.average_rating >= 4.0 
        AND eps.total_reviews >= 20
        AND e.status = 'Active'
        ${filters.outlet_id ? "AND o.id = ?" : ""}
        ${filters.brand_id ? "AND b.id = ?" : ""}
        ${filters.city_id ? "AND c.id = ?" : ""}
        ${filters.state_id ? "AND s.id = ?" : ""}
      ORDER BY eps.average_rating DESC, eps.total_reviews DESC
    `,
      Object.values(filters).filter(Boolean),
    )

    return NextResponse.json({
      success: true,
      data: eligibleEmployees,
      meta: {
        total_eligible: (eligibleEmployees as any[]).length,
        filters_applied: filters,
      },
    })
  } catch (error) {
    console.error("Error fetching eligible employees:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch eligible employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.employee_id || !data.selection_month || !data.selected_by) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if winner already exists for this month
    const existingWinner = await Database.queryOne(
      `
      SELECT id FROM winner_selections 
      WHERE selection_month = ? AND employee_id = ?
    `,
      [data.selection_month, data.employee_id],
    )

    if (existingWinner) {
      return NextResponse.json({ success: false, error: "Winner already selected for this month" }, { status: 400 })
    }

    const winnerId = await Database.insert(
      `
      INSERT INTO winner_selections 
      (employee_id, selection_month, selection_criteria, selected_by, prize_details, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        data.employee_id,
        data.selection_month,
        JSON.stringify(data.selection_criteria || {}),
        data.selected_by,
        data.prize_details || "Monthly recognition award and gift voucher",
        data.notes || "",
      ],
    )

    // Get winner details for notification
    const winnerDetails = await Database.queryOne(
      `
      SELECT 
        e.full_name, e.phone, e.email,
        o.name as outlet_name,
        eps.average_rating, eps.total_reviews
      FROM employees e
      JOIN outlets o ON e.outlet_id = o.id
      JOIN employee_performance_summary eps ON e.id = eps.id
      WHERE e.id = ?
    `,
      [data.employee_id],
    )

    return NextResponse.json({
      success: true,
      data: {
        id: winnerId,
        winner: winnerDetails,
      },
      message: "Winner selected successfully",
    })
  } catch (error) {
    console.error("Error selecting winner:", error)
    return NextResponse.json({ success: false, error: "Failed to select winner" }, { status: 500 })
  }
}
