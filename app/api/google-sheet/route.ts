import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";
import fetchSheet from "./fetchSheet/fetchsheet";

// GET - Fetch all Data From the Sheet after the old Fetched data
export async function GET() {
  try {
    
// Import the fetchSheetData function and work here
const returnedObj = await fetchSheet();
if(returnedObj.success){

  return NextResponse.json({ success: true, data: returnedObj.data });
}else{
  return NextResponse.json(
    { success:false,message:returnedObj.message },
    { status: 400 } // 👈 set your desired status code here
  )}
  } catch (error) {
    console.error("Error fetching feedback links:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch feedback links" }, { status: 500 });
  }
}

// POST - Create new feedback link
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
console.log(data)
    // Validate required fields
    if (!data.outletId) {
      return NextResponse.json({ 
        success: false, 
        message: "Outlet is required" 
      }, { status: 400 });
    }

    // Check if feedback link already exists for this outlet
    const existingLink = await Database.queryOne(
      `SELECT id FROM feedback_links WHERE outlet_id = ?`,
      [data.outletId]
    );

    if (existingLink) {
      return NextResponse.json({ 
        success: false, 
        message: "Feedback link already exists for this outlet" 
      }, { status: 405 });
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

    // Generate unique token
    const token = generateUniqueToken();
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const url = `${baseUrl}/outlet/feedback/${token}`;

    const linkId = await Database.insert(
      `INSERT INTO feedback_links (outlet_id, token, url, status, total_submissions) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.outletId,
        token,
        url,
        data.status || "Active",
        0
      ]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: linkId, token, url },
      message: "Feedback link created successfully" 
    });
  } catch (error) {
    console.error("Error creating feedback link:", error);
    return NextResponse.json({ success: false, message: "Failed to create feedback link" }, { status: 500 });
  }
}

// Helper function to generate unique token
function generateUniqueToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
