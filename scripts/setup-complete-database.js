const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function setupCompleteDatabase() {
  try {
    // Initial connection (without DB)
    const baseConfig = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      multipleStatements: true,
    };

    console.log("🔌 Connecting to MySQL server...");
    const connection = await mysql.createConnection(baseConfig);

    // Create DB manually (before using it)
    console.log("📁 Creating database if not exists...");
    await connection.query(`CREATE DATABASE IF NOT EXISTS employee_review_system`);

    // Close initial connection
    await connection.end();

    // Reconnect with the target DB selected
    const dbConfig = {
      ...baseConfig,
      database: "employee_review_system",
    };

    console.log("🔁 Connecting to employee_review_system database...");
    const dbConnection = await mysql.createConnection(dbConfig);

    // Remove `USE` from schema file before executing
    const schemaPath = path.join(__dirname, "database-schema.sql");
    let schema = fs.readFileSync(schemaPath, "utf8");

    // Remove any `USE` statement
    schema = schema.replace(/USE\s+\w+;/gi, "");

    console.log("🏗️  Creating main tables...");
    await dbConnection.query(schema);

    const notificationSchemaPath = path.join(__dirname, "notification-schema.sql");
    let notificationSchema = fs.readFileSync(notificationSchemaPath, "utf8");
    notificationSchema = notificationSchema.replace(/USE\s+\w+;/gi, "");

    console.log("🔔 Creating notification tables...");
    await dbConnection.query(notificationSchema);

    const sampleDataPath = path.join(__dirname, "sample-data.sql");
    let sampleData = fs.readFileSync(sampleDataPath, "utf8");
    sampleData = sampleData.replace(/USE\s+\w+;/gi, "");

    console.log("📥 Inserting sample data...");
    await dbConnection.query(sampleData);

    console.log("✅ Complete database setup finished successfully!");
    console.log("📊 Database includes:");
    console.log("   - Main tables (brands, outlets, employees, feedback)");
    console.log("   - Notification system");
    console.log("   - WhatsApp templates");
    console.log("   - Sample data for testing");
    console.log("   - Performance views and indexes");

    await dbConnection.end();
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
}

setupCompleteDatabase();
