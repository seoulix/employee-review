import { NextResponse } from "next/server";
import Database from "@/lib/database";

export async function GET() {
  try {
    const brands = await Database.query("SELECT name FROM brands ORDER BY name");
    const states = await Database.query("SELECT name FROM states ORDER BY name");
    const cities = await Database.query("SELECT name FROM cities ORDER BY name");
    const outlets = await Database.query("SELECT name FROM outlets ORDER BY name");
    const employees = await Database.query("SELECT full_name FROM employees ORDER BY full_name");

    return NextResponse.json({
      success: true,
      data: {
        brands: brands.map((b: { name: string }) => b.name),
        states: states.map((s: { name: string }) => s.name),
        cities: cities.map((c: { name: string }) => c.name),
        outlets: outlets.map((o: { name: string }) => o.name),
        employees: employees.map((e: { full_name: string }) => e.full_name),
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch filters" }, { status: 500 });
  }
} 