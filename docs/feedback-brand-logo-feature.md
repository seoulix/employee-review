# Brand Logo in Feedback Form

## Overview

The feedback form now displays the brand logo instead of a generic star icon, providing a more personalized and branded experience for customers.

## Features

### ✅ **What's Implemented:**

1. **Brand Logo Display**
   - Shows the brand logo in the feedback form header
   - Replaces the generic star icon with the actual brand logo
   - Maintains fallback to star icon if no logo is available

2. **API Enhancement**
   - Updated feedback link API to include brand logo URL
   - Fetches `brand_logo_url` from the brands table
   - Passes logo information to the frontend

3. **Responsive Design**
   - Logo displays in a 64x64px container
   - Proper aspect ratio maintenance
   - Clean border and shadow styling

4. **Error Handling**
   - Graceful fallback if logo fails to load
   - Maintains functionality even without logo
   - No broken image placeholders

## Technical Implementation

### Database Changes

The feedback link API now includes brand logo information:

```sql
SELECT 
  fl.id,
  fl.outlet_id,
  fl.token,
  fl.url,
  fl.status,
  fl.unique_id,
  fl.name,
  fl.phone,
  fl.email,
  fs.tiles,
  fl.arrival_date,
  o.name as outlet_name,
  b.name as brand_name,
  b.logo_url as brand_logo_url,  -- Added this field
  c.name as city_name,
  s.name as state_name
FROM feedback_links fl
LEFT JOIN outlets o ON fl.outlet_id = o.id
LEFT JOIN brands b ON o.brand_id = b.id
LEFT JOIN cities c ON o.city_id = c.id
LEFT JOIN states s ON c.state_id = s.id
JOIN feedback_settings as fs
WHERE fl.token = ? AND fl.status = 'Active'
```

### Frontend Changes

The feedback form now:

1. **Receives brand logo URL** from the API
2. **Displays logo conditionally** based on availability
3. **Handles loading errors** gracefully
4. **Maintains fallback** to star icon

```jsx
{outletData?.brand_logo_url ? (
  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 bg-white flex items-center justify-center shadow-sm">
    <img 
      src={outletData.brand_logo_url} 
      alt={`${outletData.brand_name} logo`}
      className="w-full h-full object-contain p-1"
      onError={(e) => {
        // Fallback to star icon if image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = '<div class="w-full h-full bg-blue-600 rounded flex items-center justify-center"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg></div>';
        }
      }}
    />
  </div>
) : (
  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
    <Star className="w-6 h-6 text-white" />
  </div>
)}
```

## User Experience

### Before:
- Generic star icon for all brands
- No brand identification
- Less personalized experience

### After:
- Brand-specific logo display
- Enhanced brand recognition
- More professional appearance
- Personalized customer experience

## Benefits

1. **Brand Recognition**
   - Customers immediately see which brand they're providing feedback for
   - Reinforces brand identity during feedback process

2. **Professional Appearance**
   - More polished and branded interface
   - Consistent with brand guidelines

3. **User Trust**
   - Familiar brand logo builds confidence
   - Reduces confusion about which brand the feedback is for

4. **Fallback Safety**
   - Graceful degradation if logo is missing
   - No broken functionality

## File Structure

```
├── app/
│   ├── api/
│   │   └── feedback-links/
│   │       └── token/
│   │           └── [token]/
│   │               └── route.ts    # Updated to include brand_logo_url
│   └── outlet/
│       └── feedback/
│           └── [token]/
│               └── page.tsx        # Updated to display brand logo
└── docs/
    └── feedback-brand-logo-feature.md  # This documentation
```

## Testing

### Test Cases:

1. **Brand with Logo**
   - Create a brand with a logo
   - Generate feedback link
   - Verify logo appears in feedback form

2. **Brand without Logo**
   - Create a brand without logo
   - Generate feedback link
   - Verify star icon appears as fallback

3. **Logo Loading Error**
   - Use invalid logo URL
   - Verify fallback to star icon
   - Ensure form still functions

4. **Responsive Design**
   - Test on different screen sizes
   - Verify logo scales properly
   - Check mobile compatibility

## Future Enhancements

1. **Logo Optimization**
   - Implement image compression
   - Add different sizes for different devices
   - Lazy loading for better performance

2. **Brand Customization**
   - Allow brands to customize logo display
   - Support for different logo formats
   - Brand-specific styling options

3. **Analytics**
   - Track logo display success rates
   - Monitor fallback usage
   - Performance metrics

## Troubleshooting

### Common Issues:

1. **Logo Not Displaying**
   - Check if brand has logo_url in database
   - Verify logo file exists in uploads directory
   - Check browser console for errors

2. **Fallback Not Working**
   - Ensure star icon component is imported
   - Check CSS classes are applied correctly
   - Verify error handling logic

3. **Performance Issues**
   - Optimize logo file sizes
   - Consider CDN for logo delivery
   - Implement caching strategies

### Debug Steps:

```bash
# Check if brand has logo
SELECT id, name, logo_url FROM brands WHERE id = [brand_id];

# Verify logo file exists
ls -la public/uploads/brands/

# Test feedback link API
curl http://localhost:3000/api/feedback-links/token/[token]
```

## Configuration

### Environment Variables:
```env
# Optional: Custom logo path
BRAND_LOGO_PATH=/custom/logo/path

# Optional: Logo size limits
MAX_LOGO_SIZE=1048576
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