-- Additional tables for notification system
USE employee_review_system;

-- Notification logs table
CREATE TABLE IF NOT EXISTS notification_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    feedback_id INT,
    notification_type ENUM('high_rating_alert', 'low_rating_alert', 'monthly_report') NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    status ENUM('sent', 'failed', 'pending') DEFAULT 'pending',
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin notification preferences
CREATE TABLE IF NOT EXISTS admin_notification_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    whatsapp_notifications BOOLEAN DEFAULT TRUE,
    high_rating_alerts BOOLEAN DEFAULT TRUE,
    low_rating_alerts BOOLEAN DEFAULT TRUE,
    daily_reports BOOLEAN DEFAULT FALSE,
    weekly_reports BOOLEAN DEFAULT TRUE,
    monthly_reports BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- WhatsApp templates table
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    template_name VARCHAR(255) UNIQUE NOT NULL,
    template_type ENUM('high_rating', 'low_rating', 'monthly_report', 'winner_announcement') NOT NULL,
    language_code VARCHAR(10) DEFAULT 'en',
    header_text TEXT,
    body_text TEXT NOT NULL,
    footer_text TEXT,
    button_text VARCHAR(255),
    button_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default WhatsApp templates
INSERT INTO whatsapp_templates (template_name, template_type, header_text, body_text, footer_text) VALUES
('excellent_review_alert', 'high_rating', 
 '🌟 Excellent Review Alert!', 
 'Great news! {{1}} received an excellent {{3}}/5 star review from {{2}} at {{4}} ({{5}}).\n\nCustomer feedback: "{{6}}"\n\nSubmitted: {{7}}',
 'Employee Review System'),
('low_rating_alert', 'low_rating',
 '⚠️ Low Rating Alert',
 'Attention needed! {{1}} received a {{3}}/5 star review from {{2}} at {{4}} ({{5}}).\n\nCustomer feedback: "{{6}}"\n\nSubmitted: {{7}}\n\nPlease review and take appropriate action.',
 'Employee Review System'),
('monthly_winner', 'winner_announcement',
 '🏆 Monthly Winner Announcement',
 'Congratulations! {{1}} from {{2}} has been selected as this month\'s winner with an average rating of {{3}}/5 from {{4}} reviews!\n\nKeep up the excellent work!',
 'Employee Review System');

-- Update admin_users table to include phone numbers
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20);

-- Update with sample admin phone numbers
UPDATE admin_users SET 
    phone = '+919876543210',
    whatsapp_number = '+919876543210'
WHERE email = 'admin@company.com';

UPDATE admin_users SET 
    phone = '+919876543211',
    whatsapp_number = '+919876543211'
WHERE email = 'manager@company.com';

-- Insert default notification preferences for existing admins
INSERT INTO admin_notification_preferences (admin_id, email_notifications, whatsapp_notifications, high_rating_alerts, low_rating_alerts)
SELECT id, TRUE, TRUE, TRUE, TRUE FROM admin_users
ON DUPLICATE KEY UPDATE admin_id = admin_id;
