-- Feedback Questions Table
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
);

-- Feedback Settings Table
CREATE TABLE IF NOT EXISTS feedback_settings (
  id INT PRIMARY KEY DEFAULT 1,
  lucky_draw_enabled BOOLEAN DEFAULT TRUE,
  feedback_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Theme Settings Table
CREATE TABLE IF NOT EXISTS theme_settings (
  id INT PRIMARY KEY DEFAULT 1,
  app_name VARCHAR(100) DEFAULT 'Employee Review System',
  logo_url VARCHAR(500),
  favicon_url VARCHAR(500),
  primary_color VARCHAR(7) DEFAULT '#3b82f6',
  secondary_color VARCHAR(7) DEFAULT '#1e40af',
  accent_color VARCHAR(7) DEFAULT '#60a5fa',
  background_color VARCHAR(7) DEFAULT '#ffffff',
  text_color VARCHAR(7) DEFAULT '#1f2937',
  sidebar_color VARCHAR(7) DEFAULT '#f8fafc',
  header_color VARCHAR(7) DEFAULT '#ffffff',
  custom_css TEXT,
  dark_mode_enabled BOOLEAN DEFAULT TRUE,
  default_theme ENUM('light', 'dark', 'system') DEFAULT 'system',
  font_family VARCHAR(100) DEFAULT 'Inter, sans-serif',
  font_size VARCHAR(10) DEFAULT '14px',
  border_radius VARCHAR(10) DEFAULT '6px',
  shadow_intensity ENUM('none', 'light', 'medium', 'heavy') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Enhanced Admin Users Table
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS permissions JSON AFTER role,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL AFTER is_active,
ADD COLUMN IF NOT EXISTS login_attempts INT DEFAULT 0 AFTER last_login,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP NULL AFTER login_attempts;

-- Real-time Notifications Table
CREATE TABLE IF NOT EXISTS real_time_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  type ENUM('review', 'feedback', 'alert', 'system') NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  data JSON,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- Feedback Responses Table (for custom questions)
CREATE TABLE IF NOT EXISTS feedback_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feedback_submission_id INT NOT NULL,
  question_id INT NOT NULL,
  response_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (feedback_submission_id) REFERENCES feedback_submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES feedback_questions(id) ON DELETE CASCADE
);

-- Insert default feedback settings
INSERT IGNORE INTO feedback_settings (id) VALUES (1);

-- Insert default theme settings
INSERT IGNORE INTO theme_settings (id) VALUES (1);

-- Insert default feedback questions
INSERT IGNORE INTO feedback_questions (question, type, required, order_index) VALUES
('How would you rate your overall experience?', 'smiley', TRUE, 1),
('Rate the service quality', 'star', TRUE, 2),
('How likely are you to recommend us?', 'slider', FALSE, 3),
('Any additional comments?', 'text', FALSE, 4);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_questions_active ON feedback_questions(is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_feedback_responses_submission ON feedback_responses(feedback_submission_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON real_time_notifications(user_id, read_at);
