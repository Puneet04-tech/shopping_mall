// Authentication Module
import firebaseConfig from './firebase-config.js';
import logger from './logger.js';
import './database.js';

// Initialize Firebase (using CDN in HTML)
// This is a mock implementation - replace with actual Firebase SDK calls

class AuthService {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        logger.info('AuthService initialized');
    }

    // Register new user
    async register(email, password, name, userType) {
        try {
            logger.info('Registration attempt', { email, userType });

            // Mock user creation - Replace with actual Firebase auth
            const user = {
                uid: 'user_' + Date.now(),
                email: email,
                name: name,
                userType: userType,
                password: password,
                createdAt: new Date().toISOString()
            };

            // Save user data
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            // Set current user
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser = user;

            logger.info('User registered successfully', { userId: user.uid, email: user.email });
            return { success: true, user: user };

        } catch (error) {
            logger.error('Registration failed', { error: error.message, email });
            return { success: false, error: error.message };
        }
    }

    // Login user
    async login(email, password) {
        try {
            logger.info('Login attempt', { email });

            // Mock authentication - Replace with actual Firebase auth
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email);

            if (!user) {
                throw new Error('User not found');
            }

            if (user.password && user.password !== password) {
                throw new Error('Invalid password');
            }

            // Set current user
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser = user;

            logger.info('User logged in successfully', { userId: user.uid, email: user.email });
            return { success: true, user: user };

        } catch (error) {
            logger.error('Login failed', { error: error.message, email });
            return { success: false, error: error.message };
        }
    }

    // Logout user
    logout() {
        try {
            const userId = this.currentUser?.uid;
            logger.info('Logout initiated', { userId });

            localStorage.removeItem('currentUser');
            this.currentUser = null;

            logger.info('User logged out successfully', { userId });
            return { success: true };

        } catch (error) {
            logger.error('Logout failed', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check if user has admin role
    isAdmin() {
        return this.currentUser?.userType === 'admin';
    }

    // Check if user is merchant
    isMerchant() {
        return this.currentUser?.userType === 'merchant';
    }
}

// Create singleton instance
const authService = new AuthService();

// DOM Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    logger.info('Auth page loaded');

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            logger.info('Login form submitted');

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('loginMessage');

            const result = await authService.login(email, password);

            if (result.success) {
                messageDiv.className = 'message success';
                messageDiv.textContent = 'Login successful! Redirecting...';
                messageDiv.style.display = 'block';

                logger.info('Login successful, redirecting user');

                setTimeout(() => {
                    if (result.user.userType === 'admin' || result.user.userType === 'merchant') {
                        window.location.href = '../admin/dashboard.html';
                    } else {
                        window.location.href = '../../index.html';
                    }
                }, 1500);
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = result.error || 'Login failed. Please check your credentials.';
                messageDiv.style.display = 'block';
                logger.warning('Login failed', { error: result.error });
            }
        });
    }

    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            logger.info('Registration form submitted');

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const userType = document.getElementById('userType').value;
            const messageDiv = document.getElementById('registerMessage');

            // Validate passwords match
            if (password !== confirmPassword) {
                messageDiv.className = 'message error';
                messageDiv.textContent = 'Passwords do not match!';
                messageDiv.style.display = 'block';
                logger.warning('Password mismatch during registration');
                return;
            }

            const result = await authService.register(email, password, name, userType);

            if (result.success) {
                messageDiv.className = 'message success';
                messageDiv.textContent = 'Registration successful! Redirecting...';
                messageDiv.style.display = 'block';

                logger.info('Registration successful, redirecting user');

                setTimeout(() => {
                    if (result.user.userType === 'admin' || result.user.userType === 'merchant') {
                        window.location.href = '../admin/dashboard.html';
                    } else {
                        window.location.href = '../../index.html';
                    }
                }, 1500);
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = result.error || 'Registration failed. Please try again.';
                messageDiv.style.display = 'block';
                logger.warning('Registration failed', { error: result.error });
            }
        });
    }
});

export default authService;
