// Admin Shop Management Module
import authService from './auth.js';
import db from './database.js';
import logger from './logger.js';

// Check authentication
function checkAuth() {
    const user = authService.getCurrentUser();
    if (!user || (user.userType !== 'admin' && user.userType !== 'merchant')) {
        logger.warning('Unauthorized access attempt to shop management');
        window.location.href = '../auth/login.html';
        return false;
    }
    return true;
}

// Load categories for dropdown
async function loadCategories() {
    const result = await db.read('categories');
    if (result.success) {
        const categorySelect = document.getElementById('shopCategory');
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            result.data.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            });
        }

        // Load filter dropdown
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

// Load shops table
async function loadShops(filters = {}) {
    logger.info('Loading shops', filters);
    
    const result = await db.read('shops');
    const categoriesResult = await db.read('categories');
    
    if (result.success) {
        let shops = result.data;
        const categories = categoriesResult.data || [];
        
        // Apply filters
        if (filters.search) {
            shops = shops.filter(shop => 
                shop.name.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        if (filters.category) {
            shops = shops.filter(shop => shop.category === filters.category);
        }
        if (filters.floor) {
            shops = shops.filter(shop => shop.floor === filters.floor);
        }
        
        const tbody = document.getElementById('shopsTableBody');
        if (tbody) {
            if (shops.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">No shops found</td></tr>';
            } else {
                tbody.innerHTML = shops.map(shop => {
                    const category = categories.find(c => c.id === shop.category);
                    const categoryName = category ? category.name : shop.category;
                    
                    return `
                        <tr>
                            <td>${shop.name}</td>
                            <td>${categoryName}</td>
                            <td>${shop.floor}</td>
                            <td>${shop.location}</td>
                            <td>${shop.contactNumber}</td>
                            <td>
                                <span class="status-badge ${shop.isActive ? 'active' : 'inactive'}">
                                    ${shop.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>
                                <button class="action-btn edit" onclick="editShop('${shop.id}')">Edit</button>
                                <button class="action-btn delete" onclick="deleteShop('${shop.id}')">Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }
        
        logger.info('Shops loaded successfully', { count: shops.length });
    }
}

// Create shop
async function createShop(shopData) {
    logger.info('Creating new shop', { name: shopData.name });
    
    const result = await db.create('shops', shopData);
    
    if (result.success) {
        logger.info('Shop created successfully', { id: result.data.id });
        return result;
    } else {
        logger.error('Failed to create shop', { error: result.error });
        return result;
    }
}

// Delete shop
window.deleteShop = async function(id) {
    if (!confirm('Are you sure you want to delete this shop?')) {
        return;
    }
    
    logger.info('Deleting shop', { id });
    
    const result = await db.delete('shops', id);
    
    if (result.success) {
        logger.info('Shop deleted successfully', { id });
        alert('Shop deleted successfully');
        loadShops();
    } else {
        logger.error('Failed to delete shop', { error: result.error });
        alert('Failed to delete shop');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    logger.info('Shop management page loaded');
    
    // Load categories
    loadCategories();
    
    // Create shop form
    const createShopForm = document.getElementById('createShopForm');
    if (createShopForm) {
        createShopForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const shopData = {
                name: document.getElementById('shopName').value,
                description: document.getElementById('shopDescription').value,
                category: document.getElementById('shopCategory').value,
                floor: document.getElementById('shopFloor').value,
                location: document.getElementById('shopLocation').value,
                contactNumber: document.getElementById('contactNumber').value,
                contactEmail: document.getElementById('contactEmail').value,
                image: document.getElementById('shopImage').value,
                isActive: document.getElementById('isActive').checked
            };
            
            const result = await createShop(shopData);
            
            const messageDiv = document.getElementById('shopMessage');
            if (result.success) {
                messageDiv.className = 'message success';
                messageDiv.textContent = 'Shop created successfully!';
                messageDiv.style.display = 'block';
                createShopForm.reset();
                
                setTimeout(() => {
                    window.location.href = 'manage-shops.html';
                }, 1500);
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = result.error || 'Failed to create shop';
                messageDiv.style.display = 'block';
            }
        });
    }
    
    // Manage shops page
    const shopsTableBody = document.getElementById('shopsTableBody');
    if (shopsTableBody) {
        loadShops();
        
        // Filters
        document.getElementById('searchShops')?.addEventListener('input', (e) => {
            loadShops({ search: e.target.value });
        });
        
        document.getElementById('filterCategory')?.addEventListener('change', (e) => {
            loadShops({ category: e.target.value });
        });
        
        document.getElementById('filterFloor')?.addEventListener('change', (e) => {
            loadShops({ floor: e.target.value });
        });
    }
    
    // Logout handler
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        authService.logout();
        window.location.href = '../auth/login.html';
    });
});
