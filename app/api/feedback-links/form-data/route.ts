import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// GET - Fetch outlets for creating new feedback links
export async function GET() {
  try {
    // Get all active outlets that don't have feedback links yet
    const outlets = await Database.query(`
      SELECT 
        o.id,
        o.name,
        b.name as brand,
        c.name as city,
        s.name as state
      FROM outlets o
      LEFT JOIN brands b ON o.brand_id = b.id
      LEFT JOIN cities c ON o.city_id = c.id
      LEFT JOIN states s ON c.state_id = s.id
      LEFT JOIN feedback_links fl ON o.id = fl.outlet_id
      WHERE o.status = 'Active' AND fl.id IS NULL
      ORDER BY o.name
    `);

    return NextResponse.json({ 
      success: true, 
      data: { outlets }
    });
  } catch (error) {
    console.error("Error fetching form data:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch form data" }, { status: 500 });
  }
} 