import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// GET - Fetch brands and cities for outlet form dropdowns
export async function GET() {
  try {
    // Get all active brands
    const brands = await Database.query(`
      SELECT id, name 
      FROM brands 
      WHERE status = 'Active' 
      ORDER BY name
    `);

    // Get all states with their cities
    const statesWithCities = await Database.query(`
      SELECT 
        s.id as stateId,
        s.name as stateName,
        s.code as stateCode,
        c.id as cityId,
        c.name as cityName
      FROM states s
      LEFT JOIN cities c ON s.id = c.state_id AND c.status = 'Active'
      WHERE s.status = 'Active'
      ORDER BY s.name, c.name
    `);

    // Organize cities by state
    const citiesByState = statesWithCities.reduce((acc: any, row: any) => {
      if (!acc[row.stateId]) {
        acc[row.stateId] = {
          id: row.stateId,
          name: row.stateName,
          code: row.stateCode,
          cities: []
        };
      }
      if (row.cityId) {
        acc[row.stateId].cities.push({
          id: row.cityId,
          name: row.cityName
        });
      }
      return acc;
    }, {});

    return NextResponse.json({ 
      success: true, 
      data: {
        brands,
        states: Object.values(citiesByState)
      }
    });
  } catch (error) {
    console.error("Error fetching form data:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch form data" }, { status: 500 });
  }
} 