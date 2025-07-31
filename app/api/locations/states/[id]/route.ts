import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// PUT - Update state
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await request.json();

    // Check if state with same name or code already exists (excluding current state)
    const existingState = await Database.queryOne(
      `SELECT id FROM states WHERE (name = ? OR code = ?) AND id != ?`,
      [data.name, data.code, id]
    );

    if (existingState) {
      return NextResponse.json({ 
        success: false, 
        message: "State with this name or code already exists" 
      }, { status: 400 });
    }

    await Database.update(
      `UPDATE states SET name = ?, code = ?, status = ? WHERE id = ?`,
      [data.name, data.code, data.status, id]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: parseInt(id) },
      message: "State updated successfully" 
    });
  } catch (error) {
    console.error("Error updating state:", error);
    return NextResponse.json({ success: false, message: "Failed to update state" }, { status: 500 });
  }
}

// DELETE - Delete state
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Check if state has cities
    const citiesCount = await Database.queryOne(
      `SELECT COUNT(*) as count FROM cities WHERE state_id = ?`,
      [id]
    ) as { count: number };

    if (citiesCount.count > 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Cannot delete state with existing cities" 
      }, { status: 400 });
    }

    await Database.delete(
      `DELETE FROM states WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: parseInt(id) },
      message: "State deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting state:", error);
    return NextResponse.json({ success: false, message: "Failed to delete state" }, { status: 500 });
  }
} 