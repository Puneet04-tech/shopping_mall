// User Shop Detail Module
import db from './database.js';
import logger from './logger.js';

// Get shop ID from URL
function getShopIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load shop details
async function loadShopDetail() {
    const shopId = getShopIdFromURL();
    
    if (!shopId) {
        logger.warning('No shop ID provided');
        document.getElementById('shopDetailContent').innerHTML = '<p>Shop not found</p>';
        return;
    }
    
    logger.info('Loading shop detail', { shopId });
    
    const shopResult = await db.read('shops', shopId);
    const categoriesResult = await db.read('categories');
    
    if (shopResult.success && shopResult.data) {
        const shop = shopResult.data;
        const categories = categoriesResult.data || [];
        const category = categories.find(c => c.id === shop.category);
        const categoryName = category ? category.name : 'General';
        
        const content = document.getElementById('shopDetailContent');
        content.innerHTML = `
            <div class="shop-detail-card">
                <div class="shop-detail-header">
                    <img src="${shop.image || 'https://via.placeholder.com/300x300?text=Shop+Image'}" 
                         alt="${shop.name}" 
                         class="shop-detail-image">
                    <div class="shop-detail-info">
                        <h2>${shop.name}</h2>
                        <p>${shop.description}</p>
                        <div class="shop-info-grid">
                            <div class="shop-info-item">
                                <strong>Category</strong>
                                ${categoryName}
                            </div>
                            <div class="shop-info-item">
                                <strong>Floor</strong>
                                ${shop.floor}
                            </div>
                            <div class="shop-info-item">
                                <strong>Location</strong>
                                ${shop.location}
                            </div>
                            <div class="shop-info-item">
                                <strong>Contact</strong>
                                ${shop.contactNumber}
                            </div>
                            <div class="shop-info-item">
                                <strong>Email</strong>
                                ${shop.contactEmail}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Load shop offers
        loadShopOffers(shopId);
        
        logger.info('Shop detail loaded successfully', { shopId });
    } else {
        logger.error('Failed to load shop detail', { shopId });
        document.getElementById('shopDetailContent').innerHTML = '<p>Shop not found</p>';
    }
}

// Load shop offers
async function loadShopOffers(shopId) {
    const offersResult = await db.query('offers', { shopId: shopId, isActive: true });
    
    const grid = document.getElementById('shopOffersGrid');
    
    if (offersResult.success && offersResult.data.length > 0) {
        grid.innerHTML = offersResult.data.map(offer => `
            <div class="offer-card">
                <div class="offer-discount">${offer.discount}%</div>
                <h3>${offer.title}</h3>
                <p>${offer.description}</p>
                <div class="offer-validity">
                    <span>Valid From: ${new Date(offer.validFrom).toLocaleDateString()}</span>
                    <span>Valid Until: ${new Date(offer.validUntil).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    } else {
        grid.innerHTML = '<p>No active offers at this shop</p>';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    logger.info('Shop detail page loaded');
    loadShopDetail();
});
