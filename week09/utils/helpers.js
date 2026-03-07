"use strict";

/**
 * Standardized error response helper
 * Ensures consistent error formatting across all endpoints
 *
 * @param {Object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {string} code - Error code string
 * @param {string} message - Error message
 * @returns {Object} JSON error response
 */
function sendError(res, status, code, message) {
  return res.status(status).json({
    error: { code, message }
  });
}

/**
 * Pagination parser with validation
 * Extracts page and limit from query params with defaults
 *
 * @param {Object} query - Express query object
 * @returns {Object} { page, limit } or { error } if invalid
 */
function parsePagination(query) {
  const page = query.page ? Number.parseInt(query.page, 10) : 1;
  const limit = query.limit ? Number.parseInt(query.limit, 10) : 10;

  if (Number.isNaN(page) || Number.isNaN(limit) || page < 1 || limit < 1) {
    return { error: "INVALID_PAGINATION" };
  }

  return { page, limit };
}

/**
 * Validates that a string field is non-empty
 *
 * @param {*} value - Value to validate
 * @param {string} fieldName - Name of field for error message
 * @returns {Object} { valid: true } or { error: string }
 */
function validateStringField(value, fieldName) {
  if (!value || typeof value !== "string" || !value.trim()) {
    return {
      error: `'${fieldName}' must be a non-empty string`
    };
  }
  return { valid: true };
}

/**
 * Validates that a number field is positive
 *
 * @param {*} value - Value to validate
 * @param {string} fieldName - Name of field for error message
 * @returns {Object} { valid: true } or { error: string }
 */
function validateNumberField(value, fieldName) {
  if (typeof value !== "number" || value <= 0) {
    return {
      error: `'${fieldName}' must be a positive number`
    };
  }
  return { valid: true };
}

/**
 * Validates that a boolean field is actually a boolean
 *
 * @param {*} value - Value to validate
 * @param {string} fieldName - Name of field for error message
 * @returns {Object} { valid: true } or { error: string }
 */
function validateBooleanField(value, fieldName) {
  if (typeof value !== "boolean") {
    return {
      error: `'${fieldName}' must be a boolean`
    };
  }
  return { valid: true };
}

/**
 * Checks if an item with matching property already exists in array
 *
 * @param {Array} items - Array to search
 * @param {string} property - Property name to check
 * @param {*} value - Value to find
 * @param {string} excludeId - ID to exclude from search (for updates)
 * @returns {boolean} true if duplicate exists
 */
function hasDuplicate(items, property, value, excludeId = null) {
  return items.some((item) => {
    if (excludeId && item.id === excludeId) {
      return false;
    }
    return item[property] === value;
  });
}

/**
 * Safely trims and normalizes a string value
 * Returns empty string if value is not a string
 *
 * @param {*} value - Value to normalize
 * @returns {string} Trimmed string or empty string
 */
function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Normalizes and lowercases an email for consistent comparison
 *
 * @param {*} value - Email value to normalize
 * @returns {string} Trimmed, lowercased email or empty string
 */
function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

module.exports = {
  sendError,
  parsePagination,
  validateStringField,
  validateNumberField,
  validateBooleanField,
  hasDuplicate,
  normalizeString,
  normalizeEmail
};
