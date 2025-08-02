const mysql = require('mysql2/promise');

async function updateOutletsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'employee_review_system'
  });

  try {
    console.log('🔄 Starting outlet table updates...');

    // Add new fields to outlets table
    const alterQueries = [
      "ALTER TABLE outlets ADD COLUMN outlet_image VARCHAR(255) NOT NULL DEFAULT ''",
      "ALTER TABLE outlets ADD COLUMN gps_latitude DECIMAL(10, 8) NULL",
      "ALTER TABLE outlets ADD COLUMN gps_longitude DECIMAL(11, 8) NULL",
      "ALTER TABLE outlets ADD COLUMN phone_number VARCHAR(20) NULL",
      "ALTER TABLE outlets ADD COLUMN email_id VARCHAR(255) NULL",
      "ALTER TABLE outlets ADD COLUMN google_review_link VARCHAR(500) NULL",
      "ALTER TABLE outlets ADD COLUMN custom_feedback_form TEXT NULL",
      "ALTER TABLE outlets ADD COLUMN review_link_config TEXT NULL"
    ];

    for (const query of alterQueries) {
      try {
        await connection.execute(query);
        console.log(`✅ Executed: ${query}`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`⚠️  Field already exists: ${query}`);
        } else {
          console.error(`❌ Error executing: ${query}`, error.message);
        }
      }
    }

    // Add indexes for better performance
    const indexQueries = [
      "ALTER TABLE outlets ADD INDEX idx_outlets_gps (gps_latitude, gps_longitude)",
      "ALTER TABLE outlets ADD INDEX idx_outlets_rating (rating)",
      "ALTER TABLE outlets ADD INDEX idx_outlets_reviews (total_reviews)"
    ];

    for (const query of indexQueries) {
      try {
        await connection.execute(query);
        console.log(`✅ Executed: ${query}`);
      } catch (error) {
        if (error.code === 'ER_DUP_KEYNAME') {
          console.log(`⚠️  Index already exists: ${query}`);
        } else {
          console.error(`❌ Error executing: ${query}`, error.message);
        }
      }
    }

    // Update existing outlets with default values
    const updateQuery = `
      UPDATE outlets SET 
        outlet_image = '/uploads/outlets/default.png',
        phone_number = '+1234567890',
        email_id = CONCAT('outlet', id, '@company.com')
      WHERE outlet_image = '' OR phone_number IS NULL OR email_id IS NULL
    `;

    try {
      const [result] = await connection.execute(updateQuery);
      console.log(`✅ Updated ${result.affectedRows} outlets with default values`);
    } catch (error) {
      console.error(`❌ Error updating outlets:`, error.message);
    }

    console.log('🎉 Outlet table updates completed successfully!');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    await connection.end();
  }
}

// Run the updates
updateOutletsTable(); 