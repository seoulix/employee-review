import Database from "../database"

export interface FeedbackLink {
  id: number
  outlet_id: number
  token: string
  url: string
  status: "Active" | "Inactive"
  total_submissions: number
  last_used?: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface FeedbackLinkWithDetails extends FeedbackLink {
  outlet_name: string
  brand_name: string
  city_name: string
  state_name: string
}

export class FeedbackLinkModel {
  // Get all feedback links with details
  static async getAllWithDetails(): Promise<FeedbackLinkWithDetails[]> {
    const sql = `
      SELECT 
        fl.*,
        o.name as outlet_name,
        b.name as brand_name,
        c.name as city_name,
        s.name as state_name
      FROM feedback_links fl
      JOIN outlets o ON fl.outlet_id = o.id
      JOIN brands b ON o.brand_id = b.id
      JOIN cities c ON o.city_id = c.id
      JOIN states s ON c.state_id = s.id
      ORDER BY fl.created_at DESC
    `
    return (await Database.query(sql)) as FeedbackLinkWithDetails[]
  }

  // Get feedback link by token
  static async getByToken(token: string): Promise<FeedbackLinkWithDetails | null> {
    const sql = `
      SELECT 
        fl.*,
        o.name as outlet_name,
        b.name as brand_name,
        c.name as city_name,
        s.name as state_name
      FROM feedback_links fl
      JOIN outlets o ON fl.outlet_id = o.id
      JOIN brands b ON o.brand_id = b.id
      JOIN cities c ON o.city_id = c.id
      JOIN states s ON c.state_id = s.id
      WHERE fl.token = ? AND fl.status = 'Active'
    `
    return (await Database.queryOne(sql, [token])) as FeedbackLinkWithDetails | null
  }

  // Create new feedback link
  static async create(data: Omit<FeedbackLink, "id" | "created_at" | "updated_at">): Promise<number> {
    const fullUrl = `${data.url}${data.token}`

    const sql = `
      INSERT INTO feedback_links (outlet_id, token, url, status, total_submissions, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    return await Database.insert(sql, [
      data.outlet_id,
      data.token,
      fullUrl,
      data.status,
      data.total_submissions,
      data.expires_at,
    ])
  }

  // Update feedback link
  static async update(
    id: number,
    data: Partial<Omit<FeedbackLink, "id" | "created_at" | "updated_at">>,
  ): Promise<number> {
    const fields = []
    const values = []

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`)
        values.push(value)
      }
    })

    if (fields.length === 0) return 0

    const sql = `UPDATE feedback_links SET ${fields.join(", ")} WHERE id = ?`
    values.push(id)

    return await Database.update(sql, values)
  }

  // Generate unique token
  static generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Regenerate token for feedback link
  static async regenerateToken(id: number): Promise<string> {
    const newToken = this.generateToken()
    const newUrl = `${process.env.APP_URL}/outlet/feedback/${newToken}`

    await this.update(id, {
      token: newToken,
      url: newUrl,
    })

    return newToken
  }

  // Get feedback link by outlet
  static async getByOutlet(outletId: number): Promise<FeedbackLink | null> {
    const sql = `
      SELECT id, outlet_id, token, url, status, total_submissions, last_used, expires_at, created_at, updated_at
      FROM feedback_links 
      WHERE outlet_id = ? AND status = 'Active'
      ORDER BY created_at DESC
      LIMIT 1
    `
    return (await Database.queryOne(sql, [outletId])) as FeedbackLink | null
  }
}
