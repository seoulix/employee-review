-- Add new fields to outlets table
ALTER TABLE outlets ADD COLUMN outlet_image VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE outlets ADD COLUMN gps_latitude DECIMAL(10, 8) NULL;
ALTER TABLE outlets ADD COLUMN gps_longitude DECIMAL(11, 8) NULL;
ALTER TABLE outlets ADD COLUMN phone_number VARCHAR(20) NULL;
ALTER TABLE outlets ADD COLUMN email_id VARCHAR(255) NULL;
ALTER TABLE outlets ADD COLUMN google_review_link VARCHAR(500) NULL;
ALTER TABLE outlets ADD COLUMN custom_feedback_form TEXT NULL;
ALTER TABLE outlets ADD COLUMN review_link_config TEXT NULL;

-- Add indexes for better performance
ALTER TABLE outlets ADD INDEX idx_outlets_gps (gps_latitude, gps_longitude);
ALTER TABLE outlets ADD INDEX idx_outlets_rating (rating);
ALTER TABLE outlets ADD INDEX idx_outlets_reviews (total_reviews);

-- Update existing outlets with default values if needed
UPDATE outlets SET 
  outlet_image = '/uploads/outlets/default.png',
  phone_number = '+1234567890',
  email_id = CONCAT('outlet', id, '@company.com')
WHERE outlet_image = '' OR phone_number IS NULL OR email_id IS NULL; 