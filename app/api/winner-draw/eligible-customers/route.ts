import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Get all unique customers who have submitted deep feedback
    const customers = await Database.query(
      `SELECT 
        customer_name, 
        customer_email, 
        customer_phone,
        MAX(created_at) as last_review_date, 
        COUNT(*) as total_reviews
      FROM feedback_submissions
      WHERE has_deep_feedback = 1
      GROUP BY customer_name, customer_email, customer_phone
      ORDER BY last_review_date DESC`
    );

    // For each customer, get their recent reviews (limit 5)
    const customersWithReviews = await Promise.all(
      customers.map(async (customer: any) => {
        const reviews = await Database.query(
          `SELECT id, created_at, rating, feedback_text
           FROM feedback_submissions
           WHERE has_deep_feedback = 1
             AND customer_name = ?
             AND customer_email = ?
             AND customer_phone = ?
           ORDER BY created_at DESC
           LIMIT 5`,
          [customer.customer_name, customer.customer_email, customer.customer_phone]
        );
        return { ...customer, reviews };
      })
    );

    return NextResponse.json({ success: true, data: customersWithReviews });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch eligible customers" }, { status: 500 });
  }
} 