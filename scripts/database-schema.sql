-- Employee Review System Database Schema
-- MySQL Database Structure

-- Create database
CREATE DATABASE IF NOT EXISTS employee_review_system;
USE employee_review_system;

SET FOREIGN_KEY_CHECKS = 0;

-- Drop views first
DROP VIEW IF EXISTS outlet_feedback_summary;
DROP VIEW IF EXISTS employee_performance_summary;

-- Then drop tables
DROP TABLE IF EXISTS feedback_submissions;
DROP TABLE IF EXISTS winner_selections;
DROP TABLE IF EXISTS feedback_links;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS outlets;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS admin_users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Admin Users Table
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'manager') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Brands Table
CREATE TABLE brands (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. States Table
CREATE TABLE states (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Cities Table
CREATE TABLE cities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    state_id INT NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);

-- 5. Outlets Table
CREATE TABLE outlets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    brand_id INT NOT NULL,
    city_id INT NOT NULL,
    address TEXT NOT NULL,
    manager_name VARCHAR(255),
    manager_phone VARCHAR(20),
    manager_email VARCHAR(255),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- 6. Employees Table
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    outlet_id INT NOT NULL,
    position VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500),
    join_date DATE NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (outlet_id) REFERENCES outlets(id) ON DELETE CASCADE
);

-- 7. Feedback Links Table
CREATE TABLE feedback_links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    outlet_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    url VARCHAR(500) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    total_submissions INT DEFAULT 0,
    last_used TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (outlet_id) REFERENCES outlets(id) ON DELETE CASCADE
);

-- 8. Feedback Submissions Table
CREATE TABLE feedback_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    feedback_link_id INT NOT NULL,
    employee_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    additional_details TEXT,
    status ENUM('Perfect', 'Counselling', 'Needs Review') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feedback_link_id) REFERENCES feedback_links(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 9. Winner Selections Table
CREATE TABLE winner_selections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    selection_month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    selection_criteria JSON,
    selected_by INT NOT NULL,
    selection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prize_details TEXT,
    is_notified BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (selected_by) REFERENCES admin_users(id),
    UNIQUE KEY unique_month_employee (employee_id, selection_month)
);

-- Create indexes for better performance
CREATE INDEX idx_employees_outlet ON employees(outlet_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_feedback_employee ON feedback_submissions(employee_id);
CREATE INDEX idx_feedback_rating ON feedback_submissions(rating);
CREATE INDEX idx_feedback_status ON feedback_submissions(status);
CREATE INDEX idx_feedback_date ON feedback_submissions(submission_time);
CREATE INDEX idx_outlets_brand ON outlets(brand_id);
CREATE INDEX idx_outlets_city ON outlets(city_id);
CREATE INDEX idx_cities_state ON cities(state_id);
CREATE INDEX idx_feedback_links_outlet ON feedback_links(outlet_id);
CREATE INDEX idx_feedback_links_token ON feedback_links(token);

-- Create views for common queries
CREATE VIEW employee_performance_summary AS
SELECT 
    e.id,
    e.employee_code,
    e.full_name,
    e.position,
    o.name as outlet_name,
    b.name as brand_name,
    c.name as city_name,
    s.name as state_name,
    COUNT(fs.id) as total_reviews,
    AVG(fs.rating) as average_rating,
    SUM(CASE WHEN fs.status = 'Perfect' THEN 1 ELSE 0 END) as perfect_count,
    SUM(CASE WHEN fs.status = 'Counselling' THEN 1 ELSE 0 END) as counselling_count,
    SUM(CASE WHEN fs.status = 'Needs Review' THEN 1 ELSE 0 END) as needs_review_count,
    MAX(fs.submission_time) as last_feedback_date
FROM employees e
LEFT JOIN outlets o ON e.outlet_id = o.id
LEFT JOIN brands b ON o.brand_id = b.id
LEFT JOIN cities c ON o.city_id = c.id
LEFT JOIN states s ON c.state_id = s.id
LEFT JOIN feedback_submissions fs ON e.id = fs.employee_id
WHERE e.status = 'Active'
GROUP BY e.id, e.employee_code, e.full_name, e.position, o.name, b.name, c.name, s.name;

CREATE VIEW outlet_feedback_summary AS
SELECT 
    o.id,
    o.name as outlet_name,
    b.name as brand_name,
    c.name as city_name,
    s.name as state_name,
    COUNT(DISTINCT e.id) as total_employees,
    COUNT(fs.id) as total_feedback,
    AVG(fs.rating) as average_rating,
    fl.token as feedback_token,
    fl.url as feedback_url,
    fl.total_submissions as link_submissions
FROM outlets o
LEFT JOIN brands b ON o.brand_id = b.id
LEFT JOIN cities c ON o.city_id = c.id
LEFT JOIN states s ON c.state_id = s.id
LEFT JOIN employees e ON o.id = e.outlet_id AND e.status = 'Active'
LEFT JOIN feedback_submissions fs ON e.id = fs.employee_id
LEFT JOIN feedback_links fl ON o.id = fl.outlet_id AND fl.status = 'Active'
WHERE o.status = 'Active'
GROUP BY o.id, o.name, b.name, c.name, s.name, fl.token, fl.url, fl.total_submissions;
