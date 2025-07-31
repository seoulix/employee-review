import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// GET - Fetch all outlets with related data, filter by brand if provided
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brand");

    let outlets;
    if (brandId) {
      outlets = await Database.query(`
        SELECT 
          o.id,
          o.name,
          o.address,
          o.manager_name as manager,
          o.manager_phone,
          o.manager_email,
          o.status,
          o.created_at as createdAt,
          b.name as brand,
          c.name as city,
          s.name as state,
          COUNT(e.id) as employees
        FROM outlets o
        LEFT JOIN brands b ON o.brand_id = b.id
        LEFT JOIN cities c ON o.city_id = c.id
        LEFT JOIN states s ON c.state_id = s.id
        LEFT JOIN employees e ON o.id = e.outlet_id AND e.status = 'Active'
        WHERE o.brand_id = ?
        GROUP BY o.id, o.name, o.address, o.manager_name, o.manager_phone, o.manager_email, o.status, o.created_at, b.name, c.name, s.name
        ORDER BY o.created_at DESC
      `, [brandId]);
    } else {
      outlets = await Database.query(`
        SELECT 
          o.id,
          o.name,
          o.address,
          o.manager_name as manager,
          o.manager_phone,
          o.manager_email,
          o.status,
          o.created_at as createdAt,
          b.name as brand,
          c.name as city,
          s.name as state,
          COUNT(e.id) as employees
        FROM outlets o
        LEFT JOIN brands b ON o.brand_id = b.id
        LEFT JOIN cities c ON o.city_id = c.id
        LEFT JOIN states s ON c.state_id = s.id
        LEFT JOIN employees e ON o.id = e.outlet_id AND e.status = 'Active'
        GROUP BY o.id, o.name, o.address, o.manager_name, o.manager_phone, o.manager_email, o.status, o.created_at, b.name, c.name, s.name
        ORDER BY o.created_at DESC
      `);
    }

    return NextResponse.json({ success: true, data: outlets });
  } catch (error) {
    console.error("Error fetching outlets:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch outlets" }, { status: 500 });
  }
}

// POST - Create new outlet
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.brandId || !data.cityId || !data.address) {
      return NextResponse.json({ 
        success: false, 
        message: "Name, brand, city, and address are required" 
      }, { status: 400 });
    }

    // Check if outlet with same name already exists
    const existingOutlet = await Database.queryOne(
      `SELECT id FROM outlets WHERE name = ?`,
      [data.name]
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

    const outletId = await Database.insert(
      `INSERT INTO outlets (name, brand_id, city_id, address, manager_name, manager_phone, manager_email, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.brandId,
        data.cityId,
        data.address,
        data.manager || null,
        data.managerPhone || null,
        data.managerEmail || null,
        data.status || "Active"
      ]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: outletId },
      message: "Outlet created successfully" 
    });
  } catch (error) {
    console.error("Error creating outlet:", error);
    return NextResponse.json({ success: false, message: "Failed to create outlet" }, { status: 500 });
  }
}
