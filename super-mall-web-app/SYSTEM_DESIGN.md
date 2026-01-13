# Super Mall Web Application - System Design Document

## Document Information
- **Project**: Super Mall Web Application - Manage Shop's Offer, Products & Location
- **Version**: 1.0
- **Date**: January 13, 2026
- **Document Type**: System Design & Architecture

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Architectural Design](#2-architectural-design)
3. [Component Design](#3-component-design)
4. [Data Design](#4-data-design)
5. [Module Design](#5-module-design)
6. [Interface Design](#6-interface-design)
7. [Security Design](#7-security-design)
8. [Deployment Architecture](#8-deployment-architecture)

---

## 1. System Overview

### 1.1 Purpose
The Super Mall Web Application is designed to bridge the digital divide for rural merchants by providing a comprehensive e-commerce platform for managing shops, products, and promotional offers while enabling customers to browse, compare, and discover local businesses.

### 1.2 Scope
- **Platform**: Web-based application (HTML5, CSS3, JavaScript)
- **Users**: Administrators, Merchants, Customers
- **Deployment**: Cloud-ready (Firebase) with LocalStorage fallback
- **Scale**: Supports 500+ shops, 1000+ products, 750+ offers

### 1.3 Key Objectives
1. Enable rural merchants to reach global customers
2. Provide intuitive shop and product management
3. Facilitate product comparison and discovery
4. Ensure secure, scalable, and maintainable architecture
5. Support offline-first development with cloud migration path

---

## 2. Architectural Design

### 2.1 High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER (Browser)                        │
│  ┌────────────────────┐  ┌────────────────────┐  ┌──────────────┐  │
│  │   Presentation     │  │   User Interface   │  │   Styling    │  │
│  │   (HTML Pages)     │  │   (JavaScript)     │  │   (CSS)      │  │
│  └────────────────────┘  └────────────────────┘  └──────────────┘  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │   HTTP/HTTPS          │
                    │   REST-like APIs      │
                    └───────────┬───────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                      APPLICATION TIER (JavaScript)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Auth       │  │   Business   │  │   Logging    │              │
│  │   Service    │  │   Logic      │  │   Service    │              │
│  │              │  │   Modules    │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Admin      │  │   User       │  │   Database   │              │
│  │   Controllers│  │   Controllers│  │   Service    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │   Data Access API     │
                    └───────────┬───────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                        DATA TIER (Storage)                           │
│  ┌──────────────────────────┐      ┌──────────────────────────┐    │
│  │   LocalStorage           │  OR  │   Firebase RTDB          │    │
│  │   (Development/Offline)  │      │   (Production/Cloud)     │    │
│  └──────────────────────────┘      └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Three-Tier Architecture Explanation

#### Tier 1: Presentation Layer (Client)
- **Responsibility**: User interface rendering and user interactions
- **Technologies**: HTML5, CSS3 (Flexbox, Grid), Responsive Design
- **Components**:
  - Static HTML pages (index.html, login.html, dashboard.html, etc.)
  - CSS stylesheets (global styles, module-specific styles)
  - Assets (images, icons, fonts)
- **Communication**: Interacts with Application Tier via JavaScript module imports

#### Tier 2: Application Layer (Business Logic)
- **Responsibility**: Business rules, data processing, authentication, logging
- **Technologies**: ES6+ JavaScript (Modules, Async/Await, Classes)
- **Components**:
  - Authentication Service (auth.js)
  - Database Service (database.js)
  - Logging Service (logger.js)
  - Admin Controllers (admin-dashboard.js, admin-shop.js, admin-offers.js, admin-categories.js)
  - User Controllers (user-shops.js, user-products.js, user-offers.js, user-compare.js, user-shop-detail.js)
- **Communication**: REST-like pattern with Data Tier through database service

#### Tier 3: Data Layer (Persistence)
- **Responsibility**: Data storage, retrieval, and persistence
- **Technologies**: LocalStorage (dev) / Firebase Realtime Database (prod)
- **Components**:
  - LocalStorage API wrapper
  - Firebase SDK integration
  - CRUD operation handlers
  - Query and filter functions
- **Communication**: Exposes async API to Application Layer

---

## 3. Component Design

### 3.1 Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                              │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐        │
│  │Landing │  │ Auth   │  │ Admin  │  │ User   │  │Compare │        │
│  │ Page   │  │ Pages  │  │ Pages  │  │ Pages  │  │ Page   │        │
│  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘        │
│      │           │           │           │           │              │
└──────┼───────────┼───────────┼───────────┼───────────┼──────────────┘
       │           │           │           │           │
       │           ▼           │           │           │
       │    ┌─────────────┐    │           │           │
       │    │   auth.js   │◄───┼───────────┼───────────┘
       │    │ (Auth       │    │           │
       │    │  Service)   │    │           │
       │    └──────┬──────┘    │           │
       │           │           │           │
       │           ▼           │           │
       │    ┌─────────────┐    │           │
       └───►│  app.js     │◄───┼───────────┘
            │ (Main App)  │    │
            └──────┬──────┘    │
                   │           │
       ┌───────────┴───────────┴──────────┐
       │                                   │
       ▼                                   ▼
┌─────────────┐                     ┌─────────────┐
│  Admin      │                     │  User       │
│  Modules    │                     │  Modules    │
├─────────────┤                     ├─────────────┤
│• dashboard  │                     │• shops      │
│• shop       │                     │• products   │
│• offers     │                     │• offers     │
│• categories │                     │• compare    │
└──────┬──────┘                     └──────┬──────┘
       │                                   │
       └───────────┬───────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │  database.js    │
         │  (DB Service)   │
         └────────┬────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
  ┌─────────────┐   ┌─────────────┐
  │LocalStorage │   │  Firebase   │
  │    API      │   │    RTDB     │
  └─────────────┘   └─────────────┘

         ┌─────────────┐
         │  logger.js  │ ◄───── (Used by all modules)
         │  (Logging)  │
         └─────────────┘
```

### 3.2 Module Dependencies

```
app.js
 ├── auth.js
 │    ├── database.js
 │    └── logger.js
 ├── database.js
 │    └── logger.js
 └── logger.js

admin-dashboard.js
 ├── auth.js
 ├── database.js
 └── logger.js

admin-shop.js
 ├── auth.js
 ├── database.js
 └── logger.js

admin-offers.js
 ├── auth.js
 ├── database.js
 └── logger.js

admin-categories.js
 ├── auth.js
 ├── database.js
 └── logger.js

user-shops.js
 ├── database.js
 └── logger.js

user-products.js
 ├── database.js
 └── logger.js

user-offers.js
 ├── database.js
 └── logger.js

user-compare.js
 ├── database.js
 └── logger.js

user-shop-detail.js
 ├── database.js
 └── logger.js
```

### 3.3 Component Responsibilities

| Component | Responsibility | Key Functions |
|-----------|---------------|---------------|
| **auth.js** | User authentication and session management | `register()`, `login()`, `logout()`, `getCurrentUser()` |
| **database.js** | Data persistence and CRUD operations | `create()`, `read()`, `update()`, `delete()`, `query()`, `getStats()` |
| **logger.js** | Application-wide logging and debugging | `info()`, `warning()`, `error()`, `debug()`, `exportLogs()` |
| **admin-dashboard.js** | Admin dashboard stats and floor overview | `loadDashboardStats()`, `loadFloorOverview()` |
| **admin-shop.js** | Shop management for admins | `loadShops()`, `createShop()`, `deleteShop()` |
| **admin-offers.js** | Offer management for admins | `loadOffers()`, `deleteOffer()` |
| **admin-categories.js** | Category management for admins | `loadCategories()`, `deleteCategory()` |
| **user-shops.js** | Shop browsing for customers | `loadShops()`, `loadCategoriesFilter()` |
| **user-products.js** | Product browsing and selection | `loadProducts()`, `updateCompareButton()` |
| **user-offers.js** | Offer browsing for customers | `loadOffers()`, `loadShopsFilter()` |
| **user-compare.js** | Product comparison view | `loadComparisonProducts()` |
| **user-shop-detail.js** | Individual shop detail view | `loadShopDetail()`, `loadShopOffers()`, `loadShopProducts()` |
| **app.js** | Main application initialization | `checkAuthState()`, global error handlers |

---

## 4. Data Design

### 4.1 Entity-Relationship Diagram

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ PK: uid         │
│    email        │
│    name         │
│    userType     │
│    password     │
│    createdAt    │
└─────────────────┘
         │
         │ (created_by)
         │
         ▼
┌─────────────────┐           ┌─────────────────┐
│     Shops       │───────────│   Categories    │
├─────────────────┤    1:1    ├─────────────────┤
│ PK: id          │  belongs  │ PK: id          │
│    name         │    to     │    name         │
│    description  │◄──────────│    description  │
│ FK: category    │           │    createdAt    │
│    floor        │           └─────────────────┘
│    location     │
│    contact#     │
│    contactEmail │
│    image        │
│    isActive     │
│    createdAt    │
└────────┬────────┘
         │
         │ 1:N
         │ (has)
         ├─────────────────┬─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    Products     │ │     Offers      │ │   (Relations)   │
├─────────────────┤ ├─────────────────┤ └─────────────────┘
│ PK: id          │ │ PK: id          │
│    name         │ │    title        │
│    description  │ │    description  │
│ FK: shopId      │ │ FK: shopId      │
│ FK: category    │ │    discount     │
│    price        │ │    validFrom    │
│    features     │ │    validUntil   │
│    createdAt    │ │    isActive     │
└─────────────────┘ │    createdAt    │
                    └─────────────────┘
```

### 4.2 Database Collections Schema

#### Users Collection
```javascript
{
  uid: String (UUID),              // Primary Key
  email: String (unique),          // User email
  name: String,                    // User full name
  userType: Enum,                  // 'admin' | 'merchant' | 'customer'
  password: String (hashed),       // Password (for LocalStorage auth)
  createdAt: Timestamp             // Creation timestamp
}
```

#### Shops Collection
```javascript
{
  id: String (UUID),               // Primary Key
  name: String,                    // Shop name
  description: String,             // Shop description
  category: String,                // Foreign Key -> Categories.id
  floor: Enum,                     // 'Ground Floor' | 'First Floor' | 'Second Floor' | 'Third Floor'
  location: String,                // Shop location (e.g., "Shop 101, Wing A")
  contactNumber: String,           // Contact phone number
  contactEmail: String,            // Contact email
  image: String (URL),             // Shop image URL
  isActive: Boolean,               // Active status flag
  createdAt: Timestamp,            // Creation timestamp
  updatedAt: Timestamp             // Last update timestamp
}
```

#### Categories Collection
```javascript
{
  id: String (UUID),               // Primary Key
  name: String,                    // Category name (e.g., "Electronics", "Fashion")
  description: String,             // Category description
  createdAt: Timestamp,            // Creation timestamp
  updatedAt: Timestamp             // Last update timestamp
}
```

#### Offers Collection
```javascript
{
  id: String (UUID),               // Primary Key
  title: String,                   // Offer title
  description: String,             // Offer description
  shopId: String,                  // Foreign Key -> Shops.id
  discount: Number,                // Discount percentage (e.g., 15 for 15%)
  validFrom: Date,                 // Offer start date
  validUntil: Date,                // Offer end date
  isActive: Boolean,               // Active status flag
  createdAt: Timestamp,            // Creation timestamp
  updatedAt: Timestamp             // Last update timestamp
}
```

#### Products Collection
```javascript
{
  id: String (UUID),               // Primary Key
  name: String,                    // Product name
  description: String,             // Product description
  shopId: String,                  // Foreign Key -> Shops.id
  category: String,                // Foreign Key -> Categories.id
  price: Number,                   // Product price
  features: Array<String>,         // Product features list
  image: String (URL),             // Product image URL
  createdAt: Timestamp             // Creation timestamp
}
```

### 4.3 Data Flow Diagram (Level 0 - Context Diagram)

```
                    ┌──────────────────┐
                    │   Administrator  │
                    └────────┬─────────┘
                             │
                             │ Manages shops/offers/categories
                             │ Views statistics
                             │
                    ┌────────▼─────────┐
         ┌──────────│                  │──────────┐
         │          │   Super Mall     │          │
         │          │   Web System     │          │
         │          │                  │          │
         │          └──────────────────┘          │
         │                                        │
         │ Browse shops                           │
         │ Compare products                       │ Stores data
         │ View offers                            │ Retrieves data
         │                                        │
┌────────▼─────────┐                   ┌──────────▼─────────┐
│    Customer      │                   │   Data Store       │
│    (User)        │                   │ (LocalStorage/     │
└──────────────────┘                   │  Firebase)         │
                                       └────────────────────┘
```

### 4.4 Data Flow Diagram (Level 1 - Admin Workflow)

```
┌──────────────┐
│ Administrator│
└──────┬───────┘
       │
       │ 1. Login credentials
       ▼
┌─────────────────┐      2. Validate      ┌─────────────────┐
│  Login Process  │──────credentials──────►│   Auth Service  │
└────────┬────────┘                        └────────┬────────┘
         │                                          │
         │ 3. Session token                         │
         ▼                                          │
┌─────────────────┐                                 │
│ Admin Dashboard │                                 │
└────────┬────────┘                                 │
         │                                          │
         │ 4. Request stats                         │
         ▼                                          │
┌─────────────────┐      5. Query data    ┌────────▼────────┐
│  Load Stats     │─────────────────────►  │ Database Service│
└────────┬────────┘                        └────────┬────────┘
         │                                          │
         │ 6. Stats data                            │
         ▼                                          │
┌─────────────────┐                                 │
│ Display Stats   │                                 │
└─────────────────┘                                 │
         │                                          │
         │ 7. Manage shop/offer/category            │
         ▼                                          │
┌─────────────────┐      8. CRUD ops      ┌────────▼────────┐
│ Management      │─────────────────────►  │  LocalStorage   │
│ Actions         │◄─────────────────────  │  / Firebase     │
└─────────────────┘      9. Confirmation   └─────────────────┘
```

### 4.5 Data Flow Diagram (Level 1 - User Workflow)

```
┌──────────────┐
│   Customer   │
└──────┬───────┘
       │
       │ 1. Browse request
       ▼
┌─────────────────┐      2. Fetch shops    ┌─────────────────┐
│  Shop Listing   │─────────────────────►  │ Database Service│
└────────┬────────┘                        └────────┬────────┘
         │                                          │
         │ 3. Shop data (filtered/sorted)           │
         ▼                                          │
┌─────────────────┐                                 │
│ Display Shops   │                                 │
└────────┬────────┘                                 │
         │                                          │
         │ 4. View shop details                     │
         ▼                                          │
┌─────────────────┐      5. Fetch details  ┌───────▼─────────┐
│ Shop Detail     │─────────────────────►  │  LocalStorage   │
└────────┬────────┘                        │  / Firebase     │
         │                                  └─────────────────┘
         │ 6. Shop info + offers + products
         ▼
┌─────────────────┐
│ Display Details │
└─────────────────┘
         │
         │ 7. Browse products
         ▼
┌─────────────────┐      8. Fetch products ┌─────────────────┐
│ Product Listing │─────────────────────►  │ Database Service│
└────────┬────────┘                        └─────────────────┘
         │
         │ 9. Product data
         ▼
┌─────────────────┐
│ Display Products│
└────────┬────────┘
         │
         │ 10. Select products (2-4)
         ▼
┌─────────────────┐      11. Fetch selected ┌─────────────────┐
│ Compare View    │──────products data────►  │ Database Service│
└────────┬────────┘                         └─────────────────┘
         │
         │ 12. Comparison data
         ▼
┌─────────────────┐
│Display Comparison│
└─────────────────┘
```

---

## 5. Module Design

### 5.1 Authentication Module (auth.js)

#### Purpose
Handles user registration, login, logout, and session management with role-based access control.

#### Class Diagram
```
┌───────────────────────────────────────────┐
│           AuthService                     │
├───────────────────────────────────────────┤
│ - currentUser: Object | null              │
│ - sessionKey: String                      │
├───────────────────────────────────────────┤
│ + constructor()                           │
│ + register(email, name, password,         │
│             userType): Promise<Object>    │
│ + login(email, password): Promise<Object> │
│ + logout(): Promise<Object>               │
│ + getCurrentUser(): Object | null         │
│ + isAuthenticated(): Boolean              │
│ - setSession(user): void                  │
│ - clearSession(): void                    │
└───────────────────────────────────────────┘
```

#### Sequence Diagram - User Login
```
User          LoginPage      AuthService     DatabaseService    LocalStorage
 │                │               │                  │                │
 │ Enter creds   │               │                  │                │
 │──────────────►│               │                  │                │
 │                │ login(email, │                  │                │
 │                │   password)  │                  │                │
 │                │──────────────►│                  │                │
 │                │               │ read('users')    │                │
 │                │               │─────────────────►│                │
 │                │               │                  │ getItem()      │
 │                │               │                  │───────────────►│
 │                │               │                  │ users data     │
 │                │               │                  │◄───────────────│
 │                │               │ users array      │                │
 │                │               │◄─────────────────│                │
 │                │               │                  │                │
 │                │               │ Validate password│                │
 │                │               │─────────────────►│                │
 │                │               │                  │                │
 │                │               │ setSession(user) │                │
 │                │               │──────────────────┤                │
 │                │               │                  │ setItem()      │
 │                │               │                  │───────────────►│
 │                │ {success,user}│                  │                │
 │                │◄──────────────│                  │                │
 │ Redirect based │               │                  │                │
 │   on role      │               │                  │                │
 │◄───────────────│               │                  │                │
```

### 5.2 Database Module (database.js)

#### Purpose
Provides abstraction layer for data persistence, supporting both LocalStorage (dev) and Firebase (prod).

#### Class Diagram
```
┌──────────────────────────────────────────────────┐
│           DatabaseService                        │
├──────────────────────────────────────────────────┤
│ - collections: Array<String>                     │
│ - seedFlag: String                               │
├──────────────────────────────────────────────────┤
│ + constructor()                                  │
│ + create(collection, data): Promise<Object>      │
│ + read(collection, id?): Promise<Object>         │
│ + update(collection, id, data): Promise<Object>  │
│ + delete(collection, id): Promise<Object>        │
│ + query(collection, filters): Promise<Object>    │
│ + getStats(): Promise<Object>                    │
│ - initializeDatabase(): void                     │
│ - seedDemoDataIfNeeded(): void                   │
│ - getDefaultCategories(): Array<Object>          │
│ - getDefaultUsers(): Array<Object>               │
│ - generateId(prefix): String                     │
└──────────────────────────────────────────────────┘
```

#### Supported Operations
- **Create**: Add new record to collection
- **Read**: Retrieve single record or all records
- **Update**: Modify existing record
- **Delete**: Remove record from collection
- **Query**: Filter records by criteria
- **GetStats**: Aggregate statistics

### 5.3 Logging Module (logger.js)

#### Purpose
Centralized logging system for tracking all user actions, errors, and system events.

#### Class Diagram
```
┌────────────────────────────────────────────┐
│              Logger                        │
├────────────────────────────────────────────┤
│ - logs: Array<Object>                      │
│ - maxLogs: Number                          │
│ - logLevel: Object                         │
├────────────────────────────────────────────┤
│ + info(message, context): void             │
│ + warning(message, context): void          │
│ + error(message, context): void            │
│ + debug(message, context): void            │
│ + exportLogs(): void                       │
│ + clearLogs(): void                        │
│ + getLogs(level?): Array<Object>           │
│ - createLogEntry(level, message,           │
│                  context): Object          │
│ - saveToLocalStorage(logEntry): void       │
│ - getTimestamp(): String                   │
└────────────────────────────────────────────┘
```

#### Log Levels
- **INFO**: General information (successful operations)
- **WARNING**: Potential issues (validation failures, not found)
- **ERROR**: Error conditions (failed operations, exceptions)
- **DEBUG**: Detailed debugging information

---

## 6. Interface Design

### 6.1 User Interface Flow Diagram

#### Admin Flow
```
┌──────────────┐
│ Login Page   │
└──────┬───────┘
       │ Valid credentials (admin)
       ▼
┌────────────────────────┐
│  Admin Dashboard       │
│  - Total Stats         │
│  - Floor Overview      │
│  - Quick Actions       │
└───┬────────────────────┘
    │
    ├────► ┌──────────────────┐
    │      │ Manage Shops     │
    │      │ - List shops     │
    │      │ - Filter/Search  │
    │      │ - Edit/Delete    │
    │      └─────┬────────────┘
    │            │
    │            ▼
    │      ┌──────────────────┐
    │      │ Create Shop      │
    │      │ - Shop Form      │
    │      └──────────────────┘
    │
    ├────► ┌──────────────────┐
    │      │ Manage Offers    │
    │      │ - List offers    │
    │      │ - Filter/Sort    │
    │      │ - Edit/Delete    │
    │      └──────────────────┘
    │
    └────► ┌──────────────────┐
           │Manage Categories │
           │ - List categories│
           │ - Add/Edit/Delete│
           └──────────────────┘
```

#### User Flow
```
┌──────────────┐
│  Home Page   │
└──────┬───────┘
       │
       ├────► ┌──────────────────┐
       │      │ Browse Shops     │
       │      │ - Grid view      │
       │      │ - Filter/Search  │
       │      └─────┬────────────┘
       │            │
       │            ▼
       │      ┌──────────────────┐
       │      │ Shop Detail      │
       │      │ - Shop info      │
       │      │ - Products       │
       │      │ - Offers         │
       │      └──────────────────┘
       │
       ├────► ┌──────────────────┐
       │      │ Browse Products  │
       │      │ - Grid view      │
       │      │ - Select (2-4)   │
       │      └─────┬────────────┘
       │            │
       │            ▼
       │      ┌──────────────────┐
       │      │ Compare Products │
       │      │ - Side-by-side   │
       │      │ - Highlight best │
       │      └──────────────────┘
       │
       └────► ┌──────────────────┐
              │ Browse Offers    │
              │ - Grid view      │
              │ - Filter by shop │
              └──────────────────┘
```

### 6.2 Page Structure

#### Common Elements
```
┌─────────────────────────────────────────────────────┐
│                    HEADER / NAVBAR                   │
│  [Logo]  [Nav Links...]           [Login/Logout]    │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│                                                      │
│                   MAIN CONTENT                       │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │        Page-Specific Content               │    │
│  │                                            │    │
│  │  - Forms                                   │    │
│  │  - Tables                                  │    │
│  │  - Cards/Grids                             │    │
│  │  - Filters/Search                          │    │
│  │                                            │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│                      FOOTER                          │
│       © 2026 Super Mall. All rights reserved.       │
└─────────────────────────────────────────────────────┘
```

### 6.3 Responsive Breakpoints

| Device | Screen Width | Layout |
|--------|-------------|--------|
| **Desktop** | ≥ 1200px | 4-column grid, horizontal nav |
| **Laptop** | 992px - 1199px | 3-column grid, horizontal nav |
| **Tablet** | 768px - 991px | 2-column grid, collapsible nav |
| **Mobile** | < 768px | 1-column stack, hamburger menu |

---

## 7. Security Design

### 7.1 Security Architecture

```
┌───────────────────────────────────────────────────────┐
│                  Security Layers                       │
├───────────────────────────────────────────────────────┤
│                                                        │
│  Layer 1: Input Validation                            │
│  ┌──────────────────────────────────────────────┐    │
│  │ - Form validation (client-side)              │    │
│  │ - Required field checks                      │    │
│  │ - Email format validation                    │    │
│  │ - Password strength requirements             │    │
│  │ - Length constraints                         │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Layer 2: Authentication                              │
│  ┌──────────────────────────────────────────────┐    │
│  │ - Email/password authentication              │    │
│  │ - Session management (localStorage)          │    │
│  │ - Password hashing (when stored)             │    │
│  │ - Session expiration                         │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Layer 3: Authorization                               │
│  ┌──────────────────────────────────────────────┐    │
│  │ - Role-based access control                  │    │
│  │ - Admin route protection                     │    │
│  │ - Permission checks per action               │    │
│  │ - Redirect unauthorized users                │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Layer 4: Data Protection                             │
│  ┌──────────────────────────────────────────────┐    │
│  │ - XSS prevention (sanitization)              │    │
│  │ - CSRF token (future: when backend added)    │    │
│  │ - Secure data transmission (HTTPS)           │    │
│  │ - LocalStorage encryption (future)           │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Layer 5: Logging & Monitoring                        │
│  ┌──────────────────────────────────────────────┐    │
│  │ - All actions logged                         │    │
│  │ - Failed login attempts tracked              │    │
│  │ - Error events captured                      │    │
│  │ - Audit trail maintained                     │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
└───────────────────────────────────────────────────────┘
```

### 7.2 Authentication Flow

```
┌────────┐      ┌──────────┐      ┌────────────┐      ┌──────────────┐
│  User  │      │  Login   │      │    Auth    │      │  Protected   │
│        │      │   Page   │      │  Service   │      │     Page     │
└───┬────┘      └────┬─────┘      └─────┬──────┘      └──────┬───────┘
    │                │                   │                    │
    │ 1. Navigate    │                   │                    │
    │───────────────►│                   │                    │
    │                │                   │                    │
    │                │ 2. Enter creds    │                    │
    │                │──────────────────►│                    │
    │                │                   │                    │
    │                │                   │ 3. Validate        │
    │                │                   │────────►           │
    │                │                   │                    │
    │                │ 4. Login success  │                    │
    │                │◄──────────────────│                    │
    │                │                   │                    │
    │                │                   │ 5. Create session  │
    │                │                   │────────►           │
    │                │                   │                    │
    │ 6. Redirect to │                   │                    │
    │    dashboard   │                   │                    │
    │───────────────────────────────────────────────────────►│
    │                │                   │                    │
    │                │                   │ 7. Check session   │
    │                │                   │◄───────────────────│
    │                │                   │                    │
    │                │                   │ 8. Session valid   │
    │                │                   │───────────────────►│
    │                │                   │                    │
    │                │                   │ 9. Allow access    │
    │◄───────────────────────────────────────────────────────│
```

### 7.3 Role-Based Access Matrix

| Resource | Admin | Merchant | Customer |
|----------|-------|----------|----------|
| **View Dashboard** | ✅ Full | ✅ Own shops | ❌ |
| **Create Shop** | ✅ | ✅ | ❌ |
| **Edit Shop** | ✅ All | ✅ Own | ❌ |
| **Delete Shop** | ✅ All | ✅ Own | ❌ |
| **Create Offer** | ✅ | ✅ Own shops | ❌ |
| **Edit Offer** | ✅ All | ✅ Own | ❌ |
| **Delete Offer** | ✅ All | ✅ Own | ❌ |
| **Manage Categories** | ✅ | ❌ | ❌ |
| **Browse Shops** | ✅ | ✅ | ✅ |
| **Browse Products** | ✅ | ✅ | ✅ |
| **Compare Products** | ✅ | ✅ | ✅ |
| **View Offers** | ✅ | ✅ | ✅ |

---

## 8. Deployment Architecture

### 8.1 Development Environment

```
┌────────────────────────────────────────────┐
│       Developer Workstation                 │
│                                             │
│  ┌────────────────────────────────────┐   │
│  │  Code Editor (VS Code)             │   │
│  └────────────────────────────────────┘   │
│                                             │
│  ┌────────────────────────────────────┐   │
│  │  Local Web Server                   │   │
│  │  (Live Server / http-server)       │   │
│  └──────────────┬─────────────────────┘   │
│                 │                           │
│                 ▼                           │
│  ┌────────────────────────────────────┐   │
│  │  Browser (Chrome/Firefox)          │   │
│  │  http://localhost:5500             │   │
│  └────────────────────────────────────┘   │
│                                             │
│  ┌────────────────────────────────────┐   │
│  │  Data: LocalStorage                │   │
│  └────────────────────────────────────┘   │
│                                             │
└────────────────────────────────────────────┘
```

### 8.2 Production Deployment (Firebase)

```
┌──────────────────────────────────────────────────────┐
│                     Internet                          │
└──────────────────┬───────────────────────────────────┘
                   │
                   │ HTTPS
                   ▼
┌──────────────────────────────────────────────────────┐
│            Firebase Hosting (CDN)                     │
│  - Static files (HTML, CSS, JS)                      │
│  - Global distribution                                │
│  - SSL/TLS certificates                               │
│  - Custom domain support                              │
└──────────────────┬───────────────────────────────────┘
                   │
                   │ Firebase SDK
                   ▼
┌──────────────────────────────────────────────────────┐
│         Firebase Services                             │
│                                                       │
│  ┌─────────────────────┐  ┌────────────────────┐    │
│  │  Authentication     │  │  Realtime Database │    │
│  │  - Email/Password   │  │  - JSON store      │    │
│  │  - OAuth (future)   │  │  - Real-time sync  │    │
│  └─────────────────────┘  └────────────────────┘    │
│                                                       │
│  ┌─────────────────────┐  ┌────────────────────┐    │
│  │  Cloud Storage      │  │  Cloud Functions   │    │
│  │  - Images           │  │  - Server logic    │    │
│  │  - Assets           │  │  - API endpoints   │    │
│  └─────────────────────┘  └────────────────────┘    │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### 8.3 Alternative Deployment Options

#### GitHub Pages
```
┌──────────────────┐
│  GitHub Repo     │
│  (gh-pages       │
│   branch)        │
└────────┬─────────┘
         │
         │ Automated build
         ▼
┌──────────────────┐
│ GitHub Pages CDN │
│ https://         │
│ user.github.io/  │
│ super-mall       │
└──────────────────┘
```

#### Netlify/Vercel
```
┌──────────────────┐
│  GitHub Repo     │
│  (main branch)   │
└────────┬─────────┘
         │
         │ Git push triggers
         │ auto-deployment
         ▼
┌──────────────────┐
│  Netlify/Vercel  │
│  Build & Deploy  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Production URL  │
│  https://        │
│  super-mall.     │
│  netlify.app     │
└──────────────────┘
```

### 8.4 Deployment Workflow

```
┌─────────────┐
│ Development │
│   (Local)   │
└──────┬──────┘
       │
       │ 1. Code & Test locally
       ▼
┌─────────────┐
│  Git Commit │
│   & Push    │
└──────┬──────┘
       │
       │ 2. Push to GitHub
       ▼
┌─────────────────┐
│  GitHub Repo    │
│  (Public)       │
└──────┬──────────┘
       │
       ├──────────► ┌─────────────────┐
       │            │  GitHub Pages   │
       │            │  (Option 1)     │
       │            └─────────────────┘
       │
       ├──────────► ┌─────────────────┐
       │            │  Netlify        │
       │            │  (Option 2)     │
       │            └─────────────────┘
       │
       └──────────► ┌─────────────────┐
                    │  Firebase       │
                    │  (Option 3)     │
                    └────────┬────────┘
                             │
                             │ 3. Deploy command
                             │    (firebase deploy)
                             ▼
                    ┌─────────────────┐
                    │  Production     │
                    │  Environment    │
                    └─────────────────┘
```

### 8.5 CI/CD Pipeline (Future Enhancement)

```
┌──────────────┐
│   Git Push   │
│   to main    │
└──────┬───────┘
       │
       │ Triggers
       ▼
┌────────────────────┐
│ GitHub Actions     │
│ (CI/CD Workflow)   │
└──────┬─────────────┘
       │
       ├─► Run Tests (Jest/Mocha)
       │
       ├─► Code Quality Check (ESLint)
       │
       ├─► Build Optimization
       │
       └─► Deploy to Hosting
           │
           ▼
    ┌─────────────┐
    │ Production  │
    │   Server    │
    └─────────────┘
```

---

## 9. Performance Optimization

### 9.1 Frontend Optimization

```
┌────────────────────────────────────────────┐
│        Frontend Optimization Layers         │
├────────────────────────────────────────────┤
│                                             │
│  Layer 1: Asset Optimization                │
│  • Minify CSS/JS (future)                  │
│  • Compress images (WebP format)           │
│  • Lazy load images                        │
│  • Use CDN for external libraries          │
│                                             │
│  Layer 2: Code Optimization                 │
│  • ES6+ modules (tree shaking ready)       │
│  • Avoid unnecessary re-renders            │
│  • Debounce search/filter inputs           │
│  • Efficient DOM manipulation              │
│                                             │
│  Layer 3: Data Optimization                 │
│  • Cache frequently accessed data          │
│  • Pagination for large lists              │
│  • Lazy load data (on-demand)              │
│  • Efficient query filters                 │
│                                             │
│  Layer 4: Rendering Optimization            │
│  • CSS Grid/Flexbox (hardware-accelerated) │
│  • Avoid layout thrashing                  │
│  • Use CSS transforms over top/left        │
│  • Minimize reflows/repaints               │
│                                             │
└────────────────────────────────────────────┘
```

### 9.2 Database Query Optimization

- **Indexing**: Use Map/Set for O(1) lookups
- **Filtering**: Apply filters early to reduce dataset
- **Sorting**: Sort only visible data
- **Caching**: Store frequently accessed data in memory
- **Batch Operations**: Group multiple reads/writes

---

## 10. Scalability Considerations

### 10.1 Horizontal Scaling (Future)

```
                    ┌──────────────┐
                    │ Load Balancer│
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐     ┌──────────┐     ┌──────────┐
    │ Server 1 │     │ Server 2 │     │ Server 3 │
    └─────┬────┘     └─────┬────┘     └─────┬────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────▼───────┐
                    │   Firebase   │
                    │   Database   │
                    └──────────────┘
```

### 10.2 Data Partitioning Strategy

- **Shops**: Partition by floor or category
- **Products**: Partition by shop or category
- **Offers**: Partition by validity period
- **Users**: Partition by userType

---

## Conclusion

This system design provides a solid foundation for the Super Mall Web Application with:

✅ **Clear Architecture**: Three-tier architecture with separation of concerns  
✅ **Modular Design**: Independent, reusable components  
✅ **Scalable Structure**: Ready for horizontal scaling and cloud deployment  
✅ **Security First**: Multi-layer security with authentication and authorization  
✅ **Performance Optimized**: Efficient data access and rendering strategies  
✅ **Cloud Ready**: Firebase integration path with LocalStorage fallback  

The design supports current requirements while providing flexibility for future enhancements such as mobile apps, real-time notifications, and advanced analytics.

---

**Document Version**: 1.0  
**Last Updated**: January 13, 2026  
**Status**: ✅ Complete
