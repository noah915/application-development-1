"use strict";

const API_KEY = "12345";

function apiKeyAuth(req, res, next) {
  // Only apply to POST, PATCH, DELETE - not GET
  if (req.method === "GET") {
    return next();
  }

  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or missing x-api-key header"
      }
    });
  }

  next();
}

module.exports = apiKeyAuth;
