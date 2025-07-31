import { type NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const id = params.id;
      const data = await request.json()
      console.log(data)
  
  
      await Database.update(
        `UPDATE admin_users SET is_active = ? WHERE id = ?`,
        [data.is_active, id]
      )
  
      return NextResponse.json({
        success: true,
        data: { id: id },
      })
    } catch (error) {
      console.error("Error updating user status:", error)
      return NextResponse.json({ success: false, message: "Failed to update user status" }, { status: 500 })
    }
  }