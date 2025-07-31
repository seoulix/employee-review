const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "employee_review_system",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
};

async function setupCustomerTable() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Creating customers table...');
    
    // Create customers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        unique_id VARCHAR(255) UNIQUE NOT NULL,
        feedback_unique_id VARCHAR(255) UNIQUE,
        
        -- Basic Customer Information
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        gender ENUM('Male', 'Female', 'Other'),
        dob DATE,
        anniversary_date DATE,
        
        -- Booking Information
        location VARCHAR(255),
        place VARCHAR(255),
        booking_date DATE,
        time_stamp TIMESTAMP NULL,
        booking_type VARCHAR(100),
        group_type VARCHAR(100),
        game VARCHAR(100),
        slot VARCHAR(100),
        upcoming BOOLEAN DEFAULT FALSE,
        event_date_time TIMESTAMP NULL,
        form_number VARCHAR(100),
        
        -- Team Information
        team_id VARCHAR(100),
        team_name VARCHAR(255),
        
        -- Additional Information
        signature TEXT,
        id_proof TEXT,
        
        -- System Fields
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Indexes for better performance
        INDEX idx_unique_id (unique_id),
        INDEX idx_feedback_unique_id (feedback_unique_id),
        INDEX idx_phone (phone),
        INDEX idx_email (email),
        INDEX idx_booking_date (booking_date),
        INDEX idx_team_id (team_id)
      )
    `);
    
    console.log('Checking if feedback_links table exists...');
    const [feedbackLinksExists] = await connection.execute(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'feedback_links'
    `, [dbConfig.database]);
    
    if (feedbackLinksExists[0].count > 0) {
      console.log('Updating feedback_links table...');
      
      // Check if unique_id column already exists
      const [uniqueIdExists] = await connection.execute(`
        SELECT COUNT(*) as count FROM information_schema.columns 
        WHERE table_schema = ? AND table_name = 'feedback_links' AND column_name = 'unique_id'
      `, [dbConfig.database]);
      
      if (uniqueIdExists[0].count === 0) {
        await connection.execute(`
          ALTER TABLE feedback_links 
          ADD COLUMN unique_id VARCHAR(255) AFTER outlet_id,
          ADD INDEX idx_feedback_links_unique_id (unique_id)
        `);
        console.log('Added unique_id column to feedback_links table');
      } else {
        console.log('unique_id column already exists in feedback_links table');
      }
    } else {
      console.log('feedback_links table does not exist yet');
    }
    
    console.log('Checking if feedback_submissions table exists...');
    const [feedbackSubmissionsExists] = await connection.execute(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'feedback_submissions'
    `, [dbConfig.database]);
    
    if (feedbackSubmissionsExists[0].count > 0) {
      console.log('Updating feedback_submissions table...');
      
      // Check if feedback_unique_id column already exists
      const [feedbackUniqueIdExists] = await connection.execute(`
        SELECT COUNT(*) as count FROM information_schema.columns 
        WHERE table_schema = ? AND table_name = 'feedback_submissions' AND column_name = 'feedback_unique_id'
      `, [dbConfig.database]);
      
      if (feedbackUniqueIdExists[0].count === 0) {
        await connection.execute(`
          ALTER TABLE feedback_submissions 
          ADD COLUMN feedback_unique_id VARCHAR(255) AFTER feedback_link_id,
          ADD INDEX idx_feedback_submissions_feedback_unique_id (feedback_unique_id)
        `);
        console.log('Added feedback_unique_id column to feedback_submissions table');
      } else {
        console.log('feedback_unique_id column already exists in feedback_submissions table');
      }
    } else {
      console.log('feedback_submissions table does not exist yet');
    }
    
    console.log('✅ Customer table setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up customer table:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
if (require.main === module) {
  setupCustomerTable()
    .then(() => {
      console.log('Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupCustomerTable }; 