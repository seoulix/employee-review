import { type NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "today"
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const outletId = searchParams.get("outletId")
    const brandId = searchParams.get("brandId")

    let dateFilter = ""
    const params: any[] = []

    // Set date filter based on period
    switch (period) {
      case "today":
        dateFilter = "AND DATE(fs.created_at) = CURDATE()"
        break
      case "week":
        dateFilter = "AND fs.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
        break
      case "month":
        dateFilter = "AND fs.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
        break
      case "quarter":
        dateFilter = "AND fs.created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)"
        break
      case "year":
        dateFilter = "AND fs.created_at >= DATE_SUB(NOW(), INTERVAL 365 DAY)"
        break
      default:
        dateFilter = ""
    }

    // Build additional filters
    let additionalFilters = ""
    if (outletId) {
      additionalFilters += " AND e.outlet_id = ?"
      params.push(outletId)
    }
    if (brandId) {
      additionalFilters += " AND o.brand_id = ?"
      params.push(brandId)
    }

    // Add limit parameter
    params.push(limit)

    const leaderboardQuery = `
      SELECT 
        e.id,
        e.full_name AS employee_name,
        e.photo_url as photo,
        e.email,
        e.phone,
        e.position,
        e.join_date,
        e.status AS employee_status,
        o.name AS outlet_name,
        b.name AS brand_name,
        c.name AS city_name,
        s.name AS state_name,
        COUNT(fs.id) AS total_reviews,
        ROUND(AVG(fs.rating), 2) AS average_rating,
        MAX(fs.created_at) AS last_review_date,
        MIN(fs.created_at) AS first_review_date
      FROM employees e
      LEFT JOIN feedback_submissions fs ON e.id = fs.employee_id
      LEFT JOIN outlets o ON e.outlet_id = o.id
      LEFT JOIN brands b ON o.brand_id = b.id
      LEFT JOIN cities c ON o.city_id = c.id
      LEFT JOIN states s ON c.state_id = s.id
      WHERE e.status = 'Active'
      GROUP BY e.id, e.full_name, e.email, e.phone, e.position, e.join_date, e.status, o.name, b.name, c.name, s.name
      HAVING total_reviews > 0
      ORDER BY average_rating DESC, total_reviews DESC
      LIMIT 50
    `

    const leaderboard = await Database.query(leaderboardQuery, params)

    // Get summary statistics
    const summaryQuery = `
      SELECT 
        COUNT(DISTINCT e.id) as total_employees,
        COUNT(fs.id) as total_reviews,
        ROUND(AVG(fs.rating), 2) as overall_average,
        SUM(CASE WHEN fs.rating >= 4 THEN 1 ELSE 0 END) as positive_reviews,
        SUM(CASE WHEN fs.rating <= 2 THEN 1 ELSE 0 END) as negative_reviews
      FROM employees e
      LEFT JOIN feedback_submissions fs ON e.id = fs.employee_id ${dateFilter}
      LEFT JOIN outlets o ON e.outlet_id = o.id
      WHERE e.status = TRUE ${additionalFilters.replace("LIMIT ?", "")}
    `

    const summaryParams = params.slice(0, -1) // Remove limit parameter
    const summary = await Database.queryOne(summaryQuery, summaryParams)

    // Get top performers by category
    // Service Quality
    const serviceQuality = await Database.query(`
      SELECT 
        'Top Rating' as category,
        e.full_name as employee_name,
        e.photo_url as photo,
        o.name as outlet_name,
        ROUND(AVG(fs.rating), 2) as score
      FROM employees e
      JOIN feedback_submissions fs ON e.id = fs.employee_id
      JOIN outlets o ON e.outlet_id = o.id
      WHERE e.status = 'Active' AND fs.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY e.id, e.full_name, o.name
      HAVING COUNT(fs.id) >= 3
      ORDER BY score DESC
      LIMIT 3
    `);

    // Communication
    const communication = await Database.query(`
      SELECT 
        'Top Rating' as category,
        e.full_name as employee_name,
        e.photo_url as photo,
        o.name as outlet_name,
        ROUND(AVG(fs.rating), 2) as score
      FROM employees e
      JOIN feedback_submissions fs ON e.id = fs.employee_id
      JOIN outlets o ON e.outlet_id = o.id
      WHERE e.status = 'Active' AND fs.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY e.id, e.full_name, o.name
      HAVING COUNT(fs.id) >= 3
      ORDER BY score DESC
      LIMIT 3
    `);

    // Professionalism
    const professionalism = await Database.query(`
      SELECT 
        'Top Rating' as category,
        e.full_name as employee_name,
        e.photo_url as photo,
        o.name as outlet_name,
        ROUND(AVG(fs.rating), 2) as score
      FROM employees e
      JOIN feedback_submissions fs ON e.id = fs.employee_id
      JOIN outlets o ON e.outlet_id = o.id
      WHERE e.status = 'Active' AND fs.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY e.id, e.full_name, o.name
      HAVING COUNT(fs.id) >= 3
      ORDER BY score DESC
      LIMIT 3
    `);

    const topPerformers = [
      ...serviceQuality,
      ...communication,
      ...professionalism,
    ];

    return NextResponse.json({
      success: true,
      data: {
        leaderboard,
        summary,
        topPerformers,
        period,
        filters: {
          outletId,
          brandId,
          limit,
        },
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch leaderboard data" }, { status: 500 })
  }
}
