# Super Mall Web Application - Workflow Guide

## 🚀 Quick Start Guide

### 1. **How to Start the Project**

#### Option A: Direct Browser Open
```bash
# Navigate to project folder
cd d:\shopping_mall\super-mall-web-app

# Double-click index.html to open in browser
```

#### Option B: Local Server (Recommended)
```bash
# Using Python
cd d:\shopping_mall\super-mall-web-app
python -m http.server 8000

# Then visit: http://localhost:8000
```

### 2. **Entry Points**

| Entry Point | File Path | Purpose |
|-------------|-----------|---------|
| **Home Page** | `index.html` | Main landing page for all users |
| **Admin Login** | `pages/auth/login.html` | Admin/Merchant authentication |
| **User Registration** | `pages/auth/register.html` | New user registration |
| **Admin Dashboard** | `pages/admin/dashboard.html` | Admin control panel |

## 👥 User Workflows

### **Admin/Merchant Workflow**

#### Step 1: Login
```
Home Page → Click "Sign In" → Login Page
Credentials: admin@supermall.com / admin123
↓
Redirect to Admin Dashboard
```

#### Step 2: Shop Management
```
Dashboard → "Create Shop" → Fill Form → Save
├── Shop Name *
├── Description *
├── Category (dropdown) *
├── Floor (dropdown) *
├── Location *
├── Contact Number *
├── Contact Email
├── Image URL
└── Is Active (checkbox)
```

#### Step 3: Offer Management
```
Dashboard → "Manage Offers" → "Add New Offer"
├── Offer Title *
├── Shop Selection *
├── Discount % *
├── Valid From *
├── Valid Until *
├── Description
└── Active Status
```

#### Step 4: View Statistics
```
Dashboard shows:
├── Total Shops/Products/Offers count
├── Floor-wise shop distribution
├── Category breakdown
├── Recent activities
└── Quick action buttons
```

### **Customer/User Workflow**

#### Step 1: Browse Shops
```
Home → "Shops" → Shop Listing Page
Features:
├── Search by shop name
├── Filter by category
├── Filter by floor
├── Sort options
└── Grid view with shop cards
```

#### Step 2: View Shop Details
```
Shop List → Click Shop → Shop Detail Page
Shows:
├── Complete shop information
├── Available products
├── Current offers
├── Contact details
└── Location on floor map
```

#### Step 3: Compare Products
```
Products Page → Select 2-4 products → "Compare Selected"
Comparison includes:
├── Product specifications
├── Price comparison
├── Shop information
└── Available offers
```

#### Step 4: Browse Offers
```
Home → "Offers" → Offers Listing
Features:
├── Filter by shop
├── Sort by discount %
├── Sort by validity
└── Offer details with shop info
```

## 📁 File Structure Navigation

### **Authentication Files**
```
pages/auth/
├── login.html          # Login interface
├── register.html       # Registration form
js/
├── auth.js            # Authentication logic
├── database.js        # Data operations
└── logger.js          # Logging system
```

### **Admin Module Files**
```
pages/admin/
├── dashboard.html     # Admin control panel
├── create-shop.html   # Shop creation form
├── manage-shops.html  # Shop management
├── manage-offers.html # Offer management
└── manage-categories.html # Category management

js/admin-*
├── admin-dashboard.js # Dashboard functionality
├── admin-shop.js      # Shop operations
├── admin-offers.js    # Offer operations
└── admin-categories.js # Category operations
```

### **User Module Files**
```
pages/user/
├── shops.html         # Shop browsing
├── shop-detail.html   # Individual shop view
├── products.html      # Product browsing
├── compare.html       # Product comparison
└── offers.html       # Offers viewing

js/user-*
├── user-shops.js      # Shop browsing logic
├── user-shop-detail.js # Shop detail logic
├── user-products.js   # Product browsing
├── user-compare.js    # Product comparison
└── user-offers.js     # Offers viewing
```

## 🔄 Complete Navigation Flow

### **Admin Complete Flow**
```
1. index.html
   ↓ (Click "Sign In")
2. pages/auth/login.html
   ↓ (Login with credentials)
3. pages/admin/dashboard.html
   ↓ (Choose action)
4a. pages/admin/create-shop.html (Create new shop)
4b. pages/admin/manage-shops.html (Manage existing shops)
4c. pages/admin/manage-offers.html (Manage offers)
4d. pages/admin/manage-categories.html (Manage categories)
```

### **Customer Complete Flow**
```
1. index.html (Home)
   ↓ (Choose section)
2a. pages/user/shops.html (Browse shops)
    ↓ (Click shop)
    pages/user/shop-detail.html (View details)
2b. pages/user/products.html (Browse products)
    ↓ (Select products)
    pages/user/compare.html (Compare products)
2c. pages/user/offers.html (View offers)
```

## 🛠️ Development Workflow

### **Making Changes**
1. **UI Changes**: Edit HTML files in respective directories
2. **Style Updates**: Modify CSS files in `css/` directory
3. **Logic Changes**: Update JavaScript files in `js/` directory
4. **Testing**: Refresh browser and test functionality
5. **Debugging**: Check browser console for logs/errors

### **Key JavaScript Modules**
- `app.js` - Main application initialization
- `auth.js` - Handles all authentication logic
- `database.js` - Manages all CRUD operations
- `logger.js` - Comprehensive logging system
- `firebase-config.js` - Firebase configuration (for production)

### **Data Flow Pattern**
```
User Action → JavaScript Event → Module Function → Database Operation → UI Update
Example:
Button Click → Event Listener → auth.js.login() → database.js.read() → Redirect User
```

## 🎯 Testing Checklist

### **Admin Functionality Testing**
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should show error)
- [ ] Create new shop with all required fields
- [ ] Create shop with missing fields (validation)
- [ ] Edit existing shop
- [ ] Delete shop (with confirmation)
- [ ] Create new offer with validity dates
- [ ] View dashboard statistics
- [ ] Navigate between admin pages

### **Customer Functionality Testing**
- [ ] Browse shops listing
- [ ] Search shops by name
- [ ] Filter shops by category
- [ ] Filter shops by floor
- [ ] View shop details
- [ ] Browse products listing
- [ ] Compare 2-4 products
- [ ] Browse offers listing
- [ ] Filter offers by shop
- [ ] Navigate between user pages

### **General Testing**
- [ ] Responsive design on mobile
- [ ] Navigation menu functionality
- [ ] Page loading performance
- [ ] Error handling
- [ ] Data persistence (LocalStorage)

## 🚨 Common Issues & Solutions

### **Login Issues**
- **Problem**: Can't login with admin credentials
- **Solution**: Check browser console for errors, ensure LocalStorage is enabled

### **Data Not Saving**
- **Problem**: Created shops/offers not appearing
- **Solution**: Check browser LocalStorage, ensure no quota exceeded

### **Page Navigation Issues**
- **Problem**: Links not working
- **Solution**: Check file paths in HTML href attributes

### **Styling Issues**
- **Problem**: Layout broken on mobile
- **Solution**: Check CSS media queries, ensure responsive design

## 📊 Project Statistics

- **Total Pages**: 12 HTML files
- **JavaScript Modules**: 14 JS files
- **CSS Stylesheets**: 4 CSS files
- **User Roles**: 2 (Admin, Customer)
- **Main Features**: 6 (Auth, Shop Mgmt, Offer Mgmt, Browse, Compare, Search)

---

**Note**: This application uses LocalStorage for data persistence. For production deployment, configure Firebase in `js/firebase-config.js` and update the database operations accordingly.
