// Admin Offers Management Module
import authService from './auth.js';
import db from './database.js';
import logger from './logger.js';

// Check authentication
function checkAuth() {
    const user = authService.getCurrentUser();
    if (!user || (user.userType !== 'admin' && user.userType !== 'merchant')) {
        window.location.href = '../auth/login.html';
        return false;
    }
    return true;
}

// Load shops for dropdown
async function loadShopsDropdown() {
    const result = await db.read('shops');
    if (result.success) {
        const selects = ['offerShop', 'filterShop'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                const placeholder = selectId === 'filterShop' ? '' : '<option value="">Select Shop</option>';
                select.innerHTML = placeholder;
                result.data.forEach(shop => {
                    const option = document.createElement('option');
                    option.value = shop.id;
                    option.textContent = shop.name;
                    select.appendChild(option);
                });
            }
        });
    }
}

// Load offers
async function loadOffers(filters = {}) {
    logger.info('Loading offers', filters);
    
    const offersResult = await db.read('offers');
    const shopsResult = await db.read('shops');
    
    if (offersResult.success && shopsResult.success) {
        let offers = offersResult.data;
        const shops = shopsResult.data;
        
        // Apply filters
        if (filters.search) {
            offers = offers.filter(offer => 
                offer.title.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        if (filters.shop) {
            offers = offers.filter(offer => offer.shopId === filters.shop);
        }
        
        const tbody = document.getElementById('offersTableBody');
        if (tbody) {
            if (offers.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">No offers found</td></tr>';
            } else {
                tbody.innerHTML = offers.map(offer => {
                    const shop = shops.find(s => s.id === offer.shopId);
                    const shopName = shop ? shop.name : 'Unknown';
                    
                    return `
                        <tr>
                            <td>${offer.title}</td>
                            <td>${shopName}</td>
                            <td>${offer.discount}%</td>
                            <td>${new Date(offer.validFrom).toLocaleDateString()}</td>
                            <td>${new Date(offer.validUntil).toLocaleDateString()}</td>
                            <td>
                                <span class="status-badge ${offer.isActive ? 'active' : 'inactive'}">
                                    ${offer.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>
                                <button class="action-btn edit" onclick="editOffer('${offer.id}')">Edit</button>
                                <button class="action-btn delete" onclick="deleteOffer('${offer.id}')">Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }
        
        logger.info('Offers loaded successfully', { count: offers.length });
    }
}

// Show offer modal
window.showOfferModal = function(offerId = null) {
    const modal = document.getElementById('offerModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (offerId) {
        modalTitle.textContent = 'Edit Offer';
        // Load offer data
        db.read('offers', offerId).then(result => {
            if (result.success && result.data) {
                const offer = result.data;
                document.getElementById('offerId').value = offer.id;
                document.getElementById('offerTitle').value = offer.title;
                document.getElementById('offerDescription').value = offer.description;
                document.getElementById('offerShop').value = offer.shopId;
                document.getElementById('offerDiscount').value = offer.discount;
                document.getElementById('validFrom').value = offer.validFrom.split('T')[0];
                document.getElementById('validUntil').value = offer.validUntil.split('T')[0];
                document.getElementById('offerActive').checked = offer.isActive;
            }
        });
    } else {
        modalTitle.textContent = 'Add New Offer';
        document.getElementById('offerForm').reset();
        document.getElementById('offerId').value = '';
    }
    
    modal.classList.add('active');
};

// Delete offer
window.deleteOffer = async function(id) {
    if (!confirm('Are you sure you want to delete this offer?')) {
        return;
    }
    
    logger.info('Deleting offer', { id });
    const result = await db.delete('offers', id);
    
    if (result.success) {
        logger.info('Offer deleted successfully');
        alert('Offer deleted successfully');
        loadOffers();
    } else {
        logger.error('Failed to delete offer');
        alert('Failed to delete offer');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    logger.info('Offers management page loaded');
    
    loadShopsDropdown();
    loadOffers();
    
    // Add offer button
    document.getElementById('addOfferBtn')?.addEventListener('click', () => {
        showOfferModal();
    });
    
    // Close modal
    document.querySelector('.modal .close')?.addEventListener('click', () => {
        document.getElementById('offerModal').classList.remove('active');
    });
    
    document.getElementById('cancelOfferBtn')?.addEventListener('click', () => {
        document.getElementById('offerModal').classList.remove('active');
    });
    
    // Offer form submit
    document.getElementById('offerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const offerId = document.getElementById('offerId').value;
        const offerData = {
            title: document.getElementById('offerTitle').value,
            description: document.getElementById('offerDescription').value,
            shopId: document.getElementById('offerShop').value,
            discount: parseInt(document.getElementById('offerDiscount').value),
            validFrom: document.getElementById('validFrom').value,
            validUntil: document.getElementById('validUntil').value,
            isActive: document.getElementById('offerActive').checked
        };
        
        let result;
        if (offerId) {
            result = await db.update('offers', offerId, offerData);
        } else {
            result = await db.create('offers', offerData);
        }
        
        if (result.success) {
            alert(offerId ? 'Offer updated successfully' : 'Offer created successfully');
            document.getElementById('offerModal').classList.remove('active');
            loadOffers();
        } else {
            alert('Failed to save offer');
        }
    });
    
    // Filters
    document.getElementById('searchOffers')?.addEventListener('input', (e) => {
        loadOffers({ search: e.target.value });
    });
    
    document.getElementById('filterShop')?.addEventListener('change', (e) => {
        loadOffers({ shop: e.target.value });
    });
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        authService.logout();
        window.location.href = '../auth/login.html';
    });
});

window.editOffer = showOfferModal;
