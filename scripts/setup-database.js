const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")

async function setupDatabase() {
  try {
    // Database configuration
    const config = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      multipleStatements: true,
    }

    console.log("Connecting to MySQL server...")
    const connection = await mysql.createConnection(config)

    // Read and execute schema
    const schemaPath = path.join(__dirname, "database-schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")

    console.log("Creating database and tables...")
    await connection.execute(schema)

    console.log("Database setup completed successfully!")

    // Read and execute sample data
    const sampleDataPath = path.join(__dirname, "sample-data.sql")
    const sampleData = fs.readFileSync(sampleDataPath, "utf8")

    console.log("Inserting sample data...")
    await connection.execute(sampleData)

    console.log("Sample data inserted successfully!")

    await connection.end()
    console.log("Database setup and seeding completed!")
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  }
}

setupDatabase()
