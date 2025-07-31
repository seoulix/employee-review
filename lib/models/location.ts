import Database from "../database"

export interface State {
  id: number
  name: string
  code: string
  status: "Active" | "Inactive"
  created_at: string
  updated_at: string
}

export interface City {
  id: number
  name: string
  state_id: number
  status: "Active" | "Inactive"
  created_at: string
  updated_at: string
}

export interface StateWithCities extends State {
  cities: City[]
  city_count: number
}

export interface CityWithState extends City {
  state_name: string
  state_code: string
  outlet_count: number
}

export class LocationModel {
  // Get all states
  static async getAllStates(): Promise<State[]> {
    const sql = `
      SELECT id, name, code, status, created_at, updated_at
      FROM states 
      ORDER BY name ASC
    `
    return (await Database.query(sql)) as State[]
  }

  // Get all states with city count
  static async getStatesWithStats(): Promise<(State & { city_count: number })[]> {
    const sql = `
      SELECT 
        s.id, s.name, s.code, s.status, s.created_at, s.updated_at,
        COUNT(c.id) as city_count
      FROM states s
      LEFT JOIN cities c ON s.id = c.state_id AND c.status = 'Active'
      GROUP BY s.id, s.name, s.code, s.status, s.created_at, s.updated_at
      ORDER BY s.name ASC
    `
    return (await Database.query(sql)) as (State & { city_count: number })[]
  }

  // Get all cities with state details
  static async getAllCitiesWithState(): Promise<CityWithState[]> {
    const sql = `
      SELECT 
        c.id, c.name, c.state_id, c.status, c.created_at, c.updated_at,
        s.name as state_name, s.code as state_code,
        COUNT(o.id) as outlet_count
      FROM cities c
      JOIN states s ON c.state_id = s.id
      LEFT JOIN outlets o ON c.id = o.city_id AND o.status = 'Active'
      GROUP BY c.id, c.name, c.state_id, c.status, c.created_at, c.updated_at, s.name, s.code
      ORDER BY s.name ASC, c.name ASC
    `
    return (await Database.query(sql)) as CityWithState[]
  }

  // Get cities by state
  static async getCitiesByState(stateId: number): Promise<City[]> {
    const sql = `
      SELECT id, name, state_id, status, created_at, updated_at
      FROM cities 
      WHERE state_id = ? AND status = 'Active'
      ORDER BY name ASC
    `
    return (await Database.query(sql, [stateId])) as City[]
  }

  // Create state
  static async createState(data: Omit<State, "id" | "created_at" | "updated_at">): Promise<number> {
    const sql = `
      INSERT INTO states (name, code, status)
      VALUES (?, ?, ?)
    `
    return await Database.insert(sql, [data.name, data.code, data.status])
  }

  // Create city
  static async createCity(data: Omit<City, "id" | "created_at" | "updated_at">): Promise<number> {
    const sql = `
      INSERT INTO cities (name, state_id, status)
      VALUES (?, ?, ?)
    `
    return await Database.insert(sql, [data.name, data.state_id, data.status])
  }

  // Update state
  static async updateState(
    id: number,
    data: Partial<Omit<State, "id" | "created_at" | "updated_at">>,
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

    const sql = `UPDATE states SET ${fields.join(", ")} WHERE id = ?`
    values.push(id)

    return await Database.update(sql, values)
  }

  // Update city
  static async updateCity(id: number, data: Partial<Omit<City, "id" | "created_at" | "updated_at">>): Promise<number> {
    const fields = []
    const values = []

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`)
        values.push(value)
      }
    })

    if (fields.length === 0) return 0

    const sql = `UPDATE cities SET ${fields.join(", ")} WHERE id = ?`
    values.push(id)

    return await Database.update(sql, values)
  }

  // Delete state
  static async deleteState(id: number): Promise<number> {
    const sql = `DELETE FROM states WHERE id = ?`
    return await Database.delete(sql, [id])
  }

  // Delete city
  static async deleteCity(id: number): Promise<number> {
    const sql = `DELETE FROM cities WHERE id = ?`
    return await Database.delete(sql, [id])
  }
}
