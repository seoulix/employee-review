-- Create notification settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id INT PRIMARY KEY DEFAULT 1,
  email_notifications_enabled BOOLEAN DEFAULT TRUE,
  whatsapp_notifications_enabled BOOLEAN DEFAULT TRUE,
  high_rating_threshold INT DEFAULT 4,
  low_rating_threshold INT DEFAULT 2,
  admin_emails TEXT,
  admin_phones TEXT,
  email_template_subject VARCHAR(500) DEFAULT '🌟 Review Alert - {{employee_name}} ({{rating}}/5)',
  email_template_body TEXT DEFAULT 'New review received!\n\nEmployee: {{employee_name}}\nCustomer: {{customer_name}}\nRating: {{rating}}/5\nOutlet: {{outlet_name}} ({{brand_name}})\nFeedback: {{feedback}}\nTime: {{submission_time}}',
  whatsapp_template_name VARCHAR(100) DEFAULT 'review_alert',
  doubletick_api_key VARCHAR(200),
  sender_phone VARCHAR(20),
  notification_frequency ENUM('immediate', 'hourly', 'daily') DEFAULT 'immediate',
  business_hours_only BOOLEAN DEFAULT FALSE,
  weekend_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create system settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id INT PRIMARY KEY DEFAULT 1,
  system_name VARCHAR(100) DEFAULT 'Employee Review System',
  company_name VARCHAR(100) DEFAULT 'Your Company',
  support_email VARCHAR(100),
  support_phone VARCHAR(20),
  app_url VARCHAR(200),
  timezone VARCHAR(50) DEFAULT 'UTC',
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  currency VARCHAR(10) DEFAULT 'USD',
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create notification logs table
CREATE TABLE IF NOT EXISTS notification_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feedback_id VARCHAR(100),
  notification_type ENUM('high_rating_alert', 'low_rating_alert', 'test') NOT NULL,
  recipient_data JSON,
  status ENUM('sent',

 'low_rating_alert', 'test') NOT NULL,
  recipient_data JSON,
  status ENUM('sent', 'failed', 'pending') DEFAULT 'pending',
  notification_data JSON,
  error_message TEXT,
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default notification settings
INSERT IGNORE INTO notification_settings (id) VALUES (1);

-- Insert default system settings
INSERT IGNORE INTO system_settings (id) VALUES (1);

-- Add phone column to admin_users table if it doesn't exist
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) AFTER email;

-- Update admin users table to include notification preferences
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE AFTER phone,
ADD COLUMN IF NOT EXISTS whatsapp_notifications BOOLEAN DEFAULT TRUE AFTER email_notifications;
