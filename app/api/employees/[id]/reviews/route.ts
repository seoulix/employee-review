import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// GET - Fetch reviews/feedback for employee by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    // Fetch all feedback/reviews for the employee
    const reviews = await Database.query(
`SELECT 
  feedback_submissions.id, 
  customer_name, 
  feedback_submissions.status, 
  rating, 
  feedback_text, 
  feedback_submissions.created_at as date, 
  o.name as outlet_name
FROM feedback_submissions
JOIN outlets as o 
WHERE employee_id = ?
ORDER BY feedback_submissions.created_at DESC`    ,  [id]
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
