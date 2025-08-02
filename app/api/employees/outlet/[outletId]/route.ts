import { NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { outletId: string } }) {
  try {
    const outletId = Number.parseInt(params.outletId)
    
    const employees = await Database.query(`
      SELECT 
        e.id,
        e.employee_code,
        e.full_name,
        e.email,
        e.phone,
        e.position,
        e.photo_url as photo,
        e.join_date as joinDate,
        e.status,
        o.name as outlet,
        b.name as brand,
        c.name as city,
        s.name as state,
        COUNT(fs.id) as totalReviews,
        ROUND(AVG(fs.rating), 1) as rating
      FROM employees e
      LEFT JOIN outlets o ON e.outlet_id = o.id
      LEFT JOIN brands b ON o.brand_id = b.id
      LEFT JOIN cities c ON o.city_id = c.id
      LEFT JOIN states s ON c.state_id = s.id
      LEFT JOIN feedback_submissions fs ON e.id = fs.employee_id
      WHERE e.outlet_id = ? AND e.status = 'Active'
      GROUP BY e.id, e.employee_code, e.full_name, e.email, e.phone, e.position, e.photo_url, e.join_date, e.status, o.name, b.name, c.name, s.name
      ORDER BY e.full_name
    `, [outletId])

    console.log('📊 Employees for outlet', outletId, ':', employees.length, 'employees found')
    console.log('📄 Sample employee data:', employees[0])
    
    return NextResponse.json({ success: true, data: employees })
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch employees" }, { status: 500 })
  }
}
