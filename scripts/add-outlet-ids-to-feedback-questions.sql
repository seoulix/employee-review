-- Add outlet_ids column to feedback_questions table
ALTER TABLE `feedback_questions` 
ADD COLUMN `outlet_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`outlet_ids`)) AFTER `is_active`;

-- Update existing questions to have empty outlet_ids array
UPDATE `feedback_questions` SET `outlet_ids` = '[]' WHERE `outlet_ids` IS NULL; 