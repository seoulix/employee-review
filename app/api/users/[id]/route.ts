import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await request.json();

    // Update user in the database (adjust fields as needed)
    await Database.update(
      `UPDATE admin_users SET full_name = ?, email = ?, phone = ?, role = ?, is_active = ? WHERE id = ?`,
      [
        data.full_name,
        data.email,
        data.phone ?? null,
        data.role,
        data.is_active,
        id,
      ]
    );

    return NextResponse.json({ success: true,id });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const id = params.id;
     
      // Delete user from the database
      await Database.delete(
        `DELETE FROM admin_users WHERE id = ?`,
        [id]
      );
  
      return NextResponse.json({ success: true, id });
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
    }
  }
  