// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password (min 8 chars, at least one number and one letter)
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password is valid
 */
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates a UUID v4
 * @param {string} uuid - UUID to validate
 * @returns {boolean} - True if UUID is valid
 */
export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to camelCase
 * @param {string} str - String to convert
 * @returns {string} - camelCased string
 */
export const toCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};

/**
 * Generates a random string of specified length
 * @param {number} length - Length of the random string
 * @returns {string} - Random string
 */
export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Truncates a string to specified length and adds ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated string
 */
export const truncate = (str, length = 50) => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + '...';
};

// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================

/**
 * Formats a date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale string
 * @returns {string} - Formatted date
 */
export const formatDate = (date, locale = 'en-US') => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formats a date to relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

/**
 * Formats duration in seconds to MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Parses duration string (MM:SS) to seconds
 * @param {string} duration - Duration string
 * @returns {number} - Duration in seconds
 */
export const parseDuration = (duration) => {
  if (!duration) return 0;
  
  const [mins, secs] = duration.split(':').map(Number);
  return (mins * 60) + (secs || 0);
};

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

/**
 * Formats a number with comma separators
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number') return '0';
  return num.toLocaleString();
};

/**
 * Formats a number to compact notation (e.g., 1.5K, 2.3M)
 * @param {number} num - Number to format
 * @returns {string} - Compact formatted number
 */
export const formatCompactNumber = (num) => {
  if (typeof num !== 'number') return '0';
  
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(num);
};

/**
 * Clamps a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped number
 */
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Generates a random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random number
 */
export const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ============================================================================
// ARRAY & OBJECT UTILITIES
// ============================================================================

/**
 * Removes duplicate objects from array based on property
 * @param {Array} array - Array to deduplicate
 * @param {string} key - Property key to check for duplicates
 * @returns {Array} - Deduplicated array
 */
export const removeDuplicates = (array, key) => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Groups array of objects by specified key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} - Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
};

/**
 * Sorts array of objects by specified key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} - Sorted array
 */
export const sortBy = (array, key, order = 'asc') => {
  return array.sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];
    
    // Handle nested keys (e.g., 'user.name')
    if (key.includes('.')) {
      aVal = key.split('.').reduce((obj, k) => obj?.[k], a);
      bVal = key.split('.').reduce((obj, k) => obj?.[k], b);
    }
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Deep clones an object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

/**
 * Merges multiple objects deeply
 * @param {...Object} objects - Objects to merge
 * @returns {Object} - Merged object
 */
export const deepMerge = (...objects) => {
  const result = {};
  
  objects.forEach(obj => {
    if (!obj) return;
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          result[key] = deepMerge(result[key] || {}, obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
    }
  });
  
  return result;
};

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
  
  toJSON() {
    return {
      error: this.name,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

/**
 * Wraps async functions for error handling
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Creates a standardized error response
 * @param {Error} error - Error object
 * @returns {Object} - Standardized error response
 */
export const createErrorResponse = (error) => {
  if (error instanceof APIError) {
    return error.toJSON();
  }
  
  return {
    error: error.name || 'InternalServerError',
    message: error.message || 'An unexpected error occurred',
    statusCode: 500,
    timestamp: new Date().toISOString()
  };
};

// ============================================================================
// LOGGING UTILITIES
// ============================================================================

/**
 * Logger utility with different levels
 */
export const logger = {
  info: (message, data = null) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || '');
  },
  
  warn: (message, data = null) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || '');
  },
  
  error: (message, error = null) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  },
  
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data || '');
    }
  }
};

// ============================================================================
// CONFIGURATION UTILITIES
// ============================================================================

/**
 * Gets environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} - Environment variable value
 */
export const getEnv = (key, defaultValue = null) => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === null) {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return defaultValue;
  }
  
  // Convert string 'true'/'false' to boolean
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  // Convert string numbers to numbers
  if (!isNaN(value) && value.trim() !== '') return Number(value);
  
  return value;
};

/**
 * Validates required environment variables
 * @param {Array} requiredVars - Array of required environment variable names
 * @throws {Error} - If any required variable is missing
 */
export const validateEnvVars = (requiredVars) => {
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// ============================================================================
// MUSIC-SPECIFIC UTILITIES
// ============================================================================

/**
 * Converts BPM to human-readable tempo description
 * @param {number} bpm - Beats per minute
 * @returns {string} - Tempo description
 */
export const bpmToTempo = (bpm) => {
  if (bpm < 60) return 'Slow';
  if (bpm < 90) return 'Moderate';
  if (bpm < 120) return 'Medium';
  if (bpm < 150) return 'Upbeat';
  return 'Fast';
};

/**
 * Formats file size in bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generates a color based on string (for avatars, etc.)
 * @param {string} str - String to generate color from
 * @returns {string} - Hex color code
 */
export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export default {
  // Validation
  isValidEmail,
  isValidPassword,
  isValidUUID,
  
  // String
  capitalize,
  toCamelCase,
  generateRandomString,
  truncate,
  
  // Date & Time
  formatDate,
  formatRelativeTime,
  formatDuration,
  parseDuration,
  
  // Number
  formatNumber,
  formatCompactNumber,
  clamp,
  randomInRange,
  
  // Array & Object
  removeDuplicates,
  groupBy,
  sortBy,
  deepClone,
  deepMerge,
  
  // Error Handling
  APIError,
  asyncHandler,
  createErrorResponse,
  
  // Logging
  logger,
  
  // Configuration
  getEnv,
  validateEnvVars,
  
  // Music-specific
  bpmToTempo,
  formatFileSize,
  stringToColor
};