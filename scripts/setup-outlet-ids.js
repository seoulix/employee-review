const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "employee_review_system",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
};

async function addOutletIdsColumn() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Adding outlet_ids column to feedback_questions table...');
    
    // Add the outlet_ids column
    await connection.execute(`
      ALTER TABLE feedback_questions 
      ADD COLUMN outlet_ids longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(outlet_ids)) AFTER is_active
    `);
    
    console.log('Updating existing questions with empty outlet_ids array...');
    
    // Update existing questions to have empty outlet_ids array
    await connection.execute(`
      UPDATE feedback_questions SET outlet_ids = '[]' WHERE outlet_ids IS NULL
    `);
    
    console.log('✅ Successfully added outlet_ids column to feedback_questions table');
    console.log('✅ Updated existing questions with empty outlet_ids array');
    
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  outlet_ids column already exists, skipping...');
    } else {
      console.error('❌ Error adding outlet_ids column:', error);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
addOutletIdsColumn().catch(console.error); 