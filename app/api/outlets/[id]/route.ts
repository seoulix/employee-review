import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// PUT - Update outlet
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await request.json();

    // Check if outlet with same name already exists (excluding current outlet)
    const existingOutlet = await Database.queryOne(
      `SELECT id FROM outlets WHERE name = ? AND id != ?`,
      [data.name, id]
    );

    if (existingOutlet) {
      return NextResponse.json({ 
        success: false, 
        message: "Outlet with this name already exists" 
      }, { status: 400 });
    }

    // Verify brand exists
    const brandExists = await Database.queryOne(
      `SELECT id FROM brands WHERE id = ?`,
      [data.brandId]
    );

    if (!brandExists) {
      return NextResponse.json({ 
        success: false, 
        message: "Selected brand does not exist" 
      }, { status: 400 });
    }

    // Verify city exists
    const cityExists = await Database.queryOne(
      `SELECT id FROM cities WHERE id = ?`,
      [data.cityId]
    );

    if (!cityExists) {
      return NextResponse.json({ 
        success: false, 
        message: "Selected city does not exist" 
      }, { status: 400 });
    }

    await Database.update(
      `UPDATE outlets SET 
        name = ?, 
        brand_id = ?, 
        city_id = ?, 
        address = ?, 
        manager_name = ?, 
        manager_phone = ?, 
        manager_email = ?, 
        status = ?,
        outlet_image = ?,
        gps_latitude = ?,
        gps_longitude = ?,
        phone_number = ?,
        email_id = ?,
        google_review_link = ?,
        custom_feedback_form = ?,
        review_link_config = ?
       WHERE id = ?`,
      [
        data.name,
        data.brandId,
        data.cityId,
        data.address,
        data.manager || null,
        data.managerPhone || null,
        data.managerEmail || null,
        data.status,
        data.outletImage,
        data.gpsLatitude || null,
        data.gpsLongitude || null,
        data.phoneNumber || null,
        data.emailId || null,
        data.googleReviewLink || null,
        data.customFeedbackForm || null,
        data.reviewLinkConfig || null,
        id
      ]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: parseInt(id) },
      message: "Outlet updated successfully" 
    });
  } catch (error) {
    console.error("Error updating outlet:", error);
    return NextResponse.json({ success: false, message: "Failed to update outlet" }, { status: 500 });
  }
}

// DELETE - Delete outlet
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Check if outlet has employees
    const employeesCount = await Database.queryOne(
      `SELECT COUNT(*) as count FROM employees WHERE outlet_id = ?`,
      [id]
    ) as { count: number };

    if (employeesCount.count > 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Cannot delete outlet with existing employees" 
      }, { status: 400 });
    }

    // Check if outlet has feedback links
    const feedbackLinksCount = await Database.queryOne(
      `SELECT COUNT(*) as count FROM feedback_links WHERE outlet_id = ?`,
      [id]
    ) as { count: number };

    if (feedbackLinksCount.count > 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Cannot delete outlet with existing feedback links" 
      }, { status: 400 });
    }

    await Database.delete(
      `DELETE FROM outlets WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: parseInt(id) },
      message: "Outlet deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting outlet:", error);
    return NextResponse.json({ success: false, message: "Failed to delete outlet" }, { status: 500 });
  }
} 