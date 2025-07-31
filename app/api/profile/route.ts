import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";


// PUT - Update current admin profile
export async function PUT(request: NextRequest) {
  try {
    const userId = 1; // Replace with real auth logic
    const data = await request.json();
    await Database.update(
      `UPDATE admin_users SET full_name = ?, email = ? WHERE id = ?`,
      [data.name, data.email, userId]
    );
    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 });
  }
}
