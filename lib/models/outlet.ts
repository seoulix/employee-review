import Database from "../database"

export interface Outlet {
  id: number
  name: string
  brand_id: number
  city_id: number
  address: string
  manager_name?: string
  manager_phone?: string
  manager_email?: string
  status: "Active" | "Inactive"
  created_at: string
  updated_at: string
}

export interface OutletWithDetails extends Outlet {
  brand_name: string
  city_name: string
  state_name: string
  state_code: string
  employee_count: number
  feedback_count: number
  average_rating: number
  feedback_token?: string
  feedback_url?: string
}

export class OutletModel {
  // Get all outlets with details
  static async getAllWithDetails(): Promise<OutletWithDetails[]> {
    const sql = `
      SELECT 
        o.*,
        b.name as brand_name,
        c.name as city_name,
        s.name as state_name,
        s.code as state_code,
        COUNT(DISTINCT e.id) as employee_count,
        COUNT(DISTINCT fs.id) as feedback_count,
        AVG(fs.rating) as average_rating,
        fl.token as feedback_token,
        fl.url as feedback_url
      FROM outlets o
      LEFT JOIN brands b ON o.brand_id = b.id
      LEFT JOIN cities c ON o.city_id = c.id
      LEFT JOIN states s ON c.state_id = s.id
      LEFT JOIN employees e ON o.id = e.outlet_id AND e.status = 'Active'
      LEFT JOIN feedback_submissions fs ON e.id = fs.employee_id
      LEFT JOIN feedback_links fl ON o.id = fl.outlet_id AND fl.status = 'Active'
      WHERE o.status = 'Active'
      GROUP BY o.id, o.name, o.brand_id, o.city_id, o.address, o.manager_name, 
               o.manager_phone, o.manager_email, o.status, o.created_at, o.updated_at,
               b.name, c.name, s.name, s.code, fl.token, fl.url
      ORDER BY o.name ASC
    `
    return (await Database.query(sql)) as OutletWithDetails[]
  }

  // Get outlet by ID
  static async getById(id: number): Promise<Outlet | null> {
    const sql = `
      SELECT id, name, brand_id, city_id, address, manager_name, manager_phone, 
             manager_email, status, created_at, updated_at
      FROM outlets 
      WHERE id = ?
    `
    return (await Database.queryOne(sql, [id])) as Outlet | null
  }

  // Create new outlet
  static async create(data: Omit<Outlet, "id" | "created_at" | "updated_at">): Promise<number> {
    const sql = `
      INSERT INTO outlets (name, brand_id, city_id, address, manager_name, manager_phone, manager_email, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    return await Database.insert(sql, [
      data.name,
      data.brand_id,
      data.city_id,
      data.address,
      data.manager_name,
      data.manager_phone,
      data.manager_email,
      data.status,
    ])
  }

  // Update outlet
  static async update(id: number, data: Partial<Omit<Outlet, "id" | "created_at" | "updated_at">>): Promise<number> {
    const fields = []
    const values = []

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`)
        values.push(value)
      }
    })

    if (fields.length === 0) return 0

    const sql = `UPDATE outlets SET ${fields.join(", ")} WHERE id = ?`
    values.push(id)

    return await Database.update(sql, values)
  }

  // Delete outlet
  static async delete(id: number): Promise<number> {
    const sql = `DELETE FROM outlets WHERE id = ?`
    return await Database.delete(sql, [id])
  }

  // Get outlets by brand
  static async getByBrand(brandId: number): Promise<OutletWithDetails[]> {
    const sql = `
      SELECT 
        o.*,
        b.name as brand_name,
        c.name as city_name,
        s.name as state_name,
        s.code as state_code,
        COUNT(DISTINCT e.id) as employee_count,
        COUNT(DISTINCT fs.id) as feedback_count,
        AVG(fs.rating) as average_rating
      FROM outlets o
      LEFT JOIN brands b ON o.brand_id = b.id
      LEFT JOIN cities c ON o.city_id = c.id
      LEFT JOIN states s ON c.state_id = s.id
      LEFT JOIN employees e ON o.id = e.outlet_id AND e.status = 'Active'
      LEFT JOIN feedback_submissions fs ON e.id = fs.employee_id
      WHERE o.brand_id = ? AND o.status = 'Active'
      GROUP BY o.id
      ORDER BY o.name ASC
    `
    return (await Database.query(sql, [brandId])) as OutletWithDetails[]
  }

  // Get outlets by city
  static async getByCity(cityId: number): Promise<OutletWithDetails[]> {
    const sql = `
      SELECT 
        o.*,
        b.name as brand_name,
        c.name as city_name,
        s.name as state_name,
        s.code as state_code,
        COUNT(DISTINCT e.id) as employee_count,
        COUNT(DISTINCT fs.id) as feedback_count,
        AVG(fs.rating) as average_rating
      FROM outlets o
      LEFT JOIN brands b ON o.brand_id = b.id
      LEFT JOIN cities c ON o.city_id = c.id
      LEFT JOIN states s ON c.state_id = s.id
      LEFT JOIN employees e ON o.id = e.outlet_id AND e.status = 'Active'
      LEFT JOIN feedback_submissions fs ON e.id = fs.employee_id
      WHERE o.city_id = ? AND o.status = 'Active'
      GROUP BY o.id
      ORDER BY o.name ASC
    `
    return (await Database.query(sql, [cityId])) as OutletWithDetails[]
  }
}
