const fs = require('fs');
const path = require('path');

// Setup outlet images directory and default background
async function setupOutletImages() {
  console.log('🖼️ Setting up outlet images...');
  
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads directory');
    }

    // Create outlets subdirectory
    const outletsDir = path.join(uploadsDir, 'outlets');
    if (!fs.existsSync(outletsDir)) {
      fs.mkdirSync(outletsDir, { recursive: true });
      console.log('✅ Created outlets directory');
    }

    // Check if default background image exists
    const defaultImagePath = path.join(outletsDir, 'default.png');
    if (!fs.existsSync(defaultImagePath)) {
      console.log('⚠️ Default background image not found at:', defaultImagePath);
      console.log('📝 Please add a default.png file to public/uploads/outlets/');
      console.log('💡 You can use any PNG image as the default background');
    } else {
      console.log('✅ Default background image found');
    }

    // List existing outlet images
    const files = fs.readdirSync(outletsDir);
    console.log('📄 Existing outlet images:', files);

    console.log('\n🎨 Background image setup complete!');
    console.log('📁 Outlet images directory:', outletsDir);
    console.log('🔗 Background image URL: /uploads/outlets/default.png');
    
  } catch (error) {
    console.error('❌ Error setting up outlet images:', error);
  }
}

// Run the setup
if (require.main === module) {
  setupOutletImages()
    .then(() => {
      console.log('\n✅ Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupOutletImages }; 