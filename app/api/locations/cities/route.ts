import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// GET - Fetch all cities
export async function GET() {
  try {
    const cities = await Database.query(`
      SELECT 
        c.id,
        c.name,
        c.state_id as stateId,
        s.name as stateName,
        c.status,
        COUNT(o.id) as outlets
      FROM cities c
      LEFT JOIN states s ON c.state_id = s.id
      LEFT JOIN outlets o ON c.id = o.city_id
      GROUP BY c.id, c.name, c.state_id, s.name, c.status
      ORDER BY c.name
    `);

    return NextResponse.json({ success: true, data: cities });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch cities" }, { status: 500 });
  }
}

// POST - Create new city
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Check if city with same name in the same state already exists
    const existingCity = await Database.queryOne(
      `SELECT id FROM cities WHERE name = ? AND state_id = ?`,
      [data.name, data.stateId]
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

    const cityId = await Database.insert(
      `INSERT INTO cities (name, state_id, status) VALUES (?, ?, ?)`,
      [data.name, data.stateId, data.status]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: cityId },
      message: "City created successfully" 
    });
  } catch (error) {
    console.error("Error creating city:", error);
    return NextResponse.json({ success: false, message: "Failed to create city" }, { status: 500 });
  }
}
