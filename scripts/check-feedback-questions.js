const mysql = require('mysql2/promise');

async function checkAndInsertFeedbackQuestions() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_review_system'
  });

  try {
    console.log('Checking feedback questions...');

    // Check if feedback_questions table exists
    const [tables] = await connection.execute(`
      SHOW TABLES LIKE 'feedback_questions'
    `);

    if (tables.length === 0) {
      console.log('Creating feedback_questions table...');
      await connection.execute(`
        CREATE TABLE feedback_questions (
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
    }

    // Check if feedback_settings table exists
    const [settingsTables] = await connection.execute(`
      SHOW TABLES LIKE 'feedback_settings'
    `);

    if (settingsTables.length === 0) {
      console.log('Creating feedback_settings table...');
      await connection.execute(`
        CREATE TABLE feedback_settings (
          id INT PRIMARY KEY DEFAULT 1,
          lucky_draw_enabled BOOLEAN DEFAULT TRUE,
          feedback_required BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
    }

    // Check if feedback_responses table exists
    const [responsesTables] = await connection.execute(`
      SHOW TABLES LIKE 'feedback_responses'
    `);

    if (responsesTables.length === 0) {
      console.log('Creating feedback_responses table...');
      await connection.execute(`
        CREATE TABLE feedback_responses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          feedback_submission_id INT NOT NULL,
          question_id INT NOT NULL,
          response_value TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (feedback_submission_id) REFERENCES feedback_submissions(id) ON DELETE CASCADE,
          FOREIGN KEY (question_id) REFERENCES feedback_questions(id) ON DELETE CASCADE
        )
      `);
    }

    // Check if there are any questions
    const [questions] = await connection.execute(`
      SELECT COUNT(*) as count FROM feedback_questions
    `);

    if (questions[0].count === 0) {
      console.log('Inserting default feedback questions...');
      await connection.execute(`
        INSERT INTO feedback_questions (question, type, required, order_index, is_active) VALUES
        ('How would you rate your overall experience?', 'smiley', TRUE, 1, TRUE),
        ('Rate the service quality', 'star', TRUE, 2, TRUE),
        ('How likely are you to recommend us?', 'slider', FALSE, 3, TRUE),
        ('Any additional comments?', 'text', FALSE, 4, TRUE)
      `);
    }

    // Insert default settings if not exists
    await connection.execute(`
      INSERT IGNORE INTO feedback_settings (id) VALUES (1)
    `);

    // Check final count
    const [finalCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM feedback_questions
    `);

    console.log(`Feedback questions setup complete. Found ${finalCount[0].count} questions.`);

    // Show all questions
    const [allQuestions] = await connection.execute(`
      SELECT * FROM feedback_questions ORDER BY order_index
    `);

    console.log('Current questions:');
    allQuestions.forEach(q => {
      console.log(`- ${q.question} (${q.type}, required: ${q.required}, active: ${q.is_active})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkAndInsertFeedbackQuestions(); 