// Logging Utility Module
// This module provides comprehensive logging functionality for the application

class Logger {
    constructor() {
        this.logLevel = {
            INFO: 'INFO',
            WARNING: 'WARNING',
            ERROR: 'ERROR',
            DEBUG: 'DEBUG'
        };
        this.logs = [];
        this.maxLogs = 1000; // Maximum number of logs to keep in memory
    }

    // Format timestamp
    getTimestamp() {
        const now = new Date();
        return now.toISOString();
    }

    // Create log entry
    createLogEntry(level, message, context = {}) {
        const logEntry = {
            timestamp: this.getTimestamp(),
            level: level,
            message: message,
            context: context,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Add to logs array
        this.logs.push(logEntry);

        // Limit logs in memory
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Store in localStorage for persistence
        this.saveToLocalStorage(logEntry);

        return logEntry;
    }

    // Save log to localStorage
    saveToLocalStorage(logEntry) {
        try {
            const existingLogs = JSON.parse(localStorage.getItem('appLogs') || '[]');
            existingLogs.push(logEntry);

            // Keep only last 500 logs in localStorage
            if (existingLogs.length > 500) {
                existingLogs.shift();
            }

            localStorage.setItem('appLogs', JSON.stringify(existingLogs));
        } catch (error) {
            console.error('Failed to save log to localStorage:', error);
        }
    }

    // Info level logging
    info(message, context = {}) {
        const logEntry = this.createLogEntry(this.logLevel.INFO, message, context);
        console.log(`[${logEntry.timestamp}] INFO: ${message}`, context);
        return logEntry;
    }

    // Warning level logging
    warning(message, context = {}) {
        const logEntry = this.createLogEntry(this.logLevel.WARNING, message, context);
        console.warn(`[${logEntry.timestamp}] WARNING: ${message}`, context);
        return logEntry;
    }

    // Error level logging
    error(message, context = {}) {
        const logEntry = this.createLogEntry(this.logLevel.ERROR, message, context);
        console.error(`[${logEntry.timestamp}] ERROR: ${message}`, context);
        return logEntry;
    }

    // Debug level logging
    debug(message, context = {}) {
        const logEntry = this.createLogEntry(this.logLevel.DEBUG, message, context);
        console.debug(`[${logEntry.timestamp}] DEBUG: ${message}`, context);
        return logEntry;
    }

    // Get all logs
    getAllLogs() {
        return this.logs;
    }

    // Get logs from localStorage
    getStoredLogs() {
        try {
            return JSON.parse(localStorage.getItem('appLogs') || '[]');
        } catch (error) {
            console.error('Failed to retrieve logs from localStorage:', error);
            return [];
        }
    }

    // Clear all logs
    clearLogs() {
        this.logs = [];
        localStorage.removeItem('appLogs');
        console.log('All logs cleared');
    }

    // Export logs as JSON
    exportLogs() {
        const allLogs = this.getStoredLogs();
        const dataStr = JSON.stringify(allLogs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `logs_${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        console.log('Logs exported successfully');
    }

    // Get logs by level
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }

    // Get logs by date range
    getLogsByDateRange(startDate, endDate) {
        return this.logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= startDate && logDate <= endDate;
        });
    }
}

// Create singleton instance
const logger = new Logger();

// Log application start
logger.info('Application initialized', { 
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent 
});

export default logger;
