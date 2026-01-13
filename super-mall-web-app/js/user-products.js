// User Products Module
import db from './database.js';
import logger from './logger.js';

let selectedProducts = [];

// Load products
async function loadProducts(filters = {}) {
    logger.info('Loading products', filters);
    
    // For demo, we'll create some sample products if none exist
    let productsResult = await db.read('products');
    
    if (productsResult.success && productsResult.data.length === 0) {
        // Create sample products
        await createSampleProducts();
        productsResult = await db.read('products');
    }
    
    const shopsResult = await db.read('shops');
    const categoriesResult = await db.read('categories');
    
    if (productsResult.success) {
        let products = productsResult.data;
        const shops = shopsResult.data || [];
        const categories = categoriesResult.data || [];
        
        // Apply filters
        if (filters.search) {
            products = products.filter(p => 
                p.name.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        if (filters.category) {
            products = products.filter(p => p.category === filters.category);
        }
        if (filters.shop) {
            products = products.filter(p => p.shopId === filters.shop);
        }
        
        // Apply sorting
        if (filters.sort) {
            switch(filters.sort) {
                case 'name-asc':
                    products.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    products.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'price-asc':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    products.sort((a, b) => b.price - a.price);
                    break;
            }
        }
        
        const grid = document.getElementById('productsGrid');
        if (grid) {
            if (products.length === 0) {
                grid.innerHTML = '<p class="loading-text">No products found</p>';
            } else {
                grid.innerHTML = products.map(product => {
                    const shop = shops.find(s => s.id === product.shopId);
                    const shopName = shop ? shop.name : 'Unknown Shop';
                    const isSelected = selectedProducts.includes(product.id);
                    
                    return `
                        <div class="product-card">
                            <div class="product-compare-checkbox">
                                <input type="checkbox" 
                                       class="compare-checkbox" 
                                       data-product-id="${product.id}"
                                       ${isSelected ? 'checked' : ''}>
                            </div>
                            <img src="${product.image || 'https://via.placeholder.com/250x200?text=Product'}" 
                                 alt="${product.name}" 
                                 class="product-card-image">
                            <div class="product-card-content">
                                <h3>${product.name}</h3>
                                <p class="product-shop">🏪 ${shopName}</p>
                                <p class="product-price">$${product.price.toFixed(2)}</p>
                                <p>${product.description}</p>
                            </div>
                        </div>
                    `;
                }).join('');
                
                // Attach checkbox event listeners
                attachCheckboxListeners();
            }
        }
    }
}

// Create sample products
async function createSampleProducts() {
    const shops = await db.read('shops');
    if (shops.success && shops.data.length > 0) {
        const shopId = shops.data[0].id;
        const sampleProducts = [
            { name: 'Smartphone', price: 599.99, description: 'Latest model smartphone', shopId, category: 'cat_1' },
            { name: 'Laptop', price: 999.99, description: 'High performance laptop', shopId, category: 'cat_1' },
            { name: 'T-Shirt', price: 29.99, description: 'Cotton t-shirt', shopId, category: 'cat_2' }
        ];
        
        for (const product of sampleProducts) {
            await db.create('products', product);
        }
    }
}

// Attach checkbox listeners
function attachCheckboxListeners() {
    document.querySelectorAll('.compare-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const productId = e.target.dataset.productId;
            
            if (e.target.checked) {
                if (selectedProducts.length < 4) {
                    selectedProducts.push(productId);
                } else {
                    e.target.checked = false;
                    alert('You can compare up to 4 products only');
                }
            } else {
                selectedProducts = selectedProducts.filter(id => id !== productId);
            }
            
            updateCompareButton();
        });
    });
}

// Update compare button
function updateCompareButton() {
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
        compareBtn.textContent = `Compare Selected (${selectedProducts.length})`;
        compareBtn.disabled = selectedProducts.length < 2;
    }
}

// Load filters
async function loadFilters() {
    const categoriesResult = await db.read('categories');
    const shopsResult = await db.read('shops');
    
    if (categoriesResult.success) {
        const filterCategory = document.getElementById('filterCategory');
        if (filterCategory) {
            categoriesResult.data.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                filterCategory.appendChild(option);
            });
        }
    }
    
    if (shopsResult.success) {
        const filterShop = document.getElementById('filterShop');
        if (filterShop) {
            shopsResult.data.forEach(shop => {
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
    logger.info('Products page loaded');
    
    loadFilters();
    loadProducts();
    
    // Compare button
    document.getElementById('compareBtn')?.addEventListener('click', () => {
        if (selectedProducts.length >= 2) {
            const ids = selectedProducts.join(',');
            window.location.href = `compare.html?ids=${ids}`;
        }
    });
    
    // Filters
    ['searchProducts', 'filterCategory', 'filterShop', 'sortBy'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            const filters = {
                search: document.getElementById('searchProducts')?.value,
                category: document.getElementById('filterCategory')?.value,
                shop: document.getElementById('filterShop')?.value,
                sort: document.getElementById('sortBy')?.value
            };
            loadProducts(filters);
        });
    });
});
