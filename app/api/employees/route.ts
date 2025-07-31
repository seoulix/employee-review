import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// GET - Fetch all employees with related data
export async function GET() {
  try {
    const employees = await Database.query(`
      SELECT 
        e.id,
        e.employee_code,
        e.full_name as name,
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
      GROUP BY e.id, e.employee_code, e.full_name, e.email, e.phone, e.position, e.photo_url, e.join_date, e.status, o.name, b.name, c.name, s.name
      ORDER BY e.created_at DESC
    `);

    return NextResponse.json({ success: true, data: employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch employees" }, { status: 500 });
  }
}

// POST - Create new employee
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.outletId || !data.position) {
      return NextResponse.json({ 
        success: false, 
        message: "Name, outlet, and position are required" 
      }, { status: 400 });
    }

    // Check if employee with same email already exists
    if (data.email) {
      const existingEmployee = await Database.queryOne(
        `SELECT id FROM employees WHERE email = ?`,
        [data.email]
      );

      if (existingEmployee) {
        return NextResponse.json({ 
          success: false, 
          message: "Employee with this email already exists" 
        }, { status: 400 });
      }
    }

    // Verify outlet exists
    const outletExists = await Database.queryOne(
      `SELECT id FROM outlets WHERE id = ?`,
      [data.outletId]
    );

    if (!outletExists) {
      return NextResponse.json({ 
        success: false, 
        message: "Selected outlet does not exist" 
      }, { status: 400 });
    }

    // Generate employee code
    const employeeCode = `EMP${Date.now()}`;

    const employeeId = await Database.insert(
      `INSERT INTO employees (employee_code, full_name, email, phone, outlet_id, position, photo_url, join_date, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeCode,
        data.name,
        data.email || null,
        data.phone || null,
        data.outletId,
        data.position,
        data.photo || null,
        data.joinDate || new Date().toISOString().split('T')[0],
        data.status || "Active"
      ]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: employeeId },
      message: "Employee created successfully" 
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ success: false, message: "Failed to create employee" }, { status: 500 });
  }
}
