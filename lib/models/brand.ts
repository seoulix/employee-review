import Database from "../database"

export interface Brand {
  id: number
  name: string
  description: string
  logo_url?: string
  status: "Active" | "Inactive"
  created_at: string
  updated_at: string
}

export class BrandModel {
  // Get all brands
  static async getAll(): Promise<Brand[]> {
    const sql = `
      SELECT id, name, description, logo_url, status, created_at, updated_at
      FROM brands 
      ORDER BY name ASC
    `
    return (await Database.query(sql)) as Brand[]
  }

  // Get brand by ID
  static async getById(id: number): Promise<Brand | null> {
    const sql = `
      SELECT id, name, description, logo_url, status, created_at, updated_at
      FROM brands 
      WHERE id = ?
    `
    return (await Database.queryOne(sql, [id])) as Brand | null
  }

  // Create new brand
  static async create(data: Omit<Brand, "id" | "created_at" | "updated_at">): Promise<number> {
    const sql = `
      INSERT INTO brands (name, description, logo_url, status)
      VALUES (?, ?, ?, ?)
    `
    return await Database.insert(sql, [data.name, data.description, data.logo_url, data.status])
  }

  // Update brand
  static async update(id: number, data: Partial<Omit<Brand, "id" | "created_at" | "updated_at">>): Promise<number> {
    const fields = []
    const values = []

    if (data.name !== undefined) {
      fields.push("name = ?")
      values.push(data.name)
    }
    if (data.description !== undefined) {
      fields.push("description = ?")
      values.push(data.description)
    }
    if (data.logo_url !== undefined) {
      fields.push("logo_url = ?")
      values.push(data.logo_url)
    }
    if (data.status !== undefined) {
      fields.push("status = ?")
      values.push(data.status)
    }

    if (fields.length === 0) return 0

    const sql = `UPDATE brands SET ${fields.join(", ")} WHERE id = ?`
    values.push(id)

    return await Database.update(sql, values)
  }

  // Delete brand
  static async delete(id: number): Promise<number> {
    const sql = `DELETE FROM brands WHERE id = ?`
    return await Database.delete(sql, [id])
  }

  // Get brands with outlet count
  static async getBrandsWithStats(): Promise<(Brand & { outlet_count: number })[]> {
    const sql = `
      SELECT 
        b.id, b.name, b.description, b.logo_url, b.status, b.created_at, b.updated_at,
        COUNT(o.id) as outlet_count
      FROM brands b
      LEFT JOIN outlets o ON b.id = o.brand_id AND o.status = 'Active'
      GROUP BY b.id, b.name, b.description, b.logo_url, b.status, b.created_at, b.updated_at
      ORDER BY b.name ASC
    `
    return (await Database.query(sql)) as (Brand & { outlet_count: number })[]
  }
}
