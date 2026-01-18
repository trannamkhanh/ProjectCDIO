# Excess Product Management System (FoodRescue)

A complete web application marketplace for rescuing near-expiry food, built with React, Vite, and Tailwind CSS.

## 🚀 Features

### Role-Based Access Control

- **Buyer Interface**: Browse marketplace, add to cart, checkout with QR code
- **Seller Dashboard**: Manage inventory, add products, track expiry dates
- **Admin Panel**: User management, product moderation, system statistics

### Key Highlights

- ✅ Smart login with automatic role-based redirection
- ✅ Real-time expiry tracking with color-coded alerts
- ✅ Shopping cart with quantity management
- ✅ QR code generation for order pickup
- ✅ Admin tools for banning users/products
- ✅ Responsive design with Tailwind CSS
- ✅ Green/Orange eco-friendly color palette

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context API

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔐 Demo Credentials

### Buyer Account

- Email: `buyer@test.com`
- Password: `123456`

### Seller Account

- Email: `seller@test.com`
- Password: `123456`

### Admin Account

- Email: `admin@admin.com`
- Password: `admin`

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Dynamic layout with Navbar/Sidebar
│   └── ProtectedRoute.jsx  # Route protection component
├── context/
│   └── AppContext.jsx      # Auth & App state management
├── data/
│   └── mockData.js         # Mock users & products
├── pages/
│   ├── LandingPage.jsx     # Public home page
│   ├── Login.jsx           # Smart login with role redirect
│   ├── buyer/
│   │   ├── Marketplace.jsx # Product grid with filters
│   │   └── Cart.jsx        # Cart & checkout flow
│   ├── seller/
│   │   └── Dashboard.jsx   # Inventory management
│   └── admin/
│       └── AdminDashboard.jsx # User/Product moderation
└── App.jsx                 # Routing configuration
```

## 🎨 Features by Role

### 👤 Buyer

- Browse rescue food products with discounts up to 70%
- Filter by category
- View expiry countdown on each product
- Add items to cart
- Checkout and receive QR code for pickup
- Responsive product cards with images

### 🏪 Seller

- Dashboard with key metrics (Total Products, Inventory Value, Urgent Items)
- Add new products with expiry date/time
- View inventory table with color-coded expiry alerts (RED < 24h)
- Delete products from inventory
- Track stock levels

### ⚙️ Admin

- System-wide statistics dashboard
- User management:
  - Ban/Unban buyers and sellers
  - Verify sellers
  - View user details
- Product moderation:
  - Ban/Remove unsafe products
  - Monitor all listings across platform
- Platform analytics (Total Revenue, Food Rescued)

## 🌈 Color Palette

- **Primary (Green)**: `#22c55e` - Eco-friendly, sustainability
- **Accent (Orange)**: `#f97316` - Urgency, discounts
- **Supporting**: Gray scales for neutral elements

## 🔄 State Management

Uses React Context API with two providers:

- **AuthProvider**: Login/logout, current user, authentication state
- **AppProvider**: Cart, products, users, orders, admin actions

## 📱 Responsive Design

Fully responsive layout that works on:

- Desktop (1920px+)
- Tablet (768px - 1919px)
- Mobile (< 768px)

## 🚦 Routing

- `/` - Landing page (public)
- `/login` - Login with smart redirect
- `/marketplace` - Buyer marketplace (protected)
- `/cart` - Shopping cart (protected)
- `/seller-dashboard` - Seller inventory (protected)
- `/admin-dashboard` - Admin panel (protected)

## 🎯 Future Enhancements

- Real-time notifications
- Payment gateway integration
- Geolocation-based search
- Review and rating system
- Chat between buyers and sellers
- Analytics dashboard for sellers
- Email notifications for expiry alerts

## 📄 License

MIT License - Free to use for educational and commercial purposes.

---

Built with ❤️ for fighting food waste and promoting sustainability.
