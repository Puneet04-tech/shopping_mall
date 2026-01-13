// Database Service Module
import logger from './logger.js';

class DatabaseService {
    constructor() {
        this.initializeDatabase();
        this.seedDemoDataIfNeeded();
        logger.info('DatabaseService initialized');
    }

    // Initialize database structure
    initializeDatabase() {
        // Initialize collections if they don't exist
        if (!localStorage.getItem('shops')) {
            localStorage.setItem('shops', JSON.stringify([]));
        }
        if (!localStorage.getItem('categories')) {
            localStorage.setItem('categories', JSON.stringify(this.getDefaultCategories()));
        }
        if (!localStorage.getItem('offers')) {
            localStorage.setItem('offers', JSON.stringify([]));
        }
        if (!localStorage.getItem('products')) {
            localStorage.setItem('products', JSON.stringify([]));
        }
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify(this.getDefaultUsers()));
        }
        logger.info('Database initialized with default structure');
    }

    // Seed a large demo dataset (500-1000 records per collection) if empty
    seedDemoDataIfNeeded() {
        const seedKey = 'demoDataSeeded_v1';
        const alreadySeeded = localStorage.getItem(seedKey);

        if (alreadySeeded) {
            logger.debug('Demo data already seeded');
            return;
        }

        logger.info('Seeding demo data (large sample set)');

        const categories = this.getDefaultCategories();
        const floors = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'];
        const wings = ['A', 'B', 'C', 'D'];

        // Generate shops (600)
        const shopCount = 600;
        const shops = Array.from({ length: shopCount }, (_, idx) => {
            const id = idx + 1;
            const category = categories[id % categories.length];
            return {
                id: `shops_seed_${id}`,
                name: `Shop ${id} - ${category.name}`,
                description: `Reliable ${category.name.toLowerCase()} seller with curated picks (${id}).`,
                category: category.id,
                floor: floors[id % floors.length],
                location: `Shop No. ${100 + id}, Wing ${wings[id % wings.length]}`,
                contactNumber: `+91-9000${(1000 + id).toString().slice(-4)}`,
                contactEmail: `shop${id}@supermall.test`,
                image: `https://picsum.photos/seed/shop-${id}/400/300`,
                isActive: id % 9 !== 0, // keep most shops active
                createdAt: new Date(Date.now() - id * 3600_000).toISOString(),
                updatedAt: new Date(Date.now() - id * 1800_000).toISOString()
            };
        });

        // Generate products (900)
        const productCount = 900;
        const products = Array.from({ length: productCount }, (_, idx) => {
            const id = idx + 1;
            const shop = shops[id % shops.length];
            const category = categories[id % categories.length];
            const price = this.randomInRange(10, 999) + 0.99;
            return {
                id: `products_seed_${id}`,
                name: `${category.name} Item ${id}`,
                description: `High-quality ${category.name.toLowerCase()} product number ${id}.`,
                price,
                shopId: shop.id,
                category: category.id,
                image: `https://picsum.photos/seed/product-${id}/300/220`,
                features: `Feature set ${id % 5 + 1}, warranty ${(id % 3) + 1} year(s)`,
                createdAt: new Date(Date.now() - id * 2400_000).toISOString(),
                updatedAt: new Date(Date.now() - id * 1200_000).toISOString()
            };
        });

        // Generate offers (700)
        const offerCount = 700;
        const offers = Array.from({ length: offerCount }, (_, idx) => {
            const id = idx + 1;
            const shop = shops[id % shops.length];
            const category = categories[id % categories.length];
            const discount = this.randomInRange(5, 70);
            const validFrom = new Date(Date.now() - this.randomInRange(1, 5) * 24 * 3600_000);
            const validUntil = new Date(Date.now() + this.randomInRange(10, 45) * 24 * 3600_000);
            return {
                id: `offers_seed_${id}`,
                title: `${discount}% off on ${category.name} picks (${id})`,
                description: `Limited-time ${category.name.toLowerCase()} offer for Shop ${shop.name}.`,
                shopId: shop.id,
                discount,
                validFrom: validFrom.toISOString(),
                validUntil: validUntil.toISOString(),
                isActive: id % 11 !== 0, // keep majority active
                createdAt: new Date(Date.now() - id * 3000_000).toISOString(),
                updatedAt: new Date(Date.now() - id * 1500_000).toISOString()
            };
        });

        // Persist seed data in bulk to avoid repeated I/O
        localStorage.setItem('categories', JSON.stringify(categories));
        localStorage.setItem('shops', JSON.stringify(shops));
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('offers', JSON.stringify(offers));
        localStorage.setItem(seedKey, 'true');

        logger.info('Demo data seeded', {
            shops: shops.length,
            products: products.length,
            offers: offers.length,
            categories: categories.length
        });
    }

    // Generate random integer in range
    randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Get default categories
    getDefaultCategories() {
        return [
            { id: 'cat_1', name: 'Electronics', description: 'Electronic items and gadgets' },
            { id: 'cat_2', name: 'Clothing', description: 'Fashion and apparel' },
            { id: 'cat_3', name: 'Food & Beverages', description: 'Food items and drinks' },
            { id: 'cat_4', name: 'Home & Kitchen', description: 'Home appliances and kitchen items' },
            { id: 'cat_5', name: 'Books & Stationery', description: 'Books, notebooks, and stationery' }
        ];
    }

    getDefaultUsers() {
        const timestamp = new Date().toISOString();
        return [
            {
                uid: 'demo_customer',
                email: 'member@supermall.test',
                name: 'Demo Shopper',
                userType: 'customer',
                password: 'demo123',
                createdAt: timestamp,
                updatedAt: timestamp
            },
            {
                uid: 'demo_admin',
                email: 'admin@supermall.test',
                name: 'Demo Admin',
                userType: 'admin',
                password: 'demo123',
                createdAt: timestamp,
                updatedAt: timestamp
            }
        ];
    }

    // Generic CRUD operations
    async create(collection, data) {
        try {
            const items = JSON.parse(localStorage.getItem(collection) || '[]');
            const newItem = {
                ...data,
                id: `${collection}_${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            items.push(newItem);
            localStorage.setItem(collection, JSON.stringify(items));
            logger.info(`Created new ${collection} item`, { id: newItem.id });
            return { success: true, data: newItem };
        } catch (error) {
            logger.error(`Failed to create ${collection}`, { error: error.message });
            return { success: false, error: error.message };
        }
    }

    async read(collection, id = null) {
        try {
            const items = JSON.parse(localStorage.getItem(collection) || '[]');
            if (id) {
                const item = items.find(i => i.id === id);
                logger.debug(`Read ${collection} item`, { id });
                return { success: true, data: item };
            }
            logger.debug(`Read all ${collection} items`, { count: items.length });
            return { success: true, data: items };
        } catch (error) {
            logger.error(`Failed to read ${collection}`, { error: error.message });
            return { success: false, error: error.message };
        }
    }

    async update(collection, id, updates) {
        try {
            const items = JSON.parse(localStorage.getItem(collection) || '[]');
            const index = items.findIndex(i => i.id === id);
            if (index === -1) {
                throw new Error('Item not found');
            }
            items[index] = {
                ...items[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(collection, JSON.stringify(items));
            logger.info(`Updated ${collection} item`, { id });
            return { success: true, data: items[index] };
        } catch (error) {
            logger.error(`Failed to update ${collection}`, { error: error.message, id });
            return { success: false, error: error.message };
        }
    }

    async delete(collection, id) {
        try {
            const items = JSON.parse(localStorage.getItem(collection) || '[]');
            const filteredItems = items.filter(i => i.id !== id);
            localStorage.setItem(collection, JSON.stringify(filteredItems));
            logger.info(`Deleted ${collection} item`, { id });
            return { success: true };
        } catch (error) {
            logger.error(`Failed to delete ${collection}`, { error: error.message, id });
            return { success: false, error: error.message };
        }
    }

    // Query methods
    async query(collection, filters = {}) {
        try {
            let items = JSON.parse(localStorage.getItem(collection) || '[]');
            
            // Apply filters
            Object.keys(filters).forEach(key => {
                items = items.filter(item => {
                    if (typeof filters[key] === 'function') {
                        return filters[key](item[key]);
                    }
                    return item[key] === filters[key];
                });
            });

            logger.debug(`Queried ${collection}`, { filters, resultCount: items.length });
            return { success: true, data: items };
        } catch (error) {
            logger.error(`Failed to query ${collection}`, { error: error.message });
            return { success: false, error: error.message };
        }
    }

    // Statistics
    async getStats() {
        try {
            const shops = JSON.parse(localStorage.getItem('shops') || '[]');
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const offers = JSON.parse(localStorage.getItem('offers') || '[]');
            const categories = JSON.parse(localStorage.getItem('categories') || '[]');

            const stats = {
                totalShops: shops.length,
                totalProducts: products.length,
                totalOffers: offers.filter(o => o.isActive).length,
                totalCategories: categories.length,
                shopsByFloor: {
                    'Ground Floor': shops.filter(s => s.floor === 'Ground Floor').length,
                    'First Floor': shops.filter(s => s.floor === 'First Floor').length,
                    'Second Floor': shops.filter(s => s.floor === 'Second Floor').length,
                    'Third Floor': shops.filter(s => s.floor === 'Third Floor').length
                }
            };

            logger.debug('Retrieved database statistics', stats);
            return { success: true, data: stats };
        } catch (error) {
            logger.error('Failed to get stats', { error: error.message });
            return { success: false, error: error.message };
        }
    }
}

// Create singleton instance
const db = new DatabaseService();

export default db;
