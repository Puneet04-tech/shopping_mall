# Super Mall Web Application - Workflow Documentation

## Document Information
- **Project**: Super Mall Web Application - Manage Shop's Offer, Products & Location
- **Version**: 1.0
- **Date**: January 13, 2026
- **Document Type**: User & System Workflows

---

## Table of Contents
1. [Admin Workflows](#1-admin-workflows)
2. [User/Customer Workflows](#2-usercustomer-workflows)
3. [System Workflows](#3-system-workflows)
4. [Data Flow Workflows](#4-data-flow-workflows)
5. [Error Handling Workflows](#5-error-handling-workflows)

---

## 1. Admin Workflows

### 1.1 Admin Login Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN LOGIN WORKFLOW                         │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ▼
┌─────────────────────┐
│ Navigate to         │
│ /pages/auth/        │
│ login.html          │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Display Login Form  │
│ - Email field       │
│ - Password field    │
│ - Demo credentials  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ User enters:        │
│ Email:              │
│ admin@supermall.com │
│ Password: admin123  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Click "Login"       │
│ button              │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ auth.js validates   │
│ credentials         │
└─────────┬───────────┘
          │
          ▼
     ┌────┴─────┐
     │Valid?    │
     └────┬─────┘
          │
    ┌─────┴─────┐
    │           │
    ▼ Yes       ▼ No
┌─────────┐   ┌─────────────┐
│ Create  │   │ Show error  │
│ session │   │ message     │
│ token   │   │ "Invalid    │
└────┬────┘   │ credentials"│
     │        └──────┬──────┘
     │               │
     │               ▼
     │         ┌───────────┐
     │         │ Stay on   │
     │         │ login page│
     │         └───────────┘
     │               │
     ▼               │
┌─────────┐          │
│ Log     │          │
│ login   │          │
│ success │          │
└────┬────┘          │
     │               │
     ▼               │
┌─────────┐          │
│Redirect │          │
│to Admin │          │
│Dashboard│          │
└────┬────┘          │
     │               │
     ▼               │
┌─────────┐          │
│ Load    │          │
│ stats   │          │
│ & floor │          │
│ overview│          │
└────┬────┘          │
     │               │
     ▼               │
   END              END
```

**Steps Summary:**
1. Navigate to login page
2. Enter admin credentials (admin@supermall.com / admin123)
3. Click Login button
4. System validates credentials
5. If valid: Create session, log event, redirect to dashboard
6. If invalid: Show error, stay on page

**Logger Events:**
- `logger.info('Login attempt', { email })`
- `logger.info('User logged in successfully', { userId, email })` OR
- `logger.error('Login failed', { error, email })`

---

### 1.2 Create Shop Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                  ADMIN CREATE SHOP WORKFLOW                      │
└─────────────────────────────────────────────────────────────────┘

START (Admin logged in)
  │
  ▼
┌─────────────────────┐
│ From Dashboard      │
│ click "Create Shop" │
│ button              │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Navigate to         │
│ create-shop.html    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Check Auth          │
│ (auth.js)           │
└─────────┬───────────┘
          │
          ▼
     ┌────┴─────┐
     │Admin?    │
     └────┬─────┘
          │
    ┌─────┴─────┐
    │           │
    ▼ No        ▼ Yes
┌─────────┐   ┌─────────────────┐
│Redirect │   │ Display Create  │
│to login │   │ Shop Form       │
└────┬────┘   └────────┬────────┘
     │                 │
     ▼                 ▼
    END    ┌───────────────────────┐
           │ Form Fields:          │
           │ - Shop Name *         │
           │ - Description *       │
           │ - Category (dropdown)*│
           │ - Floor (dropdown) *  │
           │ - Location *          │
           │ - Contact Number *    │
           │ - Contact Email       │
           │ - Image URL           │
           │ - Is Active (checkbox)│
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │ User fills form       │
           │ and clicks "Create"   │
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │ Validate required     │
           │ fields                │
           └───────────┬───────────┘
                       │
                       ▼
                  ┌────┴─────┐
                  │All valid?│
                  └────┬─────┘
                       │
                 ┌─────┴─────┐
                 │           │
                 ▼ No        ▼ Yes
          ┌──────────┐   ┌────────────────┐
          │ Show     │   │ Call           │
          │ error    │   │ db.create(     │
          │ message  │   │   'shops',data)│
          └────┬─────┘   └────────┬───────┘
               │                  │
               │                  ▼
               │         ┌────────────────┐
               │         │ Generate UUID  │
               │         │ Add timestamps │
               │         └────────┬───────┘
               │                  │
               │                  ▼
               │         ┌────────────────┐
               │         │ Save to        │
               │         │ LocalStorage   │
               │         └────────┬───────┘
               │                  │
               │                  ▼
               │         ┌────────────────┐
               │         │ Log success    │
               │         │ logger.info()  │
               │         └────────┬───────┘
               │                  │
               │                  ▼
               │         ┌────────────────┐
               │         │ Show success   │
               │         │ message        │
               │         └────────┬───────┘
               │                  │
               │                  ▼
               │         ┌────────────────┐
               │         │ Redirect to    │
               │         │ manage-shops   │
               │         └────────┬───────┘
               │                  │
               ▼                  ▼
              END                END
```

**Steps Summary:**
1. Click "Create Shop" from dashboard
2. System checks admin authentication
3. Display shop creation form
4. Fill required fields
5. Click "Create Shop" button
6. Validate all required fields
7. Generate shop ID and timestamps
8. Save to database (LocalStorage)
9. Log success event
10. Redirect to manage-shops page

**Logger Events:**
- `logger.info('Creating new shop', { name })`
- `logger.info('Shop created successfully', { id })` OR
- `logger.error('Failed to create shop', { error })`

---

### 1.3 Manage Shops Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                  ADMIN MANAGE SHOPS WORKFLOW                     │
└─────────────────────────────────────────────────────────────────┘

START (Admin logged in)
  │
  ▼
┌─────────────────────┐
│ Navigate to         │
│ manage-shops.html   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Check Auth          │
│ admin-shop.js       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Call loadShops()    │
│ from admin-shop.js  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ db.read('shops')    │
│ Fetch all shops     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Display filters:    │
│ - Search box        │
│ - Category filter   │
│ - Floor filter      │
│ - Sort dropdown     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Display shops table:│
│ ID | Name | Category│
│ Floor | Location    │
│ Contact | Status    │
│ Actions (Edit|Del)  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ User actions:       │
│ 1. Apply filters    │
│ 2. Search shops     │
│ 3. Sort results     │
│ 4. Edit shop        │
│ 5. Delete shop      │
└─────────┬───────────┘
          │
          ├─────► Filter Applied
          │       │
          │       ▼
          │  ┌────────────────┐
          │  │ Re-render table│
          │  │ with filtered  │
          │  │ results        │
          │  └────────────────┘
          │
          ├─────► Edit Clicked
          │       │
          │       ▼
          │  ┌────────────────┐
          │  │ Navigate to    │
          │  │ edit form      │
          │  │ (future)       │
          │  └────────────────┘
          │
          └─────► Delete Clicked
                  │
                  ▼
             ┌────────────────┐
             │ Confirm dialog │
             │ "Are you sure?"│
             └────────┬───────┘
                      │
                      ▼
                 ┌────┴─────┐
                 │Confirmed?│
                 └────┬─────┘
                      │
                ┌─────┴─────┐
                │           │
                ▼ No        ▼ Yes
          ┌──────────┐  ┌─────────────┐
          │ Cancel   │  │ Call        │
          │ action   │  │ db.delete() │
          └────┬─────┘  └──────┬──────┘
               │               │
               │               ▼
               │        ┌─────────────┐
               │        │ Remove from │
               │        │ database    │
               │        └──────┬──────┘
               │               │
               │               ▼
               │        ┌─────────────┐
               │        │ Log event   │
               │        │ logger.info │
               │        └──────┬──────┘
               │               │
               │               ▼
               │        ┌─────────────┐
               │        │ Reload shop │
               │        │ list        │
               │        └──────┬──────┘
               │               │
               ▼               ▼
              END             END
```

**Steps Summary:**
1. Navigate to manage-shops page
2. System checks admin authentication
3. Load all shops from database
4. Display filters (search, category, floor, sort)
5. Display shops in table format
6. User can apply filters/search/sort
7. User can edit or delete shops
8. For delete: Confirm → Remove from DB → Reload list

**Logger Events:**
- `logger.info('Loading shops', { filters })`
- `logger.info('Shops loaded successfully', { count })`
- `logger.info('Deleting shop', { id })`
- `logger.info('Shop deleted successfully', { id })`

---

### 1.4 Manage Offers Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                  ADMIN MANAGE OFFERS WORKFLOW                    │
└─────────────────────────────────────────────────────────────────┘

START (Admin logged in)
  │
  ▼
┌─────────────────────┐
│ Navigate to         │
│ manage-offers.html  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Load offers from    │
│ database            │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Load shops for      │
│ filter dropdown     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Display filters:    │
│ - Shop filter       │
│ - Sort by dropdown  │
│   (Discount/Date)   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Display offers      │
│ table:              │
│ Title | Shop |      │
│ Discount | Valid    │
│ From | Valid Until  │
│ Status | Actions    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ User actions:       │
│ 1. Filter by shop   │
│ 2. Sort by discount │
│ 3. Sort by date     │
│ 4. Delete offer     │
└─────────┬───────────┘
          │
          ├─────► Filter/Sort Applied
          │       │
          │       ▼
          │  ┌────────────────┐
          │  │ Re-query and   │
          │  │ re-render table│
          │  └────────────────┘
          │
          └─────► Delete Clicked
                  │
                  ▼
             ┌────────────────┐
             │ Confirm dialog │
             └────────┬───────┘
                      │
                      ▼
                 ┌────┴─────┐
                 │Confirmed?│
                 └────┬─────┘
                      │
                ┌─────┴─────┐
                │           │
                ▼ No        ▼ Yes
          ┌──────────┐  ┌─────────────┐
          │ Cancel   │  │ db.delete() │
          └────┬─────┘  └──────┬──────┘
               │               │
               │               ▼
               │        ┌─────────────┐
               │        │ Remove from │
               │        │ database    │
               │        └──────┬──────┘
               │               │
               │               ▼
               │        ┌─────────────┐
               │        │ Reload      │
               │        │ offers list │
               │        └──────┬──────┘
               │               │
               ▼               ▼
              END             END
```

**Steps Summary:**
1. Navigate to manage-offers page
2. Load all offers from database
3. Load shops for filter dropdown
4. Display filters (shop, sort)
5. Display offers table
6. User can filter by shop or sort by discount/date
7. User can delete offers with confirmation

**Logger Events:**
- `logger.info('Loading offers', { filters })`
- `logger.info('Offers loaded successfully', { count })`
- `logger.info('Deleting offer', { id })`
- `logger.info('Offer deleted successfully')`

---

### 1.5 Admin Dashboard Floor Overview Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│              ADMIN DASHBOARD FLOOR OVERVIEW WORKFLOW             │
└─────────────────────────────────────────────────────────────────┘

START (Admin on dashboard)
  │
  ▼
┌─────────────────────┐
│ Load Dashboard      │
│ Statistics          │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Call                │
│ loadFloorOverview() │
│ from admin-         │
│ dashboard.js        │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Fetch data in       │
│ parallel:           │
│ - db.read('shops')  │
│ - db.read('offers') │
│ - db.read(          │
│   'categories')     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Group shops by      │
│ floor:              │
│ - Ground Floor      │
│ - First Floor       │
│ - Second Floor      │
│ - Third Floor       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ For each floor,     │
│ calculate:          │
│ - Total shops       │
│ - Active shops      │
│ - Total offers      │
│ - Active offers     │
│ - Category breakdown│
│ - Top category      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Render floor cards: │
│ ┌─────────────────┐ │
│ │ Ground Floor    │ │
│ │ 150 shops       │ │
│ │ Active: 142     │ │
│ │ Offers: 200     │ │
│ │ Top: Electronics│ │
│ └─────────────────┘ │
│ (Repeat for all     │
│  floors)            │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Display in          │
│ responsive grid     │
│ (2-4 columns)       │
└─────────┬───────────┘
          │
          ▼
          END
```

**Steps Summary:**
1. Dashboard loads
2. Call loadFloorOverview()
3. Fetch shops, offers, categories in parallel
4. Group shops by floor
5. Calculate metrics per floor
6. Determine top category per floor
7. Render floor stat cards
8. Display in responsive grid

**Logger Events:**
- `logger.info('Loading floor overview')`
- `logger.info('Floor overview loaded', { floorCount })`
- `logger.error('Failed to load floor overview')`

---

## 2. User/Customer Workflows

### 2.1 Browse Shops Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                  USER BROWSE SHOPS WORKFLOW                      │
└─────────────────────────────────────────────────────────────────┘

START (User on website)
  │
  ▼
┌─────────────────────┐
│ Click "Shops" in    │
│ navbar              │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Navigate to         │
│ pages/user/         │
│ shops.html          │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Load shops:         │
│ user-shops.js calls │
│ db.read('shops')    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Filter to show only │
│ active shops        │
│ (isActive: true)    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Display filters:    │
│ - Search box        │
│ - Category dropdown │
│ - Floor dropdown    │
│ - Sort dropdown     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Display shops in    │
│ card grid:          │
│ ┌─────────────────┐ │
│ │ [Image]         │ │
│ │ Shop Name       │ │
│ │ Description     │ │
│ │ Location, Floor │ │
│ │ Category        │ │
│ │ Contact         │ │
│ │ [View Details]  │ │
│ └─────────────────┘ │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ User interactions:  │
│ 1. Search by name   │
│ 2. Filter category  │
│ 3. Filter floor     │
│ 4. Sort results     │
│ 5. View details     │
└─────────┬───────────┘
          │
          ├─────► Search/Filter Applied
          │       │
          │       ▼
          │  ┌────────────────┐
          │  │ Apply filters  │
          │  │ client-side    │
          │  └────────┬───────┘
          │           │
          │           ▼
          │  ┌────────────────┐
          │  │ Re-render cards│
          │  │ with filtered  │
          │  │ shops          │
          │  └────────────────┘
          │
          └─────► "View Details" Clicked
                  │
                  ▼
             ┌────────────────┐
             │ Navigate to    │
             │ shop-detail.   │
             │ html?id={id}   │
             └────────┬───────┘
                      │
                      ▼
                     END
```

**Steps Summary:**
1. Click "Shops" in navigation
2. Load all active shops from database
3. Display filters (search, category, floor, sort)
4. Display shops in responsive card grid
5. User can search, filter, or sort shops
6. Click "View Details" to see shop detail page

**Logger Events:**
- `logger.info('Loading shops for user view', { filters })`
- `logger.info('Shops loaded successfully', { count })`

---

### 2.2 View Shop Details Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                USER VIEW SHOP DETAILS WORKFLOW                   │
└─────────────────────────────────────────────────────────────────┘

START (User clicks "View Details")
  │
  ▼
┌─────────────────────┐
│ Navigate to         │
│ shop-detail.html    │
│ ?id={shopId}        │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Extract shopId from │
│ URL parameters      │
└─────────┬───────────┘
          │
          ▼
     ┌────┴─────┐
     │ shopId   │
     │ exists?  │
     └────┬─────┘
          │
    ┌─────┴─────┐
    │           │
    ▼ No        ▼ Yes
┌─────────┐   ┌─────────────────┐
│ Show    │   │ Call            │
│ error   │   │ loadShopDetail()│
│ message │   └────────┬────────┘
└────┬────┘            │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Fetch shop data │
     │        │ db.read('shops',│
     │        │  shopId)        │
     │        └────────┬────────┘
     │                 │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Display shop    │
     │        │ information:    │
     │        │ - Name          │
     │        │ - Description   │
     │        │ - Location      │
     │        │ - Floor         │
     │        │ - Category      │
     │        │ - Contact       │
     │        │ - Image         │
     │        └────────┬────────┘
     │                 │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Load shop's     │
     │        │ products:       │
     │        │ db.query(       │
     │        │  'products',    │
     │        │  {shopId})      │
     │        └────────┬────────┘
     │                 │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Display products│
     │        │ section         │
     │        └────────┬────────┘
     │                 │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Load shop's     │
     │        │ offers:         │
     │        │ db.query(       │
     │        │  'offers',      │
     │        │  {shopId})      │
     │        └────────┬────────┘
     │                 │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Display active  │
     │        │ offers section  │
     │        └────────┬────────┘
     │                 │
     ▼                 ▼
    END               END
```

**Steps Summary:**
1. User clicks "View Details" on a shop card
2. Navigate to shop-detail.html with shop ID in URL
3. Extract shop ID from URL parameters
4. Fetch shop data from database
5. Display complete shop information
6. Load and display shop's products
7. Load and display shop's active offers

**Logger Events:**
- `logger.info('Loading shop detail', { shopId })`
- `logger.info('Shop detail loaded successfully')`
- `logger.error('Failed to load shop detail', { shopId })`

---

### 2.3 Browse & Compare Products Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│           USER BROWSE & COMPARE PRODUCTS WORKFLOW                │
└─────────────────────────────────────────────────────────────────┘

START (User clicks "Products")
  │
  ▼
┌─────────────────────┐
│ Navigate to         │
│ products.html       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Load all products:  │
│ db.read('products') │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Display filters:    │
│ - Search box        │
│ - Category filter   │
│ - Shop filter       │
│ - Sort by price     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Display products:   │
│ ┌─────────────────┐ │
│ │ [Image]         │ │
│ │ Product Name    │ │
│ │ Shop Name       │ │
│ │ Price           │ │
│ │ Category        │ │
│ │ Features        │ │
│ │ [☐] Compare     │ │
│ └─────────────────┘ │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ User selects        │
│ products for        │
│ comparison:         │
│ - Check checkboxes  │
│ - Max 4 products    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Compare button      │
│ updates:            │
│ "Compare Selected   │
│  (2)"               │
└─────────┬───────────┘
          │
          ▼
     ┌────┴─────┐
     │ 2-4      │
     │ selected?│
     └────┬─────┘
          │
    ┌─────┴─────┐
    │           │
    ▼ No        ▼ Yes
┌─────────┐   ┌─────────────────┐
│ Button  │   │ Button enabled  │
│ disabled│   │ Click redirects │
└─────────┘   └────────┬────────┘
     │                 │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Navigate to     │
     │        │ compare.html    │
     │        │ ?ids=p1,p2,p3   │
     │        └────────┬────────┘
     │                 │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Extract product │
     │        │ IDs from URL    │
     │        └────────┬────────┘
     │                 │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Fetch product   │
     │        │ details for each│
     │        │ selected ID     │
     │        └────────┬────────┘
     │                 │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Display         │
     │        │ comparison      │
     │        │ table:          │
     │        │ ┌─────┬─────┐   │
     │        │ │Name │P1│P2│   │
     │        │ │Shop │..│..│   │
     │        │ │Price│..│..│   │
     │        │ │Cat  │..│..│   │
     │        │ │Feat │..│..│   │
     │        │ └─────┴─────┘   │
     │        └────────┬────────┘
     │                 │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Highlight best  │
     │        │ price in green  │
     │        └────────┬────────┘
     │                 │
     ▼                 ▼
    END               END
```

**Steps Summary:**
1. Navigate to products page
2. Load all products from database
3. Display filters and products grid
4. User selects 2-4 products via checkboxes
5. Compare button shows count and enables
6. Click compare button
7. Navigate to compare page with product IDs
8. Fetch details for selected products
9. Display side-by-side comparison table
10. Highlight best price

**Logger Events:**
- `logger.info('Loading products', { filters })`
- `logger.info('Product comparison loaded', { count })`
- `logger.warning('Not enough products selected')`

---

### 2.4 Browse Offers Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                  USER BROWSE OFFERS WORKFLOW                     │
└─────────────────────────────────────────────────────────────────┘

START (User clicks "Offers")
  │
  ▼
┌─────────────────────┐
│ Navigate to         │
│ offers.html         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Load active offers: │
│ db.query('offers',  │
│  {isActive: true})  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Display filters:    │
│ - Shop filter       │
│ - Sort by dropdown  │
│   (Discount/Date)   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Display offers:     │
│ ┌─────────────────┐ │
│ │ [15% OFF]       │ │
│ │ Offer Title     │ │
│ │ Shop Name       │ │
│ │ Description     │ │
│ │ Valid: 01/01 to │ │
│ │        01/31    │ │
│ └─────────────────┘ │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ User actions:       │
│ 1. Filter by shop   │
│ 2. Sort by discount │
│ 3. Sort by date     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Apply filters and   │
│ re-render offers    │
│ grid                │
└─────────┬───────────┘
          │
          ▼
          END
```

**Steps Summary:**
1. Click "Offers" in navigation
2. Load all active offers from database
3. Display shop filter and sort options
4. Display offers in card grid format
5. User can filter by shop or sort by discount/date
6. Results update dynamically

**Logger Events:**
- `logger.info('Loading offers for user view', { filters })`
- `logger.info('Offers loaded successfully', { count })`

---

## 3. System Workflows

### 3.1 Application Initialization Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│              APPLICATION INITIALIZATION WORKFLOW                 │
└─────────────────────────────────────────────────────────────────┘

START (Page Load)
  │
  ▼
┌─────────────────────┐
│ Browser loads HTML  │
│ page                │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Load CSS files      │
│ - style.css         │
│ - module-specific   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Load JavaScript     │
│ modules (ES6)       │
│ - logger.js         │
│ - database.js       │
│ - auth.js           │
│ - app.js            │
│ - page-specific.js  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ logger.js           │
│ initializes         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ database.js         │
│ constructor runs:   │
│ - initializeDB()    │
│ - seedDemoData()    │
└─────────┬───────────┘
          │
          ▼
     ┌────┴─────┐
     │ Data     │
     │ seeded?  │
     └────┬─────┘
          │
    ┌─────┴─────┐
    │           │
    ▼ Yes       ▼ No
┌─────────┐   ┌─────────────────┐
│ Skip    │   │ Generate 600    │
│ seeding │   │ shops, 800      │
└────┬────┘   │ products, 750   │
     │        │ offers, users   │
     │        └────────┬────────┘
     │                 │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Save to         │
     │        │ LocalStorage    │
     │        └────────┬────────┘
     │                 │
     │                 ▼
     │        ┌─────────────────┐
     │        │ Set seed flag   │
     │        └────────┬────────┘
     │                 │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ auth.js         │
     │ initializes     │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ app.js runs:    │
     │ - checkAuthState│
     │ - error handlers│
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ DOMContentLoaded│
     │ event fires     │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ Page-specific   │
     │ init runs       │
     │ (e.g., load     │
     │  shops, load    │
     │  dashboard)     │
     └────────┬────────┘
              │
              ▼
             END
```

**Steps Summary:**
1. Browser loads HTML page
2. CSS files load and apply styles
3. JavaScript modules load (ES6 imports)
4. Logger initializes
5. Database service initializes
6. Check if demo data already seeded
7. If not seeded: Generate and save demo data
8. Auth service initializes
9. App.js sets up global handlers
10. DOMContentLoaded fires
11. Page-specific initialization runs

**Logger Events:**
- `logger.info('Application initialized')`
- `logger.info('DatabaseService initialized')`
- `logger.info('Demo data seeded', { counts })`

---

### 3.2 Authentication Check Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                AUTHENTICATION CHECK WORKFLOW                     │
└─────────────────────────────────────────────────────────────────┘

START (Protected page loads)
  │
  ▼
┌─────────────────────┐
│ Call checkAuth()    │
│ function            │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ authService.        │
│ getCurrentUser()    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Read session from   │
│ localStorage        │
│ key: 'currentUser'  │
└─────────┬───────────┘
          │
          ▼
     ┌────┴─────┐
     │ Session  │
     │ exists?  │
     └────┬─────┘
          │
    ┌─────┴─────┐
    │           │
    ▼ No        ▼ Yes
┌─────────┐   ┌─────────────────┐
│ Log     │   │ Check user role │
│ warning │   │ (admin/merchant/│
└────┬────┘   │  customer)      │
     │        └────────┬────────┘
     │                 │
     │                 ▼
     │            ┌────┴─────┐
     │            │ Role     │
     │            │ matches? │
     │            └────┬─────┘
     │                 │
     │           ┌─────┴─────┐
     │           │           │
     │           ▼ No        ▼ Yes
     │     ┌──────────┐  ┌─────────┐
     │     │ Log      │  │ Allow   │
     │     │ warning  │  │ access  │
     │     └─────┬────┘  └────┬────┘
     │           │            │
     └─────┬─────┘            │
           │                  │
           ▼                  │
     ┌──────────┐             │
     │ Redirect │             │
     │ to login │             │
     │ page     │             │
     └────┬─────┘             │
          │                   │
          ▼                   ▼
         END                 END
                      (Page continues)
```

**Steps Summary:**
1. Protected page calls checkAuth()
2. Auth service retrieves current user from localStorage
3. Check if session exists
4. If no session: Log warning, redirect to login
5. If session exists: Check user role
6. If role matches page requirements: Allow access
7. If role doesn't match: Log warning, redirect to login

**Logger Events:**
- `logger.warning('Unauthorized access attempt')`
- `logger.info('User is authenticated', { userId, email })`

---

### 3.3 Data CRUD Operation Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                  DATA CRUD OPERATION WORKFLOW                    │
└─────────────────────────────────────────────────────────────────┘

START (Module calls db.create/read/update/delete)
  │
  ▼
┌─────────────────────┐
│ Determine operation │
│ type                │
└─────────┬───────────┘
          │
    ┌─────┴─────┬──────────┬──────────┐
    │           │          │          │
    ▼           ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│CREATE  │ │ READ   │ │ UPDATE │ │ DELETE │
└───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    │          │          │          │
    │          │          │          │
    ▼          │          │          │
┌─────────────────┐      │          │
│ Generate UUID   │      │          │
│ for new record  │      │          │
└────────┬────────┘      │          │
         │               │          │
         ▼               │          │
┌─────────────────┐      │          │
│ Add timestamps: │      │          │
│ - createdAt     │      │          │
└────────┬────────┘      │          │
         │               │          │
         └───────┬───────┴──────────┴──────────┐
                 │                              │
                 ▼                              │
        ┌─────────────────┐                    │
        │ Access          │                    │
        │ LocalStorage    │                    │
        └────────┬────────┘                    │
                 │                              │
                 ▼                              │
        ┌─────────────────┐                    │
        │ Perform         │                    │
        │ operation:      │                    │
        │ - setItem()     │                    │
        │ - getItem()     │                    │
        └────────┬────────┘                    │
                 │                              │
                 ▼                              │
            ┌────┴─────┐                       │
            │ Success? │                       │
            └────┬─────┘                       │
                 │                              │
           ┌─────┴─────┐                       │
           │           │                       │
           ▼ Yes       ▼ No                    │
    ┌──────────┐  ┌──────────┐                │
    │ Log      │  │ Log      │                │
    │ success  │  │ error    │                │
    └────┬─────┘  └────┬─────┘                │
         │             │                       │
         ▼             ▼                       │
    ┌──────────┐  ┌──────────┐                │
    │ Return   │  │ Return   │                │
    │ {success │  │ {success │                │
    │  true,   │  │  false,  │                │
    │  data}   │  │  error}  │                │
    └────┬─────┘  └────┬─────┘                │
         │             │                       │
         └─────────────┴───────────────────────┘
                       │
                       ▼
                      END
```

**Steps Summary:**
1. Module calls database operation
2. Determine operation type (CREATE/READ/UPDATE/DELETE)
3. For CREATE: Generate UUID, add timestamps
4. Access LocalStorage
5. Perform operation
6. Check for success/error
7. Log result
8. Return success/error object

**Logger Events:**
- `logger.info('Created new {collection} item', { id })`
- `logger.debug('Read {collection} item', { id })`
- `logger.info('Updated {collection} item', { id })`
- `logger.info('Deleted {collection} item', { id })`
- `logger.error('Failed to {operation} {collection}', { error })`

---

## 4. Data Flow Workflows

### 4.1 Shop Creation Data Flow

```
Admin → create-shop.html → admin-shop.js → database.js → LocalStorage
   │           │                 │               │             │
   │           │                 │               │             │
   │    Fill form              createShop()    create()      setItem()
   │           │                 │               │             │
   │           └─────────────────┴───────────────┴─────────────┘
   │                             │
   └─────────────────────────────┘
              Success: Redirect to manage-shops
              
Logger: All steps logged with info/error levels
```

### 4.2 User Shop Browsing Data Flow

```
User → shops.html → user-shops.js → database.js → LocalStorage
  │         │            │               │             │
  │         │            │               │             │
  │   Applies filters  loadShops()     read()      getItem()
  │         │            │               │             │
  │         │            └───────────────┴─────────────┘
  │         │            │
  │         │      Filter/sort data
  │         │      client-side
  │         │            │
  │         └────────────┘
  │         │
  │   Rendered shops grid
  │         │
  └─────────┘
      View results
      
Logger: Load and filter operations logged
```

### 4.3 Product Comparison Data Flow

```
User → products.html → user-products.js → compare.html → user-compare.js → database.js
  │         │              │                    │               │               │
  │         │              │                    │               │               │
  │  Select products   Store IDs          Extract IDs    fetchProducts()     read()
  │  (checkboxes)      in URL params     from URL           │                  │
  │         │              │                    │             │                  │
  │         └──────────────┴────────────────────┴─────────────┴──────────────────┘
  │                        │
  │              Display comparison table
  │              (side-by-side with best price highlighted)
  │                        │
  └────────────────────────┘
         View comparison
         
Logger: Product selection and comparison load logged
```

---

## 5. Error Handling Workflows

### 5.1 Global Error Handler

```
┌─────────────────────────────────────────────────────────────────┐
│                  GLOBAL ERROR HANDLER WORKFLOW                   │
└─────────────────────────────────────────────────────────────────┘

Error occurs anywhere in application
  │
  ▼
┌─────────────────────┐
│ window.onerror      │
│ event triggers      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ logger.error()      │
│ called with:        │
│ - Error message     │
│ - Stack trace       │
│ - URL               │
│ - Line number       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Error logged to     │
│ LocalStorage        │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Error shown in      │
│ browser console     │
└─────────┬───────────┘
          │
          ▼
     ┌────┴─────┐
     │ Critical │
     │ error?   │
     └────┬─────┘
          │
    ┌─────┴─────┐
    │           │
    ▼ No        ▼ Yes
┌─────────┐   ┌─────────────────┐
│ Continue│   │ Show user-      │
│ normal  │   │ friendly error  │
│ flow    │   │ message         │
└─────────┘   └─────────────────┘
     │                 │
     ▼                 ▼
    END               END
```

### 5.2 Authentication Error Handling

```
Login attempt fails
  │
  ▼
┌─────────────────────┐
│ auth.js catches     │
│ error               │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ logger.error()      │
│ 'Login failed'      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Return error object │
│ { success: false,   │
│   error: message }  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ login.html displays │
│ error message to    │
│ user                │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ User stays on login │
│ page, can retry     │
└─────────┬───────────┘
          │
          ▼
         END
```

### 5.3 Database Operation Error Handling

```
Database operation fails (e.g., read, create)
  │
  ▼
┌─────────────────────┐
│ try-catch block     │
│ catches exception   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ logger.error()      │
│ 'Failed to {op}     │
│  {collection}'      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Return error object │
│ { success: false,   │
│   error: message }  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Calling module      │
│ checks success flag │
└─────────┬───────────┘
          │
          ▼
     ┌────┴─────┐
     │ Success? │
     └────┬─────┘
          │
    ┌─────┴─────┐
    │           │
    ▼ No        ▼ Yes
┌─────────┐   ┌─────────────────┐
│ Display │   │ Process data    │
│ error   │   │ normally        │
│ message │   └─────────────────┘
└────┬────┘            │
     │                 │
     ▼                 ▼
    END               END
```

---

## Summary

This workflow documentation covers all major user interactions and system processes:

✅ **Admin Workflows**: Login, create/manage shops/offers/categories, dashboard  
✅ **User Workflows**: Browse shops/products/offers, view details, compare products  
✅ **System Workflows**: App initialization, authentication checks, CRUD operations  
✅ **Data Flows**: End-to-end data movement from UI to storage  
✅ **Error Handling**: Comprehensive error catching and logging  

All workflows include:
- Clear step-by-step flow diagrams
- Decision points and branching logic
- Logger event tracking
- Success and error paths

These workflows ensure predictable, traceable, and maintainable application behavior.

---

**Document Version**: 1.0  
**Last Updated**: January 13, 2026  
**Status**: ✅ Complete
