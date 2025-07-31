const mysql = require('mysql2/promise');

async function setupFeedbackSystem() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_review_system'
  });

  try {
    console.log('Setting up Feedback System...');

    // 1. Create feedback_questions table
    console.log('Creating feedback_questions table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS feedback_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question VARCHAR(500) NOT NULL,
        type ENUM('smiley', 'star', 'slider', 'text', 'checkbox') NOT NULL,
        required BOOLEAN DEFAULT FALSE,
        options JSON,
        min_value INT,
        max_value INT,
        placeholder VARCHAR(200),
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 2. Create feedback_settings table
    console.log('Creating feedback_settings table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS feedback_settings (
        id INT PRIMARY KEY DEFAULT 1,
        lucky_draw_enabled BOOLEAN DEFAULT TRUE,
        feedback_required BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 3. Create feedback_responses table
    console.log('Creating feedback_responses table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS feedback_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        feedback_submission_id INT NOT NULL,
        question_id INT NOT NULL,
        response_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (feedback_submission_id) REFERENCES feedback_submissions(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES feedback_questions(id) ON DELETE CASCADE
      )
    `);

    // 4. Insert default feedback settings
    console.log('Inserting default feedback settings...');
    await connection.execute(`
      INSERT IGNORE INTO feedback_settings (id, lucky_draw_enabled, feedback_required) 
      VALUES (1, TRUE, FALSE)
    `);

    // 5. Check if questions exist and insert defaults if not
    const [questionCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM feedback_questions
    `);

    if (questionCount[0].count === 0) {
      console.log('Inserting default feedback questions...');
      await connection.execute(`
        INSERT INTO feedback_questions (question, type, required, order_index, is_active, min_value, max_value) VALUES
        ('How would you rate your overall experience?', 'smiley', TRUE, 1, TRUE, 1, 5),
        ('Rate the service quality', 'star', TRUE, 2, TRUE, 1, 5),
        ('How likely are you to recommend us?', 'slider', FALSE, 3, TRUE, 1, 10),
        ('Any additional comments?', 'text', FALSE, 4, TRUE, NULL, NULL),
        ('What aspects of our service could be improved?', 'checkbox', FALSE, 5, TRUE, NULL, NULL)
      `);

      // Update checkbox question with options
      await connection.execute(`
        UPDATE feedback_questions 
        SET options = '["Customer Service", "Food Quality", "Cleanliness", "Speed of Service", "Value for Money"]'
        WHERE question = 'What aspects of our service could be improved?'
      `);
    }

    // 6. Create indexes for better performance
    console.log('Creating indexes...');
    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_feedback_questions_active 
      ON feedback_questions(is_active, order_index)
    `);

    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_feedback_responses_submission 
      ON feedback_responses(feedback_submission_id)
    `);

    // 7. Show final status
    const [finalQuestionCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM feedback_questions
    `);

    const [activeQuestionCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM feedback_questions WHERE is_active = TRUE
    `);

    console.log('\n✅ Feedback System Setup Complete!');
    console.log(`📊 Total Questions: ${finalQuestionCount[0].count}`);
    console.log(`✅ Active Questions: ${activeQuestionCount[0].count}`);

    // Show all questions
    const [allQuestions] = await connection.execute(`
      SELECT * FROM feedback_questions ORDER BY order_index
    `);

    console.log('\n📝 Current Questions:');
    allQuestions.forEach((q, index) => {
      console.log(`${index + 1}. ${q.question}`);
      console.log(`   Type: ${q.type}, Required: ${q.required}, Active: ${q.is_active}`);
      if (q.min_value && q.max_value) {
        console.log(`   Range: ${q.min_value}-${q.max_value}`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error setting up feedback system:', error);
  } finally {
    await connection.end();
  }
}

setupFeedbackSystem(); 