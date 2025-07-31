import mysql from "mysql2/promise"

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "employee_review_system",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
}

// Create connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Database utility functions
export class Database {
  // Test database connection
  static async testConnection() {
    try {
      const connection = await pool.getConnection()
      await connection.ping()
      connection.release()
      return true
    } catch (error) {
      console.error("Database connection failed:", error)
      return false
    }
  }

  // Execute query with parameters
  static async query(sql: string, params: any[] = []) {
    try {
      const [rows] = await pool.execute(sql, params) as any[]
      return rows
    } catch (error) {
      console.error("Database query error:", error)
      throw error
    }
  }

  // Get single record
  static async queryOne(sql: string, params: any[] = []) {
    const rows = (await this.query(sql, params)) as any[]
    return rows.length > 0 ? rows[0] : null
  }

  // Insert record and return ID
  static async insert(sql: string, params: any[] = []) {
    try {
      const [result] = (await pool.execute(sql, params)) as any[]
      return result.insertId
    } catch (error) {
      console.error("Database insert error:", error)
      throw error
    }
  }

  // Update record and return affected rows
  static async update(sql: string, params: any[] = []) {
    try {
      const [result] = (await pool.execute(sql, params)) as any[]
      return result.affectedRows
    } catch (error) {
      console.error("Database update error:", error)
      throw error
    }
  }

  // Delete record and return affected rows
  static async delete(sql: string, params: any[] = []) {
    try {
      const [result] = (await pool.execute(sql, params)) as any[]
      return result.affectedRows
    } catch (error) {
      console.error("Database delete error:", error)
      throw error
    }
  }

  // Transaction support
  static async transaction(callback: (connection: any) => Promise<any>) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      const result = await callback(connection)
      await connection.commit()
      return result
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }
}

export default Database
