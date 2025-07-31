import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// GET - Fetch reviews/feedback for employee by ID
export async function GET(request: NextRequest) {
  try {
    // Fetch all feedback/reviews for the employee
    const reviews = await Database.query(
`SELECT 
  e.id, 
  e.full_name, 
  AVG(f.rating) as avg_rating
FROM employees e
LEFT JOIN feedback_submissions f ON e.id = f.employee_id
GROUP BY e.id
ORDER BY avg_rating DESC`
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
