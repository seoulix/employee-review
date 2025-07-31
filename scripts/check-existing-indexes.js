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

async function checkExistingIndexes() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('🔍 Checking existing indexes on feedback_submissions table...');
    
    // Check if the index already exists
    const [indexes] = await connection.execute(`
      SELECT 
        INDEX_NAME,
        COLUMN_NAME,
        NON_UNIQUE,
        SEQ_IN_INDEX
      FROM information_schema.statistics 
      WHERE table_schema = ? 
        AND table_name = 'feedback_submissions'
        AND index_name = 'idx_feedback_submissions_feedback_unique_id'
    `, [dbConfig.database]);
    
    if (indexes.length > 0) {
      console.log('✅ Index already exists!');
      console.log('Index details:', indexes);
    } else {
      console.log('❌ Index does not exist');
      console.log('You can safely add it with:');
      console.log(`
ALTER TABLE feedback_submissions 
ADD INDEX idx_feedback_submissions_feedback_unique_id (feedback_unique_id);
      `);
    }
    
    // Check all indexes on the table
    console.log('\n📋 All indexes on feedback_submissions table:');
    const [allIndexes] = await connection.execute(`
      SELECT 
        INDEX_NAME,
        COLUMN_NAME,
        NON_UNIQUE,
        SEQ_IN_INDEX
      FROM information_schema.statistics 
      WHERE table_schema = ? 
        AND table_name = 'feedback_submissions'
      ORDER BY INDEX_NAME, SEQ_IN_INDEX
    `, [dbConfig.database]);
    
    allIndexes.forEach(index => {
      console.log(`- ${index.INDEX_NAME} (${index.COLUMN_NAME})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking indexes:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the check
if (require.main === module) {
  checkExistingIndexes()
    .then(() => {
      console.log('\n✅ Index check completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Index check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkExistingIndexes }; 