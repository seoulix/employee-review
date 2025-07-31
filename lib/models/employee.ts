import Database from "../database"

export interface Employee {
  id: number
  employee_code: string
  full_name: string
  email?: string
  phone?: string
  outlet_id: number
  position: string
  photo_url?: string
  join_date: string
  status: "Active" | "Inactive"
  created_at: string
  updated_at: string
}

export interface EmployeeWithDetails extends Employee {
  outlet_name: string
  brand_name: string
  city_name: string
  state_name: string
  total_reviews: number
  average_rating: number
  perfect_count: number
  counselling_count: number
  needs_review_count: number
  last_feedback_date?: string
}

export class EmployeeModel {
  // Get all employees with details
  static async getAllWithDetails(): Promise<EmployeeWithDetails[]> {
    const sql = `
      SELECT * FROM employee_performance_summary
      ORDER BY average_rating DESC, total_reviews DESC
    `
    return (await Database.query(sql)) as EmployeeWithDetails[]
  }

  // Get employee by ID
  static async getById(id: number): Promise<Employee | null> {
    const sql = `
      SELECT id, employee_code, full_name, email, phone, outlet_id, position, 
             photo_url, join_date, status, created_at, updated_at
      FROM employees 
      WHERE id = ?
    `
    return (await Database.queryOne(sql, [id])) as Employee | null
  }

  // Get employee with details by ID
  static async getByIdWithDetails(id: number): Promise<EmployeeWithDetails | null> {
    const sql = `
      SELECT * FROM employee_performance_summary
      WHERE id = ?
    `
    return (await Database.queryOne(sql, [id])) as EmployeeWithDetails | null
  }

  // Create new employee
  static async create(data: Omit<Employee, "id" | "created_at" | "updated_at">): Promise<number> {
    const sql = `
      INSERT INTO employees (employee_code, full_name, email, phone, outlet_id, position, photo_url, join_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    return await Database.insert(sql, [
      data.employee_code,
      data.full_name,
      data.email,
      data.phone,
      data.outlet_id,
      data.position,
      data.photo_url,
      data.join_date,
      data.status,
    ])
  }

  // Update employee
  static async update(id: number, data: Partial<Omit<Employee, "id" | "created_at" | "updated_at">>): Promise<number> {
    const fields = []
    const values = []

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`)
        values.push(value)
      }
    })

    if (fields.length === 0) return 0

    const sql = `UPDATE employees SET ${fields.join(", ")} WHERE id = ?`
    values.push(id)

    return await Database.update(sql, values)
  }

  // Delete employee
  static async delete(id: number): Promise<number> {
    const sql = `DELETE FROM employees WHERE id = ?`
    return await Database.delete(sql, [id])
  }

  // Get employees by outlet
  static async getByOutlet(outletId: number): Promise<Employee[]> {
    const sql = `
      SELECT id, employee_code, full_name, email, phone, outlet_id, position, 
             photo_url, join_date, status, created_at, updated_at
      FROM employees 
      WHERE outlet_id = ? AND status = 'Active'
      ORDER BY full_name ASC
    `
    return (await Database.query(sql, [outletId])) as Employee[]
  }

  // Get leaderboard
  static async getLeaderboard(
    filters: {
      outlet_id?: number
      brand_id?: number
      city_id?: number
      state_id?: number
      limit?: number
    } = {},
  ): Promise<EmployeeWithDetails[]> {
    let sql = `
      SELECT eps.*, 
             ROW_NUMBER() OVER (ORDER BY eps.average_rating DESC, eps.total_reviews DESC) as rank
      FROM employee_performance_summary eps
      JOIN outlets o ON eps.outlet_name = o.name
      JOIN brands b ON eps.brand_name = b.name
      JOIN cities c ON eps.city_name = c.name
      JOIN states s ON eps.state_name = s.name
      WHERE eps.total_reviews > 0
    `

    const params = []

    if (filters.outlet_id) {
      sql += ` AND o.id = ?`
      params.push(filters.outlet_id)
    }
    if (filters.brand_id) {
      sql += ` AND b.id = ?`
      params.push(filters.brand_id)
    }
    if (filters.city_id) {
      sql += ` AND c.id = ?`
      params.push(filters.city_id)
    }
    if (filters.state_id) {
      sql += ` AND s.id = ?`
      params.push(filters.state_id)
    }

    sql += ` ORDER BY eps.average_rating DESC, eps.total_reviews DESC`

    if (filters.limit) {
      sql += ` LIMIT ?`
      params.push(filters.limit)
    }

    return (await Database.query(sql, params)) as EmployeeWithDetails[]
  }

  // Generate unique employee code
  static async generateEmployeeCode(): Promise<string> {
    const sql = `SELECT employee_code FROM employees ORDER BY id DESC LIMIT 1`
    const lastEmployee = (await Database.queryOne(sql)) as { employee_code: string } | null

    if (!lastEmployee) {
      return "EMP001"
    }

    const lastNumber = Number.parseInt(lastEmployee.employee_code.replace("EMP", ""))
    const nextNumber = lastNumber + 1
    return `EMP${nextNumber.toString().padStart(3, "0")}`
  }
}
