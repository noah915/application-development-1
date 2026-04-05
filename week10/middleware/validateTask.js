"use strict";

function validateTask(req, res, next) {
  // Only validate on POST and PATCH
  if (req.method === "GET" || req.method === "DELETE") {
    return next();
  }

  const { title, description, completed } = req.body;

  // For POST requests, title is required
  if (req.method === "POST") {
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "'title' is required and must be a non-empty string"
        }
      });
    }
  }

  // For PATCH requests, validate only if fields are provided
  if (req.method === "PATCH") {
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_FAILED",
            message: "'title' must be a non-empty string"
          }
        });
      }
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          error: {
            code: "VALIDATION_FAILED",
            message: "'description' must be a string"
          }
        });
      }
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          error: {
            code: "VALIDATION_FAILED",
            message: "'completed' must be a boolean"
          }
        });
      }
    }
  }

  next();
}

module.exports = validateTask;
