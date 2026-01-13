// Admin Categories Management Module
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

// Load categories
async function loadCategories() {
    logger.info('Loading categories');
    
    const result = await db.read('categories');
    
    if (result.success) {
        const categories = result.data;
        const tbody = document.getElementById('categoriesTableBody');
        
        if (tbody) {
            if (categories.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="text-center">No categories found</td></tr>';
            } else {
                tbody.innerHTML = categories.map(cat => `
                    <tr>
                        <td>${cat.name}</td>
                        <td>${cat.description || '-'}</td>
                        <td>
                            <button class="action-btn edit" onclick="editCategory('${cat.id}')">Edit</button>
                            <button class="action-btn delete" onclick="deleteCategory('${cat.id}')">Delete</button>
                        </td>
                    </tr>
                `).join('');
            }
        }
        
        logger.info('Categories loaded successfully', { count: categories.length });
    }
}

// Load floor statistics
async function loadFloorStats() {
    const statsResult = await db.getStats();
    
    if (statsResult.success) {
        const stats = statsResult.data.shopsByFloor;
        document.getElementById('groundFloorShops').textContent = `${stats['Ground Floor']} Shops`;
        document.getElementById('firstFloorShops').textContent = `${stats['First Floor']} Shops`;
        document.getElementById('secondFloorShops').textContent = `${stats['Second Floor']} Shops`;
        document.getElementById('thirdFloorShops').textContent = `${stats['Third Floor']} Shops`;
    }
}

// Show category modal
window.showCategoryModal = function(categoryId = null) {
    const modal = document.getElementById('categoryModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (categoryId) {
        modalTitle.textContent = 'Edit Category';
        db.read('categories', categoryId).then(result => {
            if (result.success && result.data) {
                const category = result.data;
                document.getElementById('categoryId').value = category.id;
                document.getElementById('categoryName').value = category.name;
                document.getElementById('categoryDescription').value = category.description || '';
            }
        });
    } else {
        modalTitle.textContent = 'Add New Category';
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryId').value = '';
    }
    
    modal.classList.add('active');
};

// Delete category
window.deleteCategory = async function(id) {
    if (!confirm('Are you sure you want to delete this category?')) {
        return;
    }
    
    logger.info('Deleting category', { id });
    const result = await db.delete('categories', id);
    
    if (result.success) {
        logger.info('Category deleted successfully');
        alert('Category deleted successfully');
        loadCategories();
    } else {
        logger.error('Failed to delete category');
        alert('Failed to delete category');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    logger.info('Categories management page loaded');
    
    loadCategories();
    loadFloorStats();
    
    // Add category button
    document.getElementById('addCategoryBtn')?.addEventListener('click', () => {
        showCategoryModal();
    });
    
    // Close modal
    document.querySelector('.modal .close')?.addEventListener('click', () => {
        document.getElementById('categoryModal').classList.remove('active');
    });
    
    document.getElementById('cancelCategoryBtn')?.addEventListener('click', () => {
        document.getElementById('categoryModal').classList.remove('active');
    });
    
    // Category form submit
    document.getElementById('categoryForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const categoryId = document.getElementById('categoryId').value;
        const categoryData = {
            name: document.getElementById('categoryName').value,
            description: document.getElementById('categoryDescription').value
        };
        
        let result;
        if (categoryId) {
            result = await db.update('categories', categoryId, categoryData);
        } else {
            result = await db.create('categories', categoryData);
        }
        
        if (result.success) {
            alert(categoryId ? 'Category updated successfully' : 'Category created successfully');
            document.getElementById('categoryModal').classList.remove('active');
            loadCategories();
        } else {
            alert('Failed to save category');
        }
    });
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        authService.logout();
        window.location.href = '../auth/login.html';
    });
});

window.editCategory = showCategoryModal;
