import { NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { outletId: string } }) {
  try {
    const outletId = Number.parseInt(params.outletId)
    
    const employees = await Database.query(`
      SELECT 
        id,
        full_name,
        position
      FROM employees 
      WHERE outlet_id = ? AND status = 'Active'
      ORDER BY full_name
    `, [outletId])

    return NextResponse.json({ success: true, data: employees })
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch employees" }, { status: 500 })
  }
}
