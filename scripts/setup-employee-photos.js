const fs = require('fs');
const path = require('path');

// Setup employee photos directory
async function setupEmployeePhotos() {
  console.log('📸 Setting up employee photos directory...');
  
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads directory');
    }

    // Create employees subdirectory
    const employeesDir = path.join(uploadsDir, 'employees');
    if (!fs.existsSync(employeesDir)) {
      fs.mkdirSync(employeesDir, { recursive: true });
      console.log('✅ Created employees directory');
    }

    // List existing employee photos
    const files = fs.readdirSync(employeesDir);
    console.log('📄 Existing employee photos:', files);

    console.log('\n📸 Employee photos setup complete!');
    console.log('📁 Employee photos directory:', employeesDir);
    console.log('🔗 Photo URL pattern: /uploads/employees/employee-photo-[timestamp].[extension]');
    
  } catch (error) {
    console.error('❌ Error setting up employee photos:', error);
  }
}

// Run the setup
if (require.main === module) {
  setupEmployeePhotos()
    .then(() => {
      console.log('\n✅ Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupEmployeePhotos }; 