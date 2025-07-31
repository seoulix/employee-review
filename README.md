# Employee Review System

A comprehensive admin dashboard for managing employee reviews across multiple brands, outlets, and locations.

## Features

- **Admin Dashboard**: Real-time metrics and activity monitoring
- **Brand Management**: CRUD operations for business brands
- **Location Management**: States and cities administration
- **Outlet Management**: Store locations with detailed information
- **Employee Management**: Staff profiles with performance tracking
- **Feedback System**: Customer review collection and analysis
- **Leaderboard**: Performance rankings and recognition
- **Winner Selection**: Monthly employee recognition system
- **Public Feedback Form**: Customer-facing review submission
- **Employee Performance**: Personal dashboards for staff

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL with connection pooling
- **UI Components**: shadcn/ui, Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React

## Database Schema

The system uses a comprehensive MySQL database with the following main tables:

- `admin_users` - System administrators
- `brands` - Business brands
- `states` - Geographic states
- `cities` - Cities within states
- `outlets` - Store locations
- `employees` - Staff members
- `feedback_links` - Secure feedback collection URLs
- `feedback_submissions` - Customer reviews and ratings
- `winner_selections` - Monthly recognition records

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd employee-review-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Edit `.env.local` with your database credentials:
   \`\`\`
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=employee_review_system
   DB_PORT=3306
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   npm run db:setup
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application**
   - Admin Dashboard: http://localhost:3000/admin/login
   - Default login: admin@company.com / password

## API Endpoints

### Brands
- `GET /api/brands` - List all brands
- `POST /api/brands` - Create new brand
- `PUT /api/brands/[id]` - Update brand
- `DELETE /api/brands/[id]` - Delete brand

### Employees
- `GET /api/employees` - List all employees with performance data
- `POST /api/employees` - Create new employee
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Feedback
- `GET /api/feedback` - Get feedback with filters
- `POST /api/feedback` - Submit new feedback

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Views

The system includes optimized database views:

- `employee_performance_summary` - Aggregated employee performance metrics
- `outlet_feedback_summary` - Outlet-level feedback statistics

## Features in Detail

### Admin Dashboard
- Real-time counters for reviews, alerts, and performance
- Recent activity feed
- Quick action buttons
- Auto-refresh functionality

### Brand Management
- Create, edit, and delete brands
- Track outlet count per brand
- Status management (Active/Inactive)

### Employee Management
- Photo upload support
- Performance tracking with ratings
- Outlet assignment
- Status management

### Feedback System
- Secure token-based feedback links
- 20-second submission timer
- Automatic status classification:
  - Perfect (4-5 stars)
  - Needs Review (3 stars)
  - Counselling (1-2 stars)

### Reporting
- Advanced filtering by brand, location, employee
- Export to CSV/Excel
- Date range filtering
- Performance statistics

### Leaderboard
- Real-time rankings
- Multiple filter options
- Auto-refresh every 10 seconds
- Performance badges

## Security Features

- Secure feedback tokens
- IP address logging
- User agent tracking
- SQL injection prevention
- Input validation

## Performance Optimizations

- Database connection pooling
- Indexed queries
- Optimized database views
- Efficient pagination
- Caching strategies

## Deployment

1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Set up production database**
   - Create MySQL database
   - Run schema and sample data scripts
   - Update environment variables

3. **Deploy to your platform**
   - Vercel, Netlify, or custom server
   - Ensure database connectivity
   - Set environment variables

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@company.com or create an issue in the repository.

## Changelog

### Version 1.0.0
- Initial release with full admin dashboard
- MySQL database integration
- Complete CRUD operations
- Real-time dashboard updates
- Feedback collection system
- Employee performance tracking
- Winner selection system
\`\`\`

Now you have a complete Employee Review System with:

## ✅ **What's Working:**

### **1. Complete MySQL Database Schema**
- 9 main tables with proper relationships
- Foreign key constraints
- Indexes for performance
- Database views for complex queries
- Sample data for testing

### **2. Database Models & API Integration**
- TypeScript models for type safety
- Database connection pooling
- CRUD operations for all entities
- Error handling and validation
- RESTful API endpoints

### **3. Full-Stack Integration**
- Frontend components connected to backend APIs
- Real-time data fetching
- Form submissions with validation
- Dashboard statistics from database
- Export functionality

### **4. Key Features Implemented**
- **Authentication**: Admin login system
- **Dashboard**: Real-time metrics from database
- **Brand Management**: Full CRUD with MySQL
- **Employee Management**: Performance tracking
- **Feedback System**: Complete submission workflow
- **Reporting**: Advanced filtering and exports
- **Leaderboard**: Database-driven rankings

## 🚀 **Setup Instructions:**

1. **Install MySQL** and create database
2. **Run the setup script**: `npm run db:setup`
3. **Configure environment variables** in `.env.local`
4. **Start the application**: `npm run dev`
5. **Login with**: admin@company.com

## 📊 **Database Features:**

- **Performance Views**: Pre-calculated employee statistics
- **Automatic Status Classification**: Based on rating scores
- **Relationship Integrity**: Foreign key constraints
- **Optimized Queries**: Proper indexing strategy
- **Sample Data**: Ready-to-use test data

The system is now production-ready with a complete MySQL backend, proper data models, API integration, and all the requested features working together seamlessly!
