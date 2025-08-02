# 🏪 Outlet Enhancement Features

## Overview
The outlets table has been enhanced with new fields to provide comprehensive outlet management capabilities including images, GPS location, contact information, ratings, and custom feedback forms.

## 🆕 New Database Fields

### Core Fields
- **`outlet_image`** (VARCHAR(255), NOT NULL, DEFAULT '')
  - Mandatory outlet image
  - Stores the path to uploaded outlet images
  - Used for visual identification in admin panel and customer-facing pages

- **`gps_latitude`** (DECIMAL(10,8), NULL)
  - GPS latitude coordinate
  - Used for location-based features and mapping

- **`gps_longitude`** (DECIMAL(11,8), NULL)
  - GPS longitude coordinate
  - Used for location-based features and mapping

### Contact Information
- **`phone_number`** (VARCHAR(20), NULL)
  - Outlet phone number
  - Displayed in admin panel and customer forms

- **`email_id`** (VARCHAR(255), NULL)
  - Outlet email address
  - Used for communication and display

### Review & Rating System
- **`google_review_link`** (VARCHAR(500), NULL)
  - Configurable Google review link
  - Can be set to appear conditionally (e.g., after 4+ 5-star reviews)

- **`review_link_config`** (TEXT, NULL)
  - JSON configuration for review link behavior
  - Controls when and how review links are displayed

### Custom Feedback
- **`custom_feedback_form`** (TEXT, NULL)
  - JSON configuration for custom feedback forms
  - Allows per-outlet customization of feedback questions

### Dynamic Data (Calculated)
- **`avg_rating`** (Calculated from feedback_submissions)
  - Average rating based on customer feedback
  - Real-time calculation from employee ratings

- **`total_reviews`** (Calculated from feedback_submissions)
  - Total number of reviews received
  - Real-time count from feedback submissions

## 🎯 Features Implemented

### 1. 📸 Outlet Image Management
- **Mandatory image upload** for all outlets
- **File validation** (JPEG, PNG, WebP only)
- **Size limits** (5MB maximum)
- **Unique filenames** with timestamps
- **Image preview** in admin panel
- **Automatic directory creation** (`/uploads/outlets/`)

### 2. 📍 GPS Location System
- **Manual coordinate input** (latitude/longitude)
- **Browser geolocation** integration
- **"Get Location" button** for automatic capture
- **Coordinate validation** and formatting
- **Location display** in admin panel

### 3. 📞 Contact Information
- **Phone number** field with validation
- **Email address** field with validation
- **Contact display** in outlet table
- **Contact information** in customer forms

### 4. ⭐ Dynamic Rating System
- **Real-time rating calculation** from feedback
- **Average rating display** with star icons
- **Review count tracking**
- **Rating-based features** (e.g., Google review links)

### 5. 🔗 Google Review Integration
- **Configurable review links**
- **Conditional display** based on ratings
- **JSON configuration** for behavior
- **Automatic appearance** after 4+ 5-star reviews

### 6. 📝 Custom Feedback Forms
- **Per-outlet customization**
- **JSON configuration** storage
- **Flexible question types**
- **Custom form rendering**

## 🛠️ API Endpoints

### Outlet Management
```typescript
GET /api/outlets
- Fetches all outlets with new fields
- Includes calculated ratings and review counts
- Supports brand filtering

POST /api/outlets
- Creates new outlet with all new fields
- Validates mandatory outlet image
- Handles GPS coordinates and contact info

PUT /api/outlets/[id]
- Updates existing outlet with new fields
- Validates all field types
- Maintains data integrity

DELETE /api/outlets/[id]
- Deletes outlet (with safety checks)
- Prevents deletion if employees exist
```

### Image Upload
```typescript
POST /api/upload/outlet-image
- Handles outlet image uploads
- Validates file type and size
- Creates unique filenames
- Returns public URL for storage
```

## 🎨 Frontend Features

### Admin Panel Enhancements
- **Enhanced outlet table** with images and ratings
- **Comprehensive form** with all new fields
- **Image upload interface** with preview
- **GPS location capture** button
- **Contact information** display
- **Rating visualization** with stars
- **Review count** display

### Form Features
- **Outlet image upload** (mandatory)
- **GPS coordinate inputs** with validation
- **Contact information** fields
- **Google review link** configuration
- **Custom feedback form** JSON editor
- **Review link configuration** JSON editor

### Table Display
- **Outlet images** in table rows
- **Contact information** display
- **Rating stars** with average scores
- **Review counts** display
- **Employee counts** display
- **Status indicators** with colors

## 📊 Database Indexes

### Performance Optimizations
```sql
-- GPS location queries
ALTER TABLE outlets ADD INDEX idx_outlets_gps (gps_latitude, gps_longitude);

-- Rating-based queries
ALTER TABLE outlets ADD INDEX idx_outlets_rating (rating);

-- Review count queries
ALTER TABLE outlets ADD INDEX idx_outlets_reviews (total_reviews);
```

## 🔧 Usage Examples

### Adding New Outlet
1. **Upload outlet image** (required)
2. **Enter basic information** (name, brand, city, address)
3. **Add GPS coordinates** (manual or auto-capture)
4. **Enter contact information** (phone, email)
5. **Configure Google review link** (optional)
6. **Set up custom feedback form** (optional)
7. **Configure review link behavior** (optional)

### Managing Existing Outlet
1. **Update outlet image** as needed
2. **Modify GPS coordinates** if location changes
3. **Update contact information**
4. **Configure review settings**
5. **Customize feedback forms**

### Rating System
- **Automatic calculation** from employee feedback
- **Real-time updates** when new reviews are submitted
- **Conditional features** based on rating thresholds
- **Visual indicators** in admin panel

## 🚀 Setup Instructions

### 1. Run Database Updates
```bash
# Option 1: Run the SQL script directly
mysql -u your_user -p your_database < scripts/add-outlet-fields.sql

# Option 2: Use the Node.js script
node scripts/run-outlet-updates.js
```

### 2. Create Upload Directories
```bash
mkdir -p public/uploads/outlets
```

### 3. Update Environment Variables
```env
# Ensure your database connection is configured
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```

## 🎯 Benefits

### For Administrators
- **Visual outlet identification** with images
- **Location-based management** with GPS
- **Contact information** tracking
- **Rating monitoring** and analytics
- **Custom feedback** configuration
- **Review link** management

### For Customers
- **Outlet images** in feedback forms
- **Contact information** display
- **Location-based** features
- **Rating transparency**
- **Custom feedback** experiences
- **Review integration**

### For System
- **Performance optimization** with indexes
- **Data integrity** with validations
- **Scalable architecture** for future features
- **Real-time calculations** for ratings
- **Flexible configuration** with JSON fields

## 🔮 Future Enhancements

### Potential Features
- **Map integration** with GPS coordinates
- **Advanced rating analytics**
- **Automated review link generation**
- **Multi-language support** for custom forms
- **Advanced image processing**
- **Location-based outlet discovery**

---

**The outlet enhancement is now fully implemented and ready for use!** 🎉 