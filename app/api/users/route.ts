import { type NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const users = await Database.query(`
      SELECT id, full_name, email, phone, role, is_active, last_login, created_at
      FROM admin_users 
      ORDER BY created_at DESC
    `)

    return NextResponse.json({
      success: true,
      users,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log(data)

    // Check if email already exists
    const existingUser = await Database.queryOne(
      `
      SELECT id FROM admin_users WHERE email = ?
    `,
      [data.email],
    )

    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const userId = await Database.insert(
      `
      INSERT INTO admin_users (full_name, email, phone, role, password_hash, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        data.full_name,
        data.email,
        data.phone || null,
        data.role,
        hashedPassword,
        data.is_active !== false,
        // JSON.stringify(data.permissions || []),
      ],
    )

    return NextResponse.json({
      success: true,
      data: { id: userId },
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 })
  }
}

