# 🚀 QUICK START GUIDE

## Getting Started in 3 Steps

### Step 1: The app is already running!

Open your browser and go to: **http://localhost:5173/**

### Step 2: Choose a role to test

#### 🛒 Test as BUYER (Customer)

1. Click **"Login as Buyer"** button
2. Browse the marketplace
3. Click "Add to Cart" on products
4. Click cart icon (top right)
5. Proceed to checkout
6. Get your QR code!

#### 🏪 Test as SELLER (Store Owner)

1. Click **"Login as Seller"** button
2. View your dashboard stats
3. Click "Add Product" to list rescue food
4. Fill in: Name, Prices, Quantity, Expiry Date
5. See products in RED if expiring < 24 hours

#### ⚙️ Test as ADMIN (Platform Manager)

1. Click **"Login as Admin"** button
2. View platform statistics
3. Go to "User Management" tab
4. Try banning/unbanning a user
5. Go to "Product Moderation" tab
6. Ban/unban products

### Step 3: Explore Features

**BUYER Experience:**

- 🔍 Search and filter products
- ⏰ See expiry countdown on each item
- 💰 View rescue prices (up to 70% off)
- 🛒 Add multiple items to cart
- 📱 Get QR code after checkout

**SELLER Experience:**

- 📊 Dashboard with 4 stat cards
- ➕ Add products with expiry tracking
- 🚨 RED alerts for items expiring soon
- 📦 Manage inventory easily
- 🗑️ Delete products

**ADMIN Experience:**

- 📈 System-wide analytics
- 👥 Ban/unban buyers and sellers
- ✅ Verify seller accounts
- 🛡️ Remove unsafe products
- 📊 View total revenue & food rescued

## 🎨 UI Highlights

- **Green Theme**: Eco-friendly, sustainable design
- **Orange Accents**: Highlights discounts and urgency
- **Responsive**: Works on desktop, tablet, mobile
- **Smooth**: Tailwind CSS animations

## 🔐 All Login Credentials

| Role   | Email           | Password |
| ------ | --------------- | -------- |
| Buyer  | buyer@test.com  | 123456   |
| Seller | seller@test.com | 123456   |
| Admin  | admin@admin.com | admin    |

## 📝 Test Scenarios

### Scenario 1: Complete Purchase Flow

1. Login as Buyer
2. Add 3 products to cart
3. Adjust quantities
4. Remove one item
5. Complete checkout
6. View QR code

### Scenario 2: Seller Inventory Management

1. Login as Seller
2. Add a new product expiring in 4 hours
3. See it appear with RED highlight
4. Check dashboard stats update
5. Delete a product

### Scenario 3: Admin Moderation

1. Login as Admin
2. Ban a buyer
3. Verify an unverified seller
4. Ban a product
5. View updated stats

## 🛠️ Development Commands

```bash
# Start dev server (already running!)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 💡 Tips

- The app uses **mock data** (no backend needed)
- Data persists in browser memory (refresh = reset)
- Expiry times are calculated in real-time
- All features are fully functional
- Responsive - try resizing browser!

## 📂 Key Files to Explore

- `src/data/mockData.js` - Edit users & products
- `src/context/AppContext.jsx` - State management logic
- `src/pages/buyer/Marketplace.jsx` - Main shopping interface
- `src/pages/seller/Dashboard.jsx` - Seller inventory
- `src/pages/admin/AdminDashboard.jsx` - Admin controls

---

**Enjoy exploring the FoodRescue platform!** 🌍♻️
