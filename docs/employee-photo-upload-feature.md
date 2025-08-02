# Employee Photo Upload Feature

## Overview

The employee management system now includes a complete photo upload functionality that allows administrators to upload and manage employee profile photos.

## Features

### ✅ **What's Implemented:**

1. **Photo Upload API**
   - Dedicated endpoint for employee photo uploads
   - File validation (JPEG, PNG, WebP)
   - Size limits (max 5MB)
   - Unique filename generation

2. **Frontend Integration**
   - Photo upload in employee form
   - Loading states during upload
   - Error handling and user feedback
   - Preview functionality

3. **File Management**
   - Organized directory structure
   - Automatic directory creation
   - Proper file naming conventions

## Technical Implementation

### API Endpoint

**File:** `app/api/upload/employee-photo/route.ts`

```typescript
POST /api/upload/employee-photo
```

**Features:**
- Accepts FormData with file
- Validates file type and size
- Creates `/uploads/employees/` directory
- Generates unique filenames
- Returns public URL

### Frontend Integration

**File:** `app/admin/employees/page.tsx`

**Key Functions:**
- `handlePhotoUpload()` - Handles file selection and upload
- Loading state management
- Error handling and user feedback

### File Structure

```
public/
└── uploads/
    └── employees/
        └── employee-photo-[timestamp].[extension]
```

## Setup Instructions

### 1. Create Directory Structure

Run the setup script:
```bash
node scripts/setup-employee-photos.js
```

This will create:
- `public/uploads/` directory
- `public/uploads/employees/` subdirectory

### 2. File Requirements

- **Format:** JPEG, PNG, WebP
- **Size:** Maximum 5MB
- **Naming:** Automatically generated with timestamp

## Usage

### 1. Adding Employee Photo

1. **Open Employee Form**
   - Click "Add Employee" or "Edit Employee"
   - Form opens with photo upload section

2. **Upload Photo**
   - Click "Upload Photo" button
   - Select image file from device
   - File uploads automatically
   - Loading indicator shows progress

3. **Complete Form**
   - Photo URL is saved with employee data
   - Submit form to save employee

### 2. Viewing Employee Photos

- **Employee List:** Photos display in avatar format
- **Employee Details:** Full-size photo preview
- **Fallback:** Initials shown if no photo

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "url": "/uploads/employees/employee-photo-1234567890.jpg",
    "fileName": "employee-photo-1234567890.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  },
  "message": "Employee photo uploaded successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Error Handling

### Common Issues:

1. **File Too Large**
   - Maximum 5MB limit
   - User receives clear error message

2. **Invalid File Type**
   - Only JPEG, PNG, WebP allowed
   - Validation prevents upload

3. **Upload Failure**
   - Network errors handled gracefully
   - User feedback provided

4. **Directory Issues**
   - Automatic directory creation
   - Fallback error handling

## Security Features

1. **File Validation**
   - Type checking
   - Size limits
   - Extension validation

2. **Unique Filenames**
   - Timestamp-based naming
   - Prevents conflicts
   - Secure file handling

3. **Path Security**
   - Restricted to uploads directory
   - No directory traversal

## Database Integration

### Employee Table Schema
```sql
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_code VARCHAR(50) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  outlet_id INT,
  position VARCHAR(100),
  photo_url VARCHAR(500),  -- Stores the photo URL
  join_date DATE,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (outlet_id) REFERENCES outlets(id)
);
```

## Performance Considerations

1. **File Size Limits**
   - 5MB maximum prevents large uploads
   - Faster upload times
   - Reduced storage usage

2. **Image Optimization**
   - Consider implementing image compression
   - Multiple size generation for different uses
   - CDN integration for production

3. **Caching**
   - Browser caching for uploaded images
   - Server-side caching for frequently accessed photos

## Future Enhancements

1. **Image Processing**
   - Automatic resizing
   - Thumbnail generation
   - Format conversion

2. **Advanced Features**
   - Drag and drop upload
   - Image cropping
   - Multiple photo support

3. **Storage Options**
   - Cloud storage integration
   - CDN deployment
   - Backup strategies

## Testing

### Test Cases:

1. **Valid Upload**
   - Upload JPEG/PNG/WebP files
   - Verify file saves correctly
   - Check URL generation

2. **Invalid Upload**
   - Test file size limits
   - Test invalid file types
   - Verify error messages

3. **UI Testing**
   - Test loading states
   - Test error handling
   - Test preview functionality

### Debug Steps:

```bash
# Check if directory exists
ls -la public/uploads/employees/

# Test upload API
curl -X POST -F "file=@test-image.jpg" http://localhost:3000/api/upload/employee-photo

# Check file permissions
chmod 755 public/uploads/employees/
```

## Configuration

### Environment Variables (Optional)
```env
# Maximum file size (in bytes)
MAX_EMPLOYEE_PHOTO_SIZE=5242880

# Allowed file types
ALLOWED_EMPLOYEE_PHOTO_TYPES=image/jpeg,image/png,image/webp

# Upload directory
EMPLOYEE_PHOTO_UPLOAD_DIR=public/uploads/employees
```

## Troubleshooting

### Common Issues:

1. **Upload Fails**
   - Check directory permissions
   - Verify file size and type
   - Check network connectivity

2. **Photos Not Displaying**
   - Verify file exists in directory
   - Check URL path is correct
   - Clear browser cache

3. **Permission Errors**
   - Ensure upload directory is writable
   - Check server user permissions
   - Verify file ownership

### Debug Commands:

```bash
# Check directory structure
tree public/uploads/

# Test file permissions
ls -la public/uploads/employees/

# Check server logs
tail -f logs/error.log
``` 