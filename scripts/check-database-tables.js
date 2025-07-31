const mysql = require('mysql2/promise');

async function checkDatabaseTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_review_system'
  });

  try {
    console.log('🔍 Checking Feedback System Tables...\n');

    // List of tables to check
    const tablesToCheck = [
      'feedback_questions',
      'feedback_settings', 
      'feedback_responses',
      'feedback_links',
      'feedback_submissions'
    ];

    for (const tableName of tablesToCheck) {
      try {
        const [tables] = await connection.execute(`
          SHOW TABLES LIKE '${tableName}'
        `);

        if (tables.length > 0) {
          console.log(`✅ ${tableName} - EXISTS`);
          
          // Check record count
          const [count] = await connection.execute(`
            SELECT COUNT(*) as count FROM ${tableName}
          `);
          console.log(`   📊 Records: ${count[0].count}`);
          
          // Show table structure
          const [columns] = await connection.execute(`
            DESCRIBE ${tableName}
          `);
          console.log(`   📋 Columns: ${columns.map(col => col.Field).join(', ')}`);
          
        } else {
          console.log(`❌ ${tableName} - MISSING`);
        }
      } catch (error) {
        console.log(`❌ ${tableName} - ERROR: ${error.message}`);
      }
      console.log('');
    }

    // Check if there are any feedback questions
    try {
      const [questions] = await connection.execute(`
        SELECT COUNT(*) as count FROM feedback_questions
      `);
      
      if (questions[0].count > 0) {
        console.log('📝 Current Feedback Questions:');
        const [allQuestions] = await connection.execute(`
          SELECT question, type, required, is_active FROM feedback_questions ORDER BY order_index
        `);
        
        allQuestions.forEach((q, index) => {
          console.log(`${index + 1}. ${q.question}`);
          console.log(`   Type: ${q.type}, Required: ${q.required}, Active: ${q.is_active}`);
        });
      } else {
        console.log('📝 No feedback questions found in database');
      }
    } catch (error) {
      console.log('📝 Could not check feedback questions (table might not exist)');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await connection.end();
  }
}

checkDatabaseTables(); 