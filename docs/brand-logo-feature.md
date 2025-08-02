# Brand Logo Upload Feature

## Overview

The Brand Logo Upload feature allows administrators to upload and manage brand logos for each brand in the system. Logos are stored in the `public/uploads/brands/` directory and referenced by URL in the database.

## Features

### ✅ **What's Implemented:**

1. **File Upload API** (`/api/upload`)
   - Handles image file uploads
   - Validates file type (JPEG, PNG, WebP)
   - Validates file size (max 5MB)
   - Creates unique filenames
   - Stores files in `public/uploads/brands/`

2. **Brand Form Enhancement**
   - File input for logo selection
   - Real-time image preview
   - Upload progress indicator
   - Automatic upload on file selection

3. **Brand Table Display**
   - Logo column in brands table
   - Thumbnail display for uploaded logos
   - Placeholder for brands without logos

4. **Database Integration**
   - `logo_url` field in brands table
   - Proper CRUD operations with logo support

## File Structure

```
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # File upload API
│   └── admin/
│       └── brand/
│           └── page.tsx          # Brand management page
├── components/
│   └── brand-logo-upload.tsx    # Reusable logo upload component
├── public/
│   └── uploads/
│       └── brands/              # Stored logo files
└── lib/
    └── models/
        └── brand.ts             # Brand model with logo support
```

## API Endpoints

### POST `/api/upload`
Uploads a brand logo file.

**Request:**
```javascript
const formData = new FormData()
formData.append('file', file)

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "/uploads/brands/brand-logo-1234567890.jpg",
    "fileName": "brand-logo-1234567890.jpg",
    "size": 102400,
    "type": "image/jpeg"
  },
  "message": "File uploaded successfully"
}
```

## Database Schema

The `brands` table includes a `logo_url` field:

```sql
CREATE TABLE brands (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),        -- Brand logo URL
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Usage Examples

### 1. Adding a Brand with Logo

```javascript
// In the brand form
const handleLogoUpload = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  
  const result = await response.json()
  if (result.success) {
    setFormData(prev => ({ 
      ...prev, 
      logo_url: result.data.url 
    }))
  }
}
```

### 2. Displaying Brand Logo

```jsx
{brand.logo_url ? (
  <img 
    src={brand.logo_url} 
    alt={`${brand.name} logo`}
    className="w-10 h-10 object-contain rounded"
  />
) : (
  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
    <span className="text-xs text-gray-500">No logo</span>
  </div>
)}
```

## File Validation

### Allowed File Types:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### File Size Limits:
- Maximum: 5MB
- Recommended: Under 1MB for optimal performance

### File Naming:
- Format: `brand-logo-{timestamp}.{extension}`
- Example: `brand-logo-1703123456789.jpg`

## Security Features

1. **File Type Validation** - Only image files allowed
2. **File Size Limits** - Prevents large file uploads
3. **Unique Filenames** - Prevents filename conflicts
4. **Directory Structure** - Organized file storage
5. **Error Handling** - Graceful failure handling

## Performance Considerations

1. **Image Optimization** - Consider implementing image compression
2. **CDN Integration** - For production, consider using a CDN
3. **Caching** - Browser caching for static images
4. **Lazy Loading** - For tables with many brands

## Future Enhancements

1. **Image Cropping** - Allow users to crop logos
2. **Multiple Formats** - Generate different sizes automatically
3. **Drag & Drop** - Enhanced upload interface
4. **Bulk Upload** - Upload multiple logos at once
5. **Logo Management** - Replace/delete existing logos

## Troubleshooting

### Common Issues:

1. **Upload Fails**
   - Check file size (max 5MB)
   - Verify file type (JPEG, PNG, WebP only)
   - Ensure uploads directory exists

2. **Logo Not Displaying**
   - Check file path in database
   - Verify file exists in `public/uploads/brands/`
   - Check browser console for errors

3. **Permission Errors**
   - Ensure write permissions on uploads directory
   - Check server file permissions

### Debug Commands:

```bash
# Check uploads directory
ls -la public/uploads/brands/

# Check file permissions
chmod 755 public/uploads/brands/

# Test upload endpoint
curl -X POST -F "file=@logo.jpg" http://localhost:3000/api/upload
```

## Configuration

### Environment Variables:
```env
# Optional: Custom upload path
UPLOAD_PATH=/custom/uploads/path

# Optional: Max file size (in bytes)
MAX_FILE_SIZE=5242880
```

### Next.js Configuration:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['localhost'], // Add your domain for production
  },
}
``` 