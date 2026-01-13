// User Compare Products Module
import db from './database.js';
import logger from './logger.js';

// Get product IDs from URL
function getProductIdsFromURL() {
    const params = new URLSearchParams(window.location.search);
    const idsParam = params.get('ids');
    return idsParam ? idsParam.split(',') : [];
}

// Load and compare products
async function loadComparison() {
    const productIds = getProductIdsFromURL();
    
    if (productIds.length < 2) {
        logger.warning('Not enough products selected for comparison');
        document.getElementById('compareContent').innerHTML = 
            '<p>Please select at least 2 products to compare</p>';
        return;
    }
    
    logger.info('Loading product comparison', { productIds });
    
    const productsResult = await db.read('products');
    const shopsResult = await db.read('shops');
    
    if (productsResult.success) {
        const products = productsResult.data.filter(p => productIds.includes(p.id));
        const shops = shopsResult.data || [];
        
        if (products.length === 0) {
            document.getElementById('compareContent').innerHTML = 
                '<p>Products not found</p>';
            return;
        }
        
        // Create comparison table
        const compareContainer = document.getElementById('compareContent');
        compareContainer.innerHTML = `
            <table class="compare-table">
                <thead>
                    <tr>
                        <th>Feature</th>
                        ${products.map(p => `<th>${p.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Image</strong></td>
                        ${products.map(p => `
                            <td>
                                <img src="${p.image || 'https://via.placeholder.com/100?text=Product'}" 
                                     alt="${p.name}">
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <td><strong>Price</strong></td>
                        ${products.map(p => `<td>$${p.price.toFixed(2)}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Description</strong></td>
                        ${products.map(p => `<td>${p.description}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Shop</strong></td>
                        ${products.map(p => {
                            const shop = shops.find(s => s.id === p.shopId);
                            return `<td>${shop ? shop.name : 'Unknown'}</td>`;
                        }).join('')}
                    </tr>
                    <tr>
                        <td><strong>Features</strong></td>
                        ${products.map(p => `<td>${p.features || 'N/A'}</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        `;
        
        logger.info('Product comparison loaded successfully', { count: products.length });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    logger.info('Compare products page loaded');
    loadComparison();
});
