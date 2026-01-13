// User Offers Module
import db from './database.js';
import logger from './logger.js';

// Load offers
async function loadOffers(filters = {}) {
    logger.info('Loading offers for user view', filters);
    
    const offersResult = await db.read('offers');
    const shopsResult = await db.read('shops');
    
    if (offersResult.success && shopsResult.success) {
        let offers = offersResult.data.filter(offer => offer.isActive);
        const shops = shopsResult.data;
        
        // Filter out expired offers
        const now = new Date();
        offers = offers.filter(offer => new Date(offer.validUntil) >= now);
        
        // Apply filters
        if (filters.search) {
            offers = offers.filter(offer => 
                offer.title.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        if (filters.shop) {
            offers = offers.filter(offer => offer.shopId === filters.shop);
        }
        
        // Apply sorting
        if (filters.sort) {
            switch(filters.sort) {
                case 'discount-desc':
                    offers.sort((a, b) => b.discount - a.discount);
                    break;
                case 'discount-asc':
                    offers.sort((a, b) => a.discount - b.discount);
                    break;
                case 'newest':
                    offers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'ending-soon':
                    offers.sort((a, b) => new Date(a.validUntil) - new Date(b.validUntil));
                    break;
            }
        }
        
        const grid = document.getElementById('offersGrid');
        if (grid) {
            if (offers.length === 0) {
                grid.innerHTML = '<p class="loading-text">No active offers available</p>';
            } else {
                grid.innerHTML = offers.map(offer => {
                    const shop = shops.find(s => s.id === offer.shopId);
                    const shopName = shop ? shop.name : 'Unknown Shop';
                    
                    return `
                        <div class="offer-card">
                            <div class="offer-discount">${offer.discount}%</div>
                            <h3>${offer.title}</h3>
                            <p class="offer-shop">🏪 ${shopName}</p>
                            <p>${offer.description}</p>
                            <div class="offer-validity">
                                <span>Valid From: ${new Date(offer.validFrom).toLocaleDateString()}</span>
                                <span>Valid Until: ${new Date(offer.validUntil).toLocaleDateString()}</span>
                            </div>
                            ${shop ? `
                                <div style="margin-top: 1rem;">
                                    <a href="shop-detail.html?id=${shop.id}" class="btn-primary">Visit Shop</a>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('');
            }
        }
        
        logger.info('Offers loaded successfully', { count: offers.length });
    }
}

// Load shops for filter
async function loadShopsFilter() {
    const result = await db.read('shops');
    if (result.success) {
        const filterShop = document.getElementById('filterShop');
        if (filterShop) {
            result.data.forEach(shop => {
                const option = document.createElement('option');
                option.value = shop.id;
                option.textContent = shop.name;
                filterShop.appendChild(option);
            });
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    logger.info('Offers page loaded');
    
    loadShopsFilter();
    loadOffers();
    
    // Search filter
    document.getElementById('searchOffers')?.addEventListener('input', (e) => {
        const filters = {
            search: e.target.value,
            shop: document.getElementById('filterShop')?.value,
            sort: document.getElementById('sortBy')?.value
        };
        loadOffers(filters);
    });
    
    // Shop filter
    document.getElementById('filterShop')?.addEventListener('change', (e) => {
        const filters = {
            search: document.getElementById('searchOffers')?.value,
            shop: e.target.value,
            sort: document.getElementById('sortBy')?.value
        };
        loadOffers(filters);
    });
    
    // Sort
    document.getElementById('sortBy')?.addEventListener('change', (e) => {
        const filters = {
            search: document.getElementById('searchOffers')?.value,
            shop: document.getElementById('filterShop')?.value,
            sort: e.target.value
        };
        loadOffers(filters);
    });
});
