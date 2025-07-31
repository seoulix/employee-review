import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// GET - Fetch outlets and positions for employee form dropdowns
export async function GET() {
  try {
    // Get all active outlets with brand and location info
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
      WHERE o.status = 'Active'
      ORDER BY o.name
    `);

    // Define common positions
    const positions = [
      "Sales Associate",
      "Cashier", 
      "Store Manager",
      "Assistant Manager",
      "Supervisor",
      "Team Lead",
      "Customer Service Representative",
      "Inventory Specialist",
      "Security Guard",
      "Maintenance Staff"
    ];

    return NextResponse.json({ 
      success: true, 
      data: {
        outlets,
        positions
      }
    });
  } catch (error) {
    console.error("Error fetching form data:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch form data" }, { status: 500 });
  }
} 