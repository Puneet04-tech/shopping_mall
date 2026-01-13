// User Shops Module
import db from './database.js';
import logger from './logger.js';

// Load and display shops
async function loadShops(filters = {}) {
    logger.info('Loading shops for user view', filters);
    
    const shopsResult = await db.read('shops');
    const categoriesResult = await db.read('categories');
    
    if (shopsResult.success && categoriesResult.success) {
        let shops = shopsResult.data.filter(shop => shop.isActive);
        const categories = categoriesResult.data;
        
        // Apply filters
        if (filters.search) {
            shops = shops.filter(shop => 
                shop.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                shop.description.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        if (filters.category) {
            shops = shops.filter(shop => shop.category === filters.category);
        }
        if (filters.floor) {
            shops = shops.filter(shop => shop.floor === filters.floor);
        }
        
        // Apply sorting
        if (filters.sort) {
            switch(filters.sort) {
                case 'name-asc':
                    shops.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    shops.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'newest':
                    shops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
            }
        }
        
        const grid = document.getElementById('shopsGrid');
        if (grid) {
            if (shops.length === 0) {
                grid.innerHTML = '<p class="loading-text">No shops found</p>';
            } else {
                grid.innerHTML = shops.map(shop => {
                    const category = categories.find(c => c.id === shop.category);
                    const categoryName = category ? category.name : 'General';
                    
                    return `
                        <div class="shop-card">
                            <img src="${shop.image || 'https://via.placeholder.com/300x200?text=Shop+Image'}" 
                                 alt="${shop.name}" 
                                 class="shop-card-image">
                            <div class="shop-card-content">
                                <h3>${shop.name}</h3>
                                <p>${shop.description}</p>
                                <div class="shop-card-info">
                                    <span>📍 ${shop.location} - ${shop.floor}</span>
                                    <span>🏷️ ${categoryName}</span>
                                    <span>📞 ${shop.contactNumber}</span>
                                </div>
                                <div class="shop-card-actions">
                                    <a href="shop-detail.html?id=${shop.id}" class="btn-primary">View Details</a>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
        
        logger.info('Shops loaded successfully', { count: shops.length });
    }
}

// Load categories for filter
async function loadCategoriesFilter() {
    const result = await db.read('categories');
    if (result.success) {
        const filterCategory = document.getElementById('filterCategory');
        if (filterCategory) {
            result.data.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                filterCategory.appendChild(option);
            });
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    logger.info('User shops page loaded');
    
    loadCategoriesFilter();
    loadShops();
    
    // Search filter
    document.getElementById('searchShops')?.addEventListener('input', (e) => {
        const filters = {
            search: e.target.value,
            category: document.getElementById('filterCategory')?.value,
            floor: document.getElementById('filterFloor')?.value,
            sort: document.getElementById('sortBy')?.value
        };
        loadShops(filters);
    });
    
    // Category filter
    document.getElementById('filterCategory')?.addEventListener('change', (e) => {
        const filters = {
            search: document.getElementById('searchShops')?.value,
            category: e.target.value,
            floor: document.getElementById('filterFloor')?.value,
            sort: document.getElementById('sortBy')?.value
        };
        loadShops(filters);
    });
    
    // Floor filter
    document.getElementById('filterFloor')?.addEventListener('change', (e) => {
        const filters = {
            search: document.getElementById('searchShops')?.value,
            category: document.getElementById('filterCategory')?.value,
            floor: e.target.value,
            sort: document.getElementById('sortBy')?.value
        };
        loadShops(filters);
    });
    
    // Sort
    document.getElementById('sortBy')?.addEventListener('change', (e) => {
        const filters = {
            search: document.getElementById('searchShops')?.value,
            category: document.getElementById('filterCategory')?.value,
            floor: document.getElementById('filterFloor')?.value,
            sort: e.target.value
        };
        loadShops(filters);
    });
});
