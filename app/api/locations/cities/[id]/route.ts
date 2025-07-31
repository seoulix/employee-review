import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// PUT - Update city
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await request.json();

    // Check if city with same name in the same state already exists (excluding current city)
    const existingCity = await Database.queryOne(
      `SELECT id FROM cities WHERE name = ? AND state_id = ? AND id != ?`,
      [data.name, data.stateId, id]
    );

    if (existingCity) {
      return NextResponse.json({ 
        success: false, 
        message: "City with this name already exists in the selected state" 
      }, { status: 400 });
    }

    // Verify state exists
    const stateExists = await Database.queryOne(
      `SELECT id FROM states WHERE id = ?`,
      [data.stateId]
    );

    if (!stateExists) {
      return NextResponse.json({ 
        success: false, 
        message: "Selected state does not exist" 
      }, { status: 400 });
    }

    await Database.update(
      `UPDATE cities SET name = ?, state_id = ?, status = ? WHERE id = ?`,
      [data.name, data.stateId, data.status, id]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: parseInt(id) },
      message: "City updated successfully" 
    });
  } catch (error) {
    console.error("Error updating city:", error);
    return NextResponse.json({ success: false, message: "Failed to update city" }, { status: 500 });
  }
}

// DELETE - Delete city
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Check if city has outlets
    const outletsCount = await Database.queryOne(
      `SELECT COUNT(*) as count FROM outlets WHERE city_id = ?`,
      [id]
    ) as { count: number };

    if (outletsCount.count > 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Cannot delete city with existing outlets" 
      }, { status: 400 });
    }

    await Database.delete(
      `DELETE FROM cities WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: parseInt(id) },
      message: "City deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting city:", error);
    return NextResponse.json({ success: false, message: "Failed to delete city" }, { status: 500 });
  }
} 