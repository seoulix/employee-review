# Customer Table Setup and Usage

## Overview

The customer table is designed to hold comprehensive customer data and establish relationships with the feedback system. It connects to:
- `feedback_links` via `unique_id`
- `feedback_submissions` via `feedback_unique_id`

## Table Structure

### Customers Table
```sql
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    unique_id VARCHAR(255) UNIQUE NOT NULL,
    feedback_unique_id VARCHAR(255) UNIQUE,
    
    -- Basic Customer Information
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    gender ENUM('Male', 'Female', 'Other'),
    dob DATE,
    anniversary_date DATE,
    
    -- Booking Information
    location VARCHAR(255),
    place VARCHAR(255),
    booking_date DATE,
    time_stamp TIMESTAMP NULL,
    booking_type VARCHAR(100),
    group_type VARCHAR(100),
    game VARCHAR(100),
    slot VARCHAR(100),
    upcoming BOOLEAN DEFAULT FALSE,
    event_date_time TIMESTAMP NULL,
    form_number VARCHAR(100),
    
    -- Team Information
    team_id VARCHAR(100),
    team_name VARCHAR(255),
    
    -- Additional Information
    signature TEXT,
    id_proof TEXT,
    
    -- System Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_unique_id (unique_id),
    INDEX idx_feedback_unique_id (feedback_unique_id),
    INDEX idx_phone (phone),
    INDEX idx_email (email),
    INDEX idx_booking_date (booking_date),
    INDEX idx_team_id (team_id)
);
```

## Setup Instructions

### 1. Run the Setup Script
```bash
node scripts/setup-customer-table.js
```

This script will:
- Create the `customers` table if it doesn't exist
- Add `unique_id` column to `feedback_links` table
- Add `feedback_unique_id` column to `feedback_submissions` table
- Create necessary indexes for performance

### 2. Environment Variables
Make sure your `.env` file contains the database configuration:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=employee_review_system
DB_PORT=3306
```

## API Usage

### Create Customer
**POST** `/api/customer`

Request Body:
```json
{
    "Unique_ID": "CUST_001",
    "Location": "Mumbai",
    "Place": "Shopping Mall",
    "Booking_Date": "2024-01-15",
    "Time_Stamp": "2024-01-15T10:30:00Z",
    "Booking_Type": "Regular",
    "Group_Type": "Family",
    "Game": "Bowling",
    "Slot": "Evening",
    "Upcoming": false,
    "Event_Date_Time": "2024-01-15T18:00:00Z",
    "Form_Number": "FORM_001",
    "TeamId": "TEAM_001",
    "Team_name": "Team Alpha",
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "Gender": "Male",
    "dob": "1990-01-01",
    "Anniversary_Date": "2015-06-15",
    "Signature": "base64_signature_data",
    "Id_Proof": "base64_id_proof_data"
}
```

Response:
```json
{
    "success": true,
    "message": "Customer created successfully"
}
```

### Get Customer
**GET** `/api/customer?unique_id=CUST_001`

Response:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "unique_id": "CUST_001",
        "name": "John Doe",
        "phone": "+1234567890",
        "email": "john@example.com",
        // ... other fields
    }
}
```

## Relationships

### With Feedback Links
- `customers.unique_id` ↔ `feedback_links.unique_id`
- This allows linking customers to specific feedback links

### With Feedback Submissions
- `customers.feedback_unique_id` ↔ `feedback_submissions.feedback_unique_id`
- This allows linking customers to their feedback submissions

## TypeScript Interfaces

The customer model includes TypeScript interfaces for type safety:

```typescript
import { Customer, CustomerCreateRequest, CustomerResponse } from '@/lib/models/customer';
```

## Database Queries Examples

### Get Customer with Feedback Data
```sql
SELECT 
    c.*,
    fl.token as feedback_token,
    fl.url as feedback_url,
    COUNT(fs.id) as total_feedback_count
FROM customers c
LEFT JOIN feedback_links fl ON c.unique_id = fl.unique_id
LEFT JOIN feedback_submissions fs ON c.feedback_unique_id = fs.feedback_unique_id
WHERE c.unique_id = ?
GROUP BY c.id;
```

### Get Customers by Booking Date Range
```sql
SELECT * FROM customers 
WHERE booking_date BETWEEN ? AND ?
ORDER BY booking_date DESC;
```

## Indexes for Performance

The table includes the following indexes:
- `idx_unique_id` - For fast lookups by unique_id
- `idx_feedback_unique_id` - For feedback relationship queries
- `idx_phone` - For phone number searches
- `idx_email` - For email searches
- `idx_booking_date` - For date range queries
- `idx_team_id` - For team-based queries

## Error Handling

The API includes comprehensive error handling:
- Validation of required fields (`unique_id`, `name`)
- Duplicate customer detection
- Database error handling
- Proper HTTP status codes

## Next Steps

1. **Run the setup script** to create the table
2. **Test the API** with sample data
3. **Integrate with your frontend** to use the customer data
4. **Add additional endpoints** as needed (update, delete, search)
5. **Implement feedback linking** when customers submit feedback 