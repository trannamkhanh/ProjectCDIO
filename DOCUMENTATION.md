# FoodRescue - Project Documentation

## 1. Landing Page

| No. | Field name             | Type                 | Require                                                                                                      | Target                                          |
| --- | ---------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| 1   | Background             | Color                | Background: #10b981 (primary-600)                                                                            | Full page background                            |
| 2   | Hero Section           | Grid Layout          | Heading: h1 tag<br>Font-size: 5xl-7xl (responsive)<br>Color: white<br>Grid: 2 columns (lg screen)            | Display main value proposition                  |
| 3   | Navigation Bar         | Flex Container       | Logo + Text<br>Background: transparent<br>Position: absolute top<br>Buttons: Register, Sign In               | Navigation menu                                 |
| 4   | Stats Section          | Grid View (3 cols)   | Font-size: 3xl (numbers)<br>Color: white<br>Border-top: white/20<br>Padding-top: 8                           | Show: Active Users, Partner Stores, Meals Saved |
| 5   | Call-to-Action Buttons | Button Group         | Background: accent-500, white<br>Font-size: lg<br>Padding: px-8 py-3<br>Hover effects: shadow, transform     | "Start Rescuing Food", "Sign In"                |
| 6   | Hero Image             | Image Container      | Position: right side<br>Display: hidden on mobile<br>Border-radius: lg                                       | Display food rescue image                       |
| 7   | Features Section       | Grid Layout (3 cols) | Icons: ShoppingBag, Store, TrendingDown<br>Background: white<br>Padding: 20                                  | How it works section                            |
| 8   | Benefits Cards         | Card Grid            | Background: white<br>Border: 2px gray-200<br>Hover: border-primary-600<br>Icons: Leaf, Heart, Users, Package | Display platform benefits                       |

---

## 2. Login Page

| No. | Field name        | Type                 | Require                                                                                                              | Target                    |
| --- | ----------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 1   | Background        | Color                | Background: #f9fafb (gray-50)                                                                                        | Full page background      |
| 2   | Logo Container    | Flex Box             | Background: primary-600<br>Padding: 3<br>Border: 4px primary-700<br>Border-radius: md                                | Display FoodRescue logo   |
| 3   | Form Container    | Card                 | Background: white<br>Border: 2px gray-200<br>Shadow: md<br>Padding: 8<br>Max-width: md                               | Login form wrapper        |
| 4   | Email Input       | Text Field           | Type: email<br>Border: 2px gray-300<br>Focus: border-primary-600<br>Icon: Mail (left)<br>Padding-left: 10            | User email input          |
| 5   | Password Input    | Password Field       | Type: password<br>Border: 2px gray-300<br>Focus: border-primary-600<br>Icon: Lock (left)<br>Toggle visibility button | User password input       |
| 6   | Login Button      | Submit Button        | Background: primary-600<br>Color: white<br>Font-weight: semibold<br>Hover: primary-700<br>Disabled state: opacity-50 | Submit login form         |
| 7   | Error Message     | Alert Box            | Background: red-50<br>Border-left: 4px red-500<br>Icon: AlertCircle<br>Text color: red-700                           | Display error messages    |
| 8   | Quick Login Cards | Button Grid (3 cols) | Background: gray-50<br>Border: 2px gray-200<br>Hover: border-primary-600<br>Text: center                             | Demo account login        |
| 9   | Register Link     | Text Link            | Color: primary-600<br>Hover: underline<br>Font-size: sm                                                              | Navigate to register page |

---

## 3. Register Page

| No. | Field name      | Type           | Require                                                                                          | Target                    |
| --- | --------------- | -------------- | ------------------------------------------------------------------------------------------------ | ------------------------- |
| 1   | Background      | Color          | Background: gray-50                                                                              | Full page background      |
| 2   | Form Container  | Card           | Background: white<br>Border: 2px gray-200<br>Shadow: md<br>Padding: 8<br>Max-width: md           | Registration form wrapper |
| 3   | Name Input      | Text Field     | Type: text<br>Border: 2px gray-300<br>Focus: border-primary-600<br>Icon: User<br>Required: true  | User full name            |
| 4   | Email Input     | Text Field     | Type: email<br>Border: 2px gray-300<br>Focus: border-primary-600<br>Icon: Mail<br>Required: true | User email                |
| 5   | Password Input  | Password Field | Type: password<br>Border: 2px gray-300<br>Icon: Lock<br>Min-length: 6<br>Required: true          | User password             |
| 6   | Role Selection  | Radio Group    | Options: Buyer, Seller<br>Background: gray-50<br>Selected: primary-600<br>Border: 2px            | Select user role          |
| 7   | Register Button | Submit Button  | Background: primary-600<br>Color: white<br>Hover: primary-700<br>Font-weight: semibold           | Submit registration       |
| 8   | Login Link      | Text Link      | Color: primary-600<br>Hover: underline<br>Text-align: center                                     | Navigate to login page    |

---

## 4. Marketplace Page (Buyer)

| No. | Field name         | Type            | Require                                                                                                       | Target                |
| --- | ------------------ | --------------- | ------------------------------------------------------------------------------------------------------------- | --------------------- |
| 1   | Search Bar         | Input Field     | Type: text<br>Border: 2px gray-300<br>Focus: border-primary-600<br>Placeholder: "Search products..."          | Search products       |
| 2   | Category Filter    | Button Group    | Background: gray-100<br>Selected: primary-600<br>Border-radius: md<br>Font-size: sm                           | Filter by category    |
| 3   | View Toggle        | Icon Buttons    | Icons: Grid, List<br>Background: white<br>Border: 2px gray-200<br>Active: primary-600                         | Switch view mode      |
| 4   | Product Card       | Card Component  | Background: white<br>Border: 2px gray-200<br>Hover: border-primary-600<br>Border-radius: lg<br>Height: varies | Display product info  |
| 5   | Product Image      | Image Container | Height: 48 (12rem)<br>Object-fit: cover<br>Hover: scale-105<br>Border-radius: lg                              | Product photo         |
| 6   | Discount Badge     | Label           | Background: accent-500<br>Color: white<br>Font-weight: bold<br>Position: absolute top-right                   | Show discount %       |
| 7   | Expiry Timer       | Label           | Background: dynamic (red/orange/yellow-100)<br>Color: dynamic<br>Font-size: xs<br>Icon: Clock                 | Show time left        |
| 8   | Price Display      | Text Group      | Original price: line-through gray-400<br>Rescue price: text-2xl primary-600<br>Font-weight: bold              | Display pricing       |
| 9   | Store Info         | Text with Icon  | Icon: Store<br>Color: gray-600<br>Font-size: sm                                                               | Store name & location |
| 10  | Add to Cart Button | Button          | Background: primary-600<br>Color: white<br>Hover: primary-700<br>Icon: Plus                                   | Add product to cart   |

---

## 5. Cart Page (Buyer)

| No. | Field name         | Type          | Require                                                                                            | Target               |
| --- | ------------------ | ------------- | -------------------------------------------------------------------------------------------------- | -------------------- |
| 1   | Cart Header        | Heading       | Font-size: 2xl<br>Font-weight: bold<br>Color: gray-900<br>Margin-bottom: 6                         | Page title           |
| 2   | Empty Cart Message | Message Box   | Background: gray-50<br>Border: 2px dashed gray-300<br>Text-align: center<br>Padding: 12            | Show when cart empty |
| 3   | Cart Item Card     | Card          | Background: white<br>Border: 2px gray-200<br>Padding: 4<br>Flex layout                             | Display cart item    |
| 4   | Item Image         | Image         | Width & Height: 24 (6rem)<br>Object-fit: cover<br>Border-radius: lg                                | Product thumbnail    |
| 5   | Quantity Control   | Button Group  | Buttons: Minus, Plus<br>Border: 2px gray-300<br>Icons: Minus, Plus<br>Disabled state               | Adjust quantity      |
| 6   | Remove Button      | Icon Button   | Icon: Trash<br>Color: red-600<br>Hover: red-700<br>Background: red-50                              | Remove from cart     |
| 7   | Summary Card       | Card          | Background: gray-50<br>Border: 2px gray-200<br>Padding: 6<br>Position: sticky                      | Order summary        |
| 8   | Checkout Button    | Submit Button | Background: primary-600<br>Color: white<br>Width: full<br>Hover: primary-700<br>Disabled: gray-400 | Proceed to checkout  |

---

## 6. Seller Dashboard

| No. | Field name           | Type                 | Require                                                                          | Target                  |
| --- | -------------------- | -------------------- | -------------------------------------------------------------------------------- | ----------------------- |
| 1   | Stats Grid           | Grid Layout (4 cols) | Background: gradient primary<br>Padding: 6<br>Border-radius: lg<br>Shadow: lg    | Display key metrics     |
| 2   | Total Products Card  | Stat Card            | Icon: Package<br>Color: white<br>Font-size: 3xl (number)<br>Background: gradient | Show product count      |
| 3   | Active Listings Card | Stat Card            | Icon: ShoppingBag<br>Color: white<br>Font-size: 3xl<br>Background: gradient      | Show active products    |
| 4   | Total Revenue Card   | Stat Card            | Icon: DollarSign<br>Color: white<br>Font-size: 3xl<br>Background: gradient       | Show earnings           |
| 5   | Orders Card          | Stat Card            | Icon: Clock<br>Color: white<br>Font-size: 3xl<br>Background: gradient            | Show order count        |
| 6   | Add Product Button   | Primary Button       | Background: primary-600<br>Color: white<br>Icon: Plus<br>Hover: primary-700      | Navigate to add product |
| 7   | Product List         | Table/Grid           | Background: white<br>Border: 2px gray-200<br>Padding: 6                          | Display seller products |
| 8   | Action Buttons       | Button Group         | Edit: blue-600<br>Delete: red-600<br>Toggle: green-600/gray-400                  | Product actions         |

---

## 7. Admin Dashboard

| No. | Field name           | Type            | Require                                                                                         | Target                  |
| --- | -------------------- | --------------- | ----------------------------------------------------------------------------------------------- | ----------------------- |
| 1   | Stats Overview       | Grid (4 cols)   | Background: gradient<br>Icons: Users, Store, Package, ShoppingBag<br>Font-size: 3xl             | Platform statistics     |
| 2   | Users Tab            | Tab Button      | Background: white/primary-600<br>Border: 2px<br>Active: primary-600 white text                  | Switch to users view    |
| 3   | Products Tab         | Tab Button      | Background: white/primary-600<br>Border: 2px<br>Active: primary-600 white text                  | Switch to products view |
| 4   | User Table           | Table Component | Headers: Name, Email, Role, Status, Actions<br>Border: 2px gray-200<br>Hover: gray-50           | Display all users       |
| 5   | Role Badge           | Label           | Background: blue-100/green-100/purple-100<br>Color: respective<br>Font-size: xs<br>Padding: 1 2 | Show user role          |
| 6   | Status Badge         | Label           | Background: green-100/red-100<br>Color: respective<br>Font-size: xs                             | Show active/suspended   |
| 7   | Toggle Status Button | Icon Button     | Icon: CheckCircle/XCircle<br>Color: green/red<br>Hover effects                                  | Activate/suspend user   |
| 8   | Product Table        | Table Component | Columns: Product, Store, Category, Price, Status, Actions<br>Border: 2px gray-200               | Display all products    |

---

## Color Palette

### Primary Colors

- **primary-600**: `#10b981` (Green) - Main brand color
- **primary-700**: `#059669` - Darker shade
- **primary-100**: `#d1fae5` - Light tint

### Accent Colors

- **accent-500**: `#f59e0b` (Orange) - Call-to-action
- **accent-600**: `#d97706` - Darker accent
- **accent-300**: `#fcd34d` - Light accent

### Neutral Colors

- **gray-50**: `#f9fafb` - Background
- **gray-100**: `#f3f4f6` - Light background
- **gray-200**: `#e5e7eb` - Borders
- **gray-300**: `#d1d5db` - Input borders
- **gray-600**: `#4b5563` - Secondary text
- **gray-900**: `#111827` - Primary text

### Status Colors

- **red-50 to red-700**: Error & expired states
- **orange-50 to orange-600**: Warning & urgent states
- **yellow-50 to yellow-600**: Caution states
- **green-50 to green-700**: Success states
- **blue-50 to blue-600**: Info states

---

## Typography Scale

| Element     | Font Size             | Font Weight    | Line Height |
| ----------- | --------------------- | -------------- | ----------- |
| h1 (Hero)   | 5xl-7xl (3rem-4.5rem) | bold (700)     | tight       |
| h1 (Page)   | 3xl (1.875rem)        | bold (700)     | normal      |
| h2          | 2xl (1.5rem)          | bold (700)     | normal      |
| h3          | xl (1.25rem)          | semibold (600) | normal      |
| Body Large  | lg (1.125rem)         | normal (400)   | relaxed     |
| Body        | base (1rem)           | normal (400)   | normal      |
| Small       | sm (0.875rem)         | normal (400)   | normal      |
| Extra Small | xs (0.75rem)          | normal (400)   | normal      |

---

## Spacing System

- **Padding/Margin Scale**: 1 = 0.25rem (4px), 2 = 0.5rem (8px), 3 = 0.75rem (12px), 4 = 1rem (16px), 6 = 1.5rem (24px), 8 = 2rem (32px), 12 = 3rem (48px), 20 = 5rem (80px)

---

## Border Radius

- **sm**: 0.125rem (2px)
- **md**: 0.375rem (6px)
- **lg**: 0.5rem (8px)
- **xl**: 0.75rem (12px)

---

## Icons Used (Lucide React)

- Navigation: Leaf, Menu, X
- User: User, Mail, Lock, AlertCircle
- Shopping: ShoppingBag, Store, Package, Plus, Minus, Trash
- Actions: Edit, Eye, CheckCircle, XCircle
- Status: Clock, MapPin, TrendingDown, Heart
- View: Grid, List, Filter
- Financial: DollarSign
- Social: Users

---

## Component Patterns

### Button Styles

- **Primary**: bg-primary-600 text-white hover:bg-primary-700
- **Secondary**: bg-white text-primary-600 border-2 border-primary-600
- **Danger**: bg-red-600 text-white hover:bg-red-700
- **Success**: bg-green-600 text-white hover:bg-green-700

### Input Styles

- **Default**: border-2 border-gray-300 focus:border-primary-600
- **Error**: border-red-500 bg-red-50

### Card Styles

- **Default**: bg-white border-2 border-gray-200 rounded-lg
- **Hover**: hover:border-primary-600 transition
- **Shadow**: shadow-md hover:shadow-lg
