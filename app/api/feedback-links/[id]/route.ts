import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// PUT - Update feedback link
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await request.json();

    await Database.update(
      `UPDATE feedback_links SET status = ? WHERE id = ?`,
      [data.status, id]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: parseInt(id) },
      message: "Feedback link updated successfully" 
    });
  } catch (error) {
    console.error("Error updating feedback link:", error);
    return NextResponse.json({ success: false, message: "Failed to update feedback link" }, { status: 500 });
  }
}

// DELETE - Delete feedback link
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Check if feedback link has submissions
    const submissionsCount = await Database.queryOne(
      `SELECT COUNT(*) as count FROM feedback_submissions WHERE feedback_link_id = ?`,
      [id]
    ) as { count: number };

    if (submissionsCount.count > 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Cannot delete feedback link with existing submissions" 
      }, { status: 400 });
    }

    await Database.delete(
      `DELETE FROM feedback_links WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: parseInt(id) },
      message: "Feedback link deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting feedback link:", error);
    return NextResponse.json({ success: false, message: "Failed to delete feedback link" }, { status: 500 });
  }
} 