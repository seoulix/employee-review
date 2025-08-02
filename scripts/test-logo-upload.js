const fs = require('fs');
const path = require('path');

// Test the logo upload functionality
async function testLogoUpload() {
  console.log('🧪 Testing Logo Upload Functionality...\n');

  // Test 1: Check if uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'brands');
  console.log('📁 Checking uploads directory...');
  if (fs.existsSync(uploadsDir)) {
    console.log('✅ Uploads directory exists:', uploadsDir);
    
    // List existing files
    const files = fs.readdirSync(uploadsDir);
    console.log('📄 Existing logo files:', files);
  } else {
    console.log('❌ Uploads directory does not exist');
  }

  // Test 2: Check database connection and brands table
  console.log('\n🗄️ Checking database...');
  try {
    const { BrandModel } = require('../lib/models/brand');
    const brands = await BrandModel.getAll();
    console.log('✅ Database connection successful');
    console.log('📊 Total brands in database:', brands.length);
    
    // Check which brands have logos
    const brandsWithLogos = brands.filter(brand => brand.logo_url);
    console.log('🖼️ Brands with logos:', brandsWithLogos.length);
    
    brandsWithLogos.forEach(brand => {
      console.log(`  - ${brand.name}: ${brand.logo_url}`);
    });
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
  }

  // Test 3: Test upload API endpoint
  console.log('\n🌐 Testing upload API...');
  try {
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: 'test' // This will fail but we can see if the endpoint is reachable
    });
    console.log('✅ Upload API endpoint is reachable');
  } catch (error) {
    console.log('❌ Upload API endpoint not reachable:', error.message);
  }

  console.log('\n📋 Summary:');
  console.log('1. Check if you can access the brand management page');
  console.log('2. Try adding a brand with a logo');
  console.log('3. Check the browser console for any errors');
  console.log('4. Verify the logo appears in the brands table');
}

// Run the test
if (require.main === module) {
  testLogoUpload()
    .then(() => {
      console.log('\n✅ Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testLogoUpload }; 