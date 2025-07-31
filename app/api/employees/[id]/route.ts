import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// PUT - Update employee
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await request.json();

    // Check if employee with same email already exists (excluding current employee)
    if (data.email) {
      const existingEmployee = await Database.queryOne(
        `SELECT id FROM employees WHERE email = ? AND id != ?`,
        [data.email, id]
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

    await Database.update(
      `UPDATE employees SET 
        full_name = ?, 
        email = ?, 
        phone = ?, 
        outlet_id = ?, 
        position = ?, 
        photo_url = ?, 
        join_date = ?, 
        status = ? 
       WHERE id = ?`,
      [
        data.name,
        data.email || null,
        data.phone || null,
        data.outletId,
        data.position,
        data.photo || null,
        data.joinDate,
        data.status,
        id
      ]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: parseInt(id) },
      message: "Employee updated successfully" 
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ success: false, message: "Failed to update employee" }, { status: 500 });
  }
}

// DELETE - Delete employee
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Check if employee has feedback submissions
    const feedbackCount = await Database.queryOne(
      `SELECT COUNT(*) as count FROM feedback_submissions WHERE employee_id = ?`,
      [id]
    ) as { count: number };

    if (feedbackCount.count > 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Cannot delete employee with existing feedback submissions" 
      }, { status: 400 });
    }

    await Database.delete(
      `DELETE FROM employees WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: parseInt(id) },
      message: "Employee deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ success: false, message: "Failed to delete employee" }, { status: 500 });
  }
} 

// GET - Fetch employee by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const employee = await Database.queryOne(
      `SELECT * FROM employees WHERE id = ?`,
      [id]
    );

    if (!employee) {
      return NextResponse.json({
        success: false,
        message: "Employee not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch employee" }, { status: 500 });
  }
} 

// GET - Fetch reviews/feedback for employee by ID
export async function GET_reviews(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    // Fetch all feedback/reviews for the employee
    const reviews = await Database.query(
      `SELECT id, customer_name, rating, comment, created_at as date, status FROM feedback_submissions WHERE employee_id = ? ORDER BY created_at DESC`,
      [id]
    );
    return NextResponse.json({
      success: true,
      data: reviews || []
    });
  } catch (error) {
    console.error("Error fetching employee reviews:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch employee reviews" }, { status: 500 });
  }
} 