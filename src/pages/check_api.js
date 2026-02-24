// Test script - check what API actually returns
// Run: node check_api.js

const API_URL = 'http://localhost:3000/api/products';

async function checkProducts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    console.log('=== API RESPONSE ===');
    console.log('Total products:', data.length);
    
    if (data.length > 0) {
      console.log('\n=== FIRST PRODUCT ===');
      console.log(JSON.stringify(data[0], null, 2));
      
      console.log('\n=== FIELD NAMES ===');
      console.log('Keys:', Object.keys(data[0]));
      
      console.log('\n=== EXPECTED vs ACTUAL ===');
      const expected = {
        'product_id': data[0].product_id || data[0].id,
        'product_name': data[0].product_name || data[0].name,
        'category': data[0].category,
        'store_name': data[0].store_name || data[0].storeName,
        'seller_location': data[0].seller_location || data[0].location,
        'original_price': data[0].original_price || data[0].originalPrice,
        'rescue_price': data[0].rescue_price || data[0].rescuePrice,
        'quantity': data[0].quantity || data[0].stock_quantity,
        'status': data[0].status,
        'image_url': data[0].image_url || data[0].image,
        'expiry_date': data[0].expiry_date || data[0].expiryDate
      };
      
      Object.entries(expected).forEach(([key, value]) => {
        console.log(`${key}: ${value !== undefined ? '✅' : '❌'} (${value})`);
      });
    } else {
      console.log('⚠️ No products found in database!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkProducts();
