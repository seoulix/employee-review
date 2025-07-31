import Database from "../database"

export interface FeedbackSubmission {
  id: number
  feedback_link_id: number
  employee_id: number
  customer_name: string
  customer_phone?: string
  customer_email?: string
  rating: number
  feedback_text?: string
  additional_details?: string
  status: "Perfect" | "Counselling" | "Needs Review"
  ip_address?: string
  user_agent?: string
  submission_time: string
  created_at: string
}

export interface FeedbackWithDetails extends FeedbackSubmission {
  employee_name: string
  outlet_name: string
  brand_name: string
  city_name: string
  state_name: string
}

export class FeedbackModel {
  // Get all feedback with details
  static async getAllWithDetails(
    filters: {
      brand_id?: number
      state_id?: number
      city_id?: number
      outlet_id?: number
      employee_id?: number
      status?: string
      date_from?: string
      date_to?: string
      limit?: number
      offset?: number
    } = {},
  ): Promise<FeedbackWithDetails[]> {
    let sql = `
      SELECT 
        fs.*,
        e.full_name as employee_name,
        o.name as outlet_name,
        b.name as brand_name,
        c.name as city_name,
        s.name as state_name
      FROM feedback_submissions fs
      JOIN employees e ON fs.employee_id = e.id
      JOIN outlets o ON e.outlet_id = o.id
      JOIN brands b ON o.brand_id = b.id
      JOIN cities c ON o.city_id = c.id
      JOIN states s ON c.state_id = s.id
      WHERE 1=1
    `

    const params = []

    if (filters.brand_id) {
      sql += ` AND b.id = ?`
      params.push(filters.brand_id)
    }
    if (filters.state_id) {
      sql += ` AND s.id = ?`
      params.push(filters.state_id)
    }
    if (filters.city_id) {
      sql += ` AND c.id = ?`
      params.push(filters.city_id)
    }
    if (filters.outlet_id) {
      sql += ` AND o.id = ?`
      params.push(filters.outlet_id)
    }
    if (filters.employee_id) {
      sql += ` AND e.id = ?`
      params.push(filters.employee_id)
    }
    if (filters.status) {
      sql += ` AND fs.status = ?`
      params.push(filters.status)
    }
    if (filters.date_from) {
      sql += ` AND DATE(fs.submission_time) >= ?`
      params.push(filters.date_from)
    }
    if (filters.date_to) {
      sql += ` AND DATE(fs.submission_time) <= ?`
      params.push(filters.date_to)
    }

    sql += ` ORDER BY fs.submission_time DESC`

    if (filters.limit) {
      sql += ` LIMIT ?`
      params.push(filters.limit)
      if (filters.offset) {
        sql += ` OFFSET ?`
        params.push(filters.offset)
      }
    }

    return (await Database.query(sql, params)) as FeedbackWithDetails[]
  }

  // Create new feedback submission
  static async create(data: Omit<FeedbackSubmission, "id" | "created_at">): Promise<number> {
    const sql = `
      INSERT INTO feedback_submissions 
      (feedback_link_id, employee_id, customer_name, customer_phone, customer_email, 
       rating, feedback_text, additional_details, status, ip_address, user_agent, submission_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    // Determine status based on rating
    let status: "Perfect" | "Counselling" | "Needs Review"
    if (data.rating >= 4) {
      status = "Perfect"
    } else if (data.rating <= 2) {
      status = "Counselling"
    } else {
      status = "Needs Review"
    }

    const feedbackId = await Database.insert(sql, [
      data.feedback_link_id,
      data.employee_id,
      data.customer_name,
      data.customer_phone,
      data.customer_email,
      data.rating,
      data.feedback_text,
      data.additional_details,
      status,
      data.ip_address,
      data.user_agent,
      data.submission_time,
    ])

    // Update feedback link submission count
    await Database.update(
      `UPDATE feedback_links SET total_submissions = total_submissions + 1, last_used = NOW() WHERE id = ?`,
      [data.feedback_link_id],
    )

    return feedbackId
  }

  // Get feedback statistics
  static async getStatistics(
    filters: {
      brand_id?: number
      state_id?: number
      city_id?: number
      outlet_id?: number
      employee_id?: number
      date_from?: string
      date_to?: string
    } = {},
  ): Promise<{
    total_feedback: number
    perfect_count: number
    counselling_count: number
    needs_review_count: number
    average_rating: number
  }> {
    let sql = `
      SELECT 
        COUNT(*) as total_feedback,
        SUM(CASE WHEN fs.status = 'Perfect' THEN 1 ELSE 0 END) as perfect_count,
        SUM(CASE WHEN fs.status = 'Counselling' THEN 1 ELSE 0 END) as counselling_count,
        SUM(CASE WHEN fs.status = 'Needs Review' THEN 1 ELSE 0 END) as needs_review_count,
        AVG(fs.rating) as average_rating
      FROM feedback_submissions fs
      JOIN employees e ON fs.employee_id = e.id
      JOIN outlets o ON e.outlet_id = o.id
      JOIN brands b ON o.brand_id = b.id
      JOIN cities c ON o.city_id = c.id
      JOIN states s ON c.state_id = s.id
      WHERE 1=1
    `

    const params = []

    if (filters.brand_id) {
      sql += ` AND b.id = ?`
      params.push(filters.brand_id)
    }
    if (filters.state_id) {
      sql += ` AND s.id = ?`
      params.push(filters.state_id)
    }
    if (filters.city_id) {
      sql += ` AND c.id = ?`
      params.push(filters.city_id)
    }
    if (filters.outlet_id) {
      sql += ` AND o.id = ?`
      params.push(filters.outlet_id)
    }
    if (filters.employee_id) {
      sql += ` AND e.id = ?`
      params.push(filters.employee_id)
    }
    if (filters.date_from) {
      sql += ` AND DATE(fs.submission_time) >= ?`
      params.push(filters.date_from)
    }
    if (filters.date_to) {
      sql += ` AND DATE(fs.submission_time) <= ?`
      params.push(filters.date_to)
    }

    const result = (await Database.queryOne(sql, params)) as any
    return {
      total_feedback: result.total_feedback || 0,
      perfect_count: result.perfect_count || 0,
      counselling_count: result.counselling_count || 0,
      needs_review_count: result.needs_review_count || 0,
      average_rating: Number.parseFloat(result.average_rating) || 0,
    }
  }

  // Get recent feedback for dashboard
  static async getRecentFeedback(limit = 10): Promise<FeedbackWithDetails[]> {
    return await this.getAllWithDetails({ limit })
  }
}
