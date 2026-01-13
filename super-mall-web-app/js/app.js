// Main Application JavaScript
import logger from './logger.js';

// Log application load
logger.info('Main application script loaded');

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (user) {
        logger.info('User is authenticated', { userId: user.uid, email: user.email });
        return user;
    } else {
        logger.debug('No authenticated user found');
        return null;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    logger.info('DOM Content Loaded - Application starting');
    
    const currentUser = checkAuth();
    
    // Update navigation based on auth status
    const loginLinks = document.querySelectorAll('a[href*="login.html"]');
    
    if (currentUser && loginLinks.length > 0) {
        loginLinks.forEach(link => {
            link.textContent = 'Dashboard';
            if (currentUser.userType === 'admin' || currentUser.userType === 'merchant') {
                link.href = 'pages/admin/dashboard.html';
            }
        });
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    logger.error('Uncaught error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
        reason: event.reason
    });
});

export { checkAuth };
