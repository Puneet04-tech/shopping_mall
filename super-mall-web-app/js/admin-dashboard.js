// Admin Dashboard Module
import authService from './auth.js';
import db from './database.js';
import logger from './logger.js';

// Check authentication
function checkAuth() {
    const user = authService.getCurrentUser();
    if (!user || (user.userType !== 'admin' && user.userType !== 'merchant')) {
        logger.warning('Unauthorized access attempt to admin dashboard');
        window.location.href = '../auth/login.html';
        return false;
    }
    return true;
}

// Load dashboard statistics
async function loadDashboardStats() {
    logger.info('Loading dashboard statistics');
    
    const result = await db.getStats();
    
    if (result.success) {
        const stats = result.data;
        
        document.getElementById('totalShops').textContent = stats.totalShops;
        document.getElementById('totalProducts').textContent = stats.totalProducts;
        document.getElementById('totalOffers').textContent = stats.totalOffers;
        document.getElementById('totalCategories').textContent = stats.totalCategories;
        
        logger.info('Dashboard statistics loaded successfully', stats);
    } else {
        logger.error('Failed to load dashboard statistics', { error: result.error });
    }
}

async function loadFloorOverview() {
    const floorGrid = document.getElementById('floorOverviewGrid');
    if (!floorGrid) return;

    floorGrid.innerHTML = '<p class="muted">Loading floor insights…</p>';

    const [shopsResult, offersResult, categoriesResult] = await Promise.all([
        db.read('shops'),
        db.read('offers'),
        db.read('categories')
    ]);

    if (!shopsResult.success || !offersResult.success) {
        floorGrid.innerHTML = '<p class="muted">Unable to load floor insights right now.</p>';
        logger.error('Failed to load floor overview data');
        return;
    }

    const shops = shopsResult.data || [];
    const offers = offersResult.data || [];
    const categories = categoriesResult.success ? categoriesResult.data : [];
    const categoriesMap = new Map(categories.map(cat => [cat.id, cat.name]));

    const floorStats = {};
    const shopLookup = new Map();

    function ensureFloor(floorName) {
        if (!floorStats[floorName]) {
            floorStats[floorName] = {
                totalShops: 0,
                activeShops: 0,
                totalOffers: 0,
                activeOffers: 0,
                categoryBreakdown: {}
            };
        }
        return floorStats[floorName];
    }

    shops.forEach(shop => {
        shopLookup.set(shop.id, shop);
        const floorName = shop.floor || 'Ground Floor';
        const stats = ensureFloor(floorName);
        stats.totalShops += 1;
        if (shop.isActive) {
            stats.activeShops += 1;
        }
        if (shop.category) {
            stats.categoryBreakdown[shop.category] = (stats.categoryBreakdown[shop.category] || 0) + 1;
        }
    });

    offers.forEach(offer => {
        const shop = shopLookup.get(offer.shopId);
        const floorName = shop?.floor || 'Ground Floor';
        const stats = ensureFloor(floorName);
        stats.totalOffers += 1;
        if (offer.isActive) {
            stats.activeOffers += 1;
        }
    });

    Object.values(floorStats).forEach(stats => {
        const entries = Object.entries(stats.categoryBreakdown);
        if (entries.length === 0) {
            stats.topCategory = null;
            return;
        }
        entries.sort((a, b) => b[1] - a[1]);
        stats.topCategory = {
            id: entries[0][0],
            name: categoriesMap.get(entries[0][0]) || 'Mixed',
            count: entries[0][1]
        };
    });

    const floorEntries = Object.entries(floorStats);
    if (floorEntries.length === 0) {
        floorGrid.innerHTML = '<p class="muted">No floor data available yet.</p>';
        return;
    }

    floorGrid.innerHTML = floorEntries.map(([floorName, stats]) => {
        const topCategoryLabel = stats.topCategory ? `${stats.topCategory.name} (${stats.topCategory.count})` : 'TBD';
        return `
            <article class="floor-stat-card">
                <div class="floor-stat-header">
                    <h4>${floorName}</h4>
                    <span class="floor-label">${stats.totalShops} shops</span>
                </div>
                <ul class="floor-metrics">
                    <li><span>Active Shops</span><strong>${stats.activeShops}</strong></li>
                    <li><span>Active Offers</span><strong>${stats.activeOffers}</strong></li>
                    <li><span>Total Offers</span><strong>${stats.totalOffers}</strong></li>
                    <li><span>Top Category</span><strong>${topCategoryLabel}</strong></li>
                </ul>
                <p class="floor-top-category">Top category: <span class="highlight">${stats.topCategory ? stats.topCategory.name : 'N/A'}</span></p>
            </article>
        `;
    }).join('');
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    logger.info('Admin dashboard page loaded');
    
    loadDashboardStats();
    loadFloorOverview();
    
    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logger.info('Logout button clicked');
            authService.logout();
            window.location.href = '../auth/login.html';
        });
    }
});
