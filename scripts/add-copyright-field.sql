-- Add copyright field to system_settings table
ALTER TABLE system_settings ADD COLUMN copyright VARCHAR(255) DEFAULT '© 2024 Employee Review System. All rights reserved.' AFTER language;

-- Update existing record with default copyright
UPDATE system_settings SET copyright = '© 2024 Employee Review System. All rights reserved.' WHERE id = 1; 