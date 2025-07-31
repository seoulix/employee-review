-- Sample Data for Employee Review System
USE employee_review_system;

-- Insert Admin Users
INSERT INTO admin_users (email, password_hash, full_name, role) VALUES
('admin@company.com', '$2b$10$rQZ9QmjlhF8K8K8K8K8K8O', 'System Administrator', 'super_admin'),
('manager@company.com', '$2b$10$rQZ9QmjlhF8K8K8K8K8K8O', 'Store Manager', 'manager'),
('hr@company.com', '$2b$10$rQZ9QmjlhF8K8K8K8K8K8O', 'HR Manager', 'admin');

-- Insert Brands
INSERT INTO brands (name, description, status) VALUES
('Premium Coffee', 'High-end coffee chain with premium quality products', 'Active'),
('Quick Bites', 'Fast food restaurant chain serving quick meals', 'Active'),
('Fresh Market', 'Grocery store chain with fresh produce', 'Active'),
('Tech Store', 'Electronics retail chain', 'Active');

-- Insert States
INSERT INTO states (name, code, status) VALUES
('California', 'CA', 'Active'),
('New York', 'NY', 'Active'),
('Texas', 'TX', 'Active'),
('Florida', 'FL', 'Active');

-- Insert Cities
INSERT INTO cities (name, state_id, status) VALUES
('Los Angeles', 1, 'Active'),
('San Francisco', 1, 'Active'),
('San Diego', 1, 'Active'),
('New York City', 2, 'Active'),
('Buffalo', 2, 'Active'),
('Albany', 2, 'Active'),
('Houston', 3, 'Active'),
('Dallas', 3, 'Active'),
('Austin', 3, 'Active'),
('Miami', 4, 'Active'),
('Orlando', 4, 'Active'),
('Tampa', 4, 'Active');

-- Insert Outlets
INSERT INTO outlets (name, brand_id, city_id, address, manager_name, manager_phone, manager_email, status) VALUES
('Downtown Store', 1, 1, '123 Main St, Downtown Los Angeles, CA 90012', 'John Smith', '+1-555-0101', 'john.smith@company.com', 'Active'),
('Mall Branch', 2, 2, '456 Shopping Mall, San Francisco, CA 94102', 'Sarah Johnson', '+1-555-0102', 'sarah.johnson@company.com', 'Active'),
('Airport Terminal', 1, 4, 'Terminal 1, JFK Airport, New York, NY 10001', 'Mike Wilson', '+1-555-0103', 'mike.wilson@company.com', 'Active'),
('City Center', 3, 7, '789 City Center Plaza, Houston, TX 77002', 'Emily Davis', '+1-555-0104', 'emily.davis@company.com', 'Active'),
('Beach Location', 1, 3, '321 Beach Blvd, San Diego, CA 92101', 'Lisa Chen', '+1-555-0105', 'lisa.chen@company.com', 'Active'),
('Times Square', 2, 4, '555 Times Square, New York, NY 10036', 'David Brown', '+1-555-0106', 'david.brown@company.com', 'Active');

-- Insert Employees
INSERT INTO employees (employee_code, full_name, email, phone, outlet_id, position, join_date, status) VALUES
('EMP001', 'John Doe', 'john.doe@company.com', '+1-555-1001', 1, 'Sales Associate', '2024-01-15', 'Active'),
('EMP002', 'Sarah Johnson', 'sarah.johnson@company.com', '+1-555-1002', 2, 'Store Manager', '2023-11-20', 'Active'),
('EMP003', 'Mike Wilson', 'mike.wilson@company.com', '+1-555-1003', 3, 'Cashier', '2024-02-01', 'Active'),
('EMP004', 'Emily Davis', 'emily.davis@company.com', '+1-555-1004', 4, 'Assistant Manager', '2023-08-10', 'Active'),
('EMP005', 'Lisa Chen', 'lisa.chen@company.com', '+1-555-1005', 1, 'Barista', '2024-03-01', 'Active'),
('EMP006', 'David Brown', 'david.brown@company.com', '+1-555-1006', 2, 'Supervisor', '2023-12-15', 'Active'),
('EMP007', 'Anna Martinez', 'anna.martinez@company.com', '+1-555-1007', 3, 'Sales Associate', '2024-01-20', 'Active'),
('EMP008', 'James Taylor', 'james.taylor@company.com', '+1-555-1008', 4, 'Cashier', '2023-10-05', 'Active'),
('EMP009', 'Maria Garcia', 'maria.garcia@company.com', '+1-555-1009', 5, 'Store Manager', '2023-09-12', 'Active'),
('EMP010', 'Robert Lee', 'robert.lee@company.com', '+1-555-1010', 6, 'Assistant Manager', '2024-02-14', 'Active');

-- Insert Feedback Links
INSERT INTO feedback_links (outlet_id, token, url, status, total_submissions) VALUES
(1, 'abc123def456ghi789', 'https://feedback.company.com/outlet/abc123def456ghi789', 'Active', 156),
(2, 'xyz789ghi012jkl345', 'https://feedback.company.com/outlet/xyz789ghi012jkl345', 'Active', 203),
(3, 'mno345pqr678stu901', 'https://feedback.company.com/outlet/mno345pqr678stu901', 'Active', 89),
(4, 'def456ghi789jkl012', 'https://feedback.company.com/outlet/def456ghi789jkl012', 'Active', 134),
(5, 'ghi789jkl012mno345', 'https://feedback.company.com/outlet/ghi789jkl012mno345', 'Active', 76),
(6, 'jkl012mno345pqr678', 'https://feedback.company.com/outlet/jkl012mno345pqr678', 'Active', 98);

-- Insert Sample Feedback Submissions
INSERT INTO feedback_submissions (feedback_link_id, employee_id, customer_name, customer_phone, customer_email, rating, feedback_text, status, submission_time) VALUES
(1, 1, 'Alice Johnson', '+1-555-2001', 'alice@email.com', 5, 'Excellent service! John was very helpful and friendly.', 'Perfect', '2024-01-20 14:30:00'),
(1, 1, 'Bob Smith', '+1-555-2002', 'bob@email.com', 4, 'Good service, quick and efficient.', 'Perfect', '2024-01-19 16:45:00'),
(1, 5, 'Carol Davis', '+1-555-2003', 'carol@email.com', 5, 'Amazing coffee and great atmosphere!', 'Perfect', '2024-01-18 09:15:00'),
(2, 2, 'David Wilson', '+1-555-2004', 'david@email.com', 2, 'Service was slow and staff seemed uninterested.', 'Counselling', '2024-01-17 11:20:00'),
(2, 6, 'Eva Brown', '+1-555-2005', 'eva@email.com', 5, 'Sarah provided exceptional customer service!', 'Perfect', '2024-01-16 13:45:00'),
(3, 3, 'Frank Miller', '+1-555-2006', 'frank@email.com', 3, 'Average experience, nothing special.', 'Needs Review', '2024-01-15 15:30:00'),
(3, 7, 'Grace Taylor', '+1-555-2007', 'grace@email.com', 4, 'Good service at the airport location.', 'Perfect', '2024-01-14 08:20:00'),
(4, 4, 'Henry Garcia', '+1-555-2008', 'henry@email.com', 5, 'Emily was very knowledgeable about products.', 'Perfect', '2024-01-13 12:10:00'),
(4, 8, 'Iris Martinez', '+1-555-2009', 'iris@email.com', 4, 'Great selection and helpful staff.', 'Perfect', '2024-01-12 14:55:00'),
(5, 9, 'Jack Anderson', '+1-555-2010', 'jack@email.com', 5, 'Maria runs an excellent store!', 'Perfect', '2024-01-11 10:30:00'),
(6, 10, 'Kate Thompson', '+1-555-2011', 'kate@email.com', 3, 'Service could be improved during busy hours.', 'Needs Review', '2024-01-10 17:40:00'),
(1, 1, 'Liam White', '+1-555-2012', 'liam@email.com', 5, 'Outstanding customer service from John!', 'Perfect', '2024-01-09 11:15:00'),
(2, 2, 'Mia Johnson', '+1-555-2013', 'mia@email.com', 4, 'Good food quality and clean environment.', 'Perfect', '2024-01-08 13:25:00'),
(3, 3, 'Noah Davis', '+1-555-2014', 'noah@email.com', 2, 'Long wait times and poor communication.', 'Counselling', '2024-01-07 16:50:00'),
(4, 4, 'Olivia Wilson', '+1-555-2015', 'olivia@email.com', 5, 'Excellent shopping experience!', 'Perfect', '2024-01-06 09:35:00');

-- Insert Winner Selections
INSERT INTO winner_selections (employee_id, selection_month, selected_by, prize_details, notes) VALUES
(2, '2024-01', 1, 'Gift voucher worth $500 and certificate of excellence', 'Outstanding performance with highest customer satisfaction'),
(1, '2023-12', 1, 'Gift voucher worth $300 and recognition award', 'Consistent excellent service throughout December'),
(9, '2023-11', 1, 'Gift voucher worth $400 and team dinner', 'Exceptional leadership and customer service');

-- Update feedback link submission counts based on actual submissions
UPDATE feedback_links fl 
SET total_submissions = (
    SELECT COUNT(*) 
    FROM feedback_submissions fs 
    WHERE fs.feedback_link_id = fl.id
);

-- Update last_used timestamp for feedback links
UPDATE feedback_links fl 
SET last_used = (
    SELECT MAX(fs.submission_time) 
    FROM feedback_submissions fs 
    WHERE fs.feedback_link_id = fl.id
);
