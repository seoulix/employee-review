import { type NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"
import { NotificationService } from "@/lib/services/notification"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      "feedback_link_id",
      "feedback_unique_id",
      "rating",
      // "additional_details",
      // "service_quality",
      // "communication",
      // "professionalism",
      // "problem_resolution",
      // "feedback_text",
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ success: false, message: `Missing required field: ${field}` }, { status: 400 })
      }
    }

const hasDeepFeedback = !!(data.detailed_responses && Object.keys(data.detailed_responses).length > 0);

const feedbackId = await Database.insert(
  `INSERT INTO feedback_submissions (
    feedback_link_id, employee_id, customer_name, customer_phone, customer_email,
    rating, feedback_text, additional_details, ip_address, user_agent, status,
    submission_time, created_at, has_deep_feedback, feedback_unique_id, tiles
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)`,
  [
    data.feedback_link_id,
    data.employee_id,
    data.customer_name,
    data.customer_phone ?? null,
    data.customer_email ?? null,
    data.rating,
    data.feedback_text ?? null,
    data.additional_details ?? null,
    data.ip_address ?? null,
    data.user_agent ?? null,
    data.rating >= 4 ? "Perfect" : data.rating >= 3 ? "Needs Review" : "Counselling",
    hasDeepFeedback ? 1 : 0,
    data.feedback_unique_id,
    data.tiles ?? null
  ]
);
    // Insert feedback submission
console.log(data)
    // Insert detailed feedback responses if provided
    if (hasDeepFeedback) {
      for (const [questionId, response] of Object.entries(data.detailed_responses)) {
        if (response !== null && response !== undefined && response !== '') {
          const res = await Database.insert(
            `INSERT INTO feedback_responses (
              feedback_submission_id, question_id, response_value
              ) VALUES (?, ?, ?)`,
              [
                feedbackId,
                parseInt(questionId),
                typeof response === 'object' ? JSON.stringify(response) : String(response)
              ]
            )
            // const resJson = await res.json();
            console.log(res,questionId,response)
        }
      }
    }
    // Get employee and outlet details for notification
    const employeeDetails = await Database.queryOne(
      `
      SELECT 
        e.full_name as employee_name,
        o.name as outlet_name,
        b.name as brand_name
      FROM employees e
      JOIN outlets o ON e.outlet_id = o.id
      JOIN brands b ON o.brand_id = b.id
      WHERE e.id = ?
    `,
      [data.employee_id],
    )

    if (employeeDetails) {
      // Prepare notification data
      const notificationData = {
        employeeName: employeeDetails.employee_name,
        customerName: data.customer_name,
        rating: data.rating,
        feedback: data.feedback_text,
        outlet: employeeDetails.outlet_name,
        brand: employeeDetails.brand_name,
        submissionTime: new Date().toISOString(),
      }

      // Process notifications asynchronously
      NotificationService.processRatingNotification(notificationData).catch((error) => {
        console.error("Error processing notification:", error)
      })
    }

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      data: { id: feedbackId },
    })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return NextResponse.json({ success: false, message: "Failed to submit feedback" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const employeeId = searchParams.get("employeeId")
    const outletId = searchParams.get("outletId")
    const rating = searchParams.get("rating")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const offset = (page - 1) * limit
    const whereConditions = []
    const params: any[] = []

    // Build where conditions
    if (employeeId) {
      whereConditions.push("fs.employee_id = ?")
      params.push(employeeId)
    }

    if (outletId) {
      whereConditions.push("e.outlet_id = ?")
      params.push(outletId)
    }

    if (rating) {
      whereConditions.push("fs.rating = ?")
      params.push(rating)
    }

    if (startDate) {
      whereConditions.push("DATE(fs.submitted_at) >= ?")
      params.push(startDate)
    }

    if (endDate) {
      whereConditions.push("DATE(fs.created_at) <= ?")
      params.push(endDate)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get feedback submissions
    const feedbackQuery = `
      SELECT 
        fs.*,
        e.full_name as employee_name,
        e.id as employee_id,
        o.name as outlet_name,
        b.name as brand_name,
        CONCAT(s.name, ', ', c.name) as location
      FROM feedback_submissions fs
      JOIN employees e ON fs.employee_id = e.id
JOIN outlets o ON e.outlet_id = o.id
JOIN brands b ON o.brand_id = b.id
JOIN cities c ON o.city_id = c.id
JOIN states s ON c.state_id = s.id
      ${whereClause}
      ORDER BY fs.created_at DESC
      LIMIT ? OFFSET ?
    `

    params.push(limit, offset)
    const feedback = await Database.query(feedbackQuery, params)

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM feedback_submissions fs
      JOIN employees e ON fs.employee_id = e.id
      ${whereClause}
    `

    const countParams = params.slice(0, -2) // Remove limit and offset
    const totalResult = await Database.queryOne(countQuery, countParams)
    const total = totalResult?.total || 0

    return NextResponse.json({
      success: true,
      data: {
        feedback,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch feedback" }, { status: 500 })
  }
}
