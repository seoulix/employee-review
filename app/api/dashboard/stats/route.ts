import { NextResponse } from "next/server"
import Database from "@/lib/database"

export async function GET() {
  try {
    // Get today's stats
    const today = new Date(Date.now() ).toISOString().split("T")[0]

    // Total reviews today
    const todaysReview = (await Database.queryOne(
      `SELECT COUNT(*) as count FROM feedback_submissions WHERE DATE(submission_time) = CURDATE()`,
    )) as { count: number } | null;
    const todayCount = todaysReview?.count ?? 0;

    const yesterday = new Date(Date.now() - 86400000) // 86400000 ms = 1 day
  .toISOString()
  .split("T")[0];

  console.log(JSON.stringify(todaysReview),today)

    const yesterdayReview = (await Database.queryOne(
      `SELECT COUNT(*) as count FROM feedback_submissions WHERE DATE(submission_time) = CURDATE() - INTERVAL 1 DAY`
    )) as { count: number } | null;
    const yesterdayCount = yesterdayReview?.count ?? 0;
    let change = 0;
    if (yesterdayCount === 0) {
      change = 100;
    } else {
      change =String( ((todayCount - yesterdayCount) / yesterdayCount) * 100)+"%";
    }
    const totalReviewsToday = {
      title: "Total Review Today",
      value: todayCount,
      change,
      changeType: yesterdayCount > todayCount ? "negative" : "positive",
    };

    // Top performer today
    const todayTopPerformer = (await Database.queryOne(
      `
      SELECT 
        e.full_name,
        o.name as outlet_name,
        AVG(fs.rating) as avg_rating,
        COUNT(fs.id) as review_count
      FROM employees e
      JOIN outlets o ON e.outlet_id = o.id
      JOIN feedback_submissions fs ON e.id = fs.employee_id
      WHERE DATE(fs.submission_time) = CURDATE()
      GROUP BY e.id, e.full_name, o.name
      HAVING review_count > 0
      ORDER BY avg_rating DESC, review_count DESC
      LIMIT 1` ,
    )) as any | null;

    const topPerformerData = todayTopPerformer
      ? {
          name: todayTopPerformer.full_name,
          outlet: todayTopPerformer.outlet_name,
          rating: Number.parseFloat(todayTopPerformer.avg_rating).toFixed(1),
        }
      : null;


    const yesterdayTopPerformer =(await Database.queryOne(
      `
      SELECT 
        e.full_name,
        o.name as outlet_name,
        AVG(fs.rating) as avg_rating,
        COUNT(fs.id) as review_count
      FROM employees e
      JOIN outlets o ON e.outlet_id = o.id
      JOIN feedback_submissions fs ON e.id = fs.employee_id
      WHERE DATE(fs.submission_time) =CURDATE() - INTERVAL 1 DAY
      GROUP BY e.id, e.full_name, o.name
      HAVING review_count > 0
      ORDER BY avg_rating DESC, review_count DESC
      LIMIT 1
    `,
    )) as any | null;

    const yesterdayRating = yesterdayTopPerformer?.avg_rating
      ? Number.parseFloat(yesterdayTopPerformer.avg_rating)
      : 0;

    const todayRating = todayTopPerformer?.avg_rating
      ? Number.parseFloat(todayTopPerformer.avg_rating)
      : 0;

    const topPerformerToday = {
      title: "Top Performer Today",
      value: topPerformerData,
      subtitle: topPerformerData?.outlet || "",
      change: topPerformerData?.rating || "",
      changeType: todayRating < yesterdayRating ? "negative" : "positive",
    }
    
    // Negative feedbacks today
    const negativeFeedbacksToday = (await Database.queryOne(
      `SELECT COUNT(*) as count FROM feedback_submissions WHERE rating <= 2 AND DATE(submission_time) = CURDATE()`,
    )) as { count: number } | null;
    const negativeToday = negativeFeedbacksToday?.count ?? 0;

    // Negative feedbacks yesterday
    const negativeFeedbacksYesterday = (await Database.queryOne(
      `SELECT COUNT(*) as count FROM feedback_submissions WHERE rating <= 2 AND DATE(submission_time) = CURDATE() - INTERVAL 1 DAY`,
    )) as { count: number } | null;
    const negativeYesterday = negativeFeedbacksYesterday?.count ?? 0;

    const negativeFeedbacks = {
      title: "Negative Feedbacks",
      today: negativeToday,
      yesterday: negativeYesterday,
      change: negativeYesterday === 0 ? 100 : ((negativeToday - negativeYesterday) / negativeYesterday) * 100,
      changeType: negativeToday < negativeYesterday ? "positive" : "negative",
    };

    // Counselling alerts
    const counsellingAlerts = (await Database.queryOne(
      `SELECT COUNT(*) as count FROM feedback_submissions WHERE status = 'Counselling'`,
      [],
    )) as { count: number } | null;

    // Recent activity
    const recentActivity = (await Database.query(`
      SELECT 
        e.full_name as employee,
        o.name as outlet,
        fs.rating,
        fs.submission_time as time
      FROM feedback_submissions fs
      JOIN employees e ON fs.employee_id = e.id
      JOIN outlets o ON e.outlet_id = o.id
      ORDER BY fs.submission_time DESC
      LIMIT 10
    `)) as any[]

    return NextResponse.json({
      success: true,
      data: {
        totalReviewsToday,
        topPerformerToday,
        negativeFeedbacks,
        counsellingAlerts: counsellingAlerts?.count ?? 0,
        recentActivity: recentActivity.map((activity) => ({
          employee: activity.employee,
          outlet: activity.outlet,
          rating: activity.rating,
          time: new Date(activity.time).toLocaleString(),
        })),
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
