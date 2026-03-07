"use strict";

const {
  sendError,
  parsePagination,
  validateStringField,
  validateNumberField,
  hasDuplicate,
  normalizeString
} = require("../utils/helpers");

let nextProductId = 1;
const products = [];

function listProducts(req, res) {
  const pagination = parsePagination(req.query);
  if (pagination.error) {
    return sendError(res, 400, pagination.error, "Pagination must use positive integers for page and limit");
  }

  const { page, limit } = pagination;
  const start = (page - 1) * limit;
  const end = start + limit;

  return res.json({
    data: products.slice(start, end),
    meta: { page, limit, total: products.length }
  });
}

function getProduct(req, res) {
  const productId = req.params.id;
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return sendError(res, 404, "NOT_FOUND", `Product ${productId} not found`);
  }

  return res.json(product);
}

function createProduct(req, res) {
  const { name, price, sku, description } = req.body;

  // Validate required fields
  const nameValidation = validateStringField(name, "name");
  if (nameValidation.error) {
    return sendError(res, 400, "INVALID_INPUT", nameValidation.error);
  }

  const priceValidation = validateNumberField(price, "price");
  if (priceValidation.error) {
    return sendError(res, 400, "INVALID_INPUT", priceValidation.error);
  }

  const skuValidation = validateStringField(sku, "sku");
  if (skuValidation.error) {
    return sendError(res, 400, "INVALID_INPUT", skuValidation.error);
  }

  if (hasDuplicate(products, "sku", normalizeString(sku))) {
    return sendError(res, 409, "CONFLICT", `Product with sku '${normalizeString(sku)}' already exists`);
  }

  const product = {
    id: String(nextProductId++),
    name: normalizeString(name),
    price,
    sku: normalizeString(sku),
    description: normalizeString(description)
  };

  products.push(product);

  return res.status(201).json(product);
}

function updateProduct(req, res) {
  const productId = req.params.id;
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return sendError(res, 404, "NOT_FOUND", `Product ${productId} not found`);
  }

  const { name, price, sku, description } = req.body;

  if (name !== undefined) {
    const validation = validateStringField(name, "name");
    if (validation.error) {
      return sendError(res, 400, "INVALID_INPUT", validation.error);
    }
    product.name = normalizeString(name);
  }

  if (price !== undefined) {
    const validation = validateNumberField(price, "price");
    if (validation.error) {
      return sendError(res, 400, "INVALID_INPUT", validation.error);
    }
    product.price = price;
  }

  if (sku !== undefined) {
    const validation = validateStringField(sku, "sku");
    if (validation.error) {
      return sendError(res, 400, "INVALID_INPUT", validation.error);
    }
    if (hasDuplicate(products, "sku", normalizeString(sku), productId)) {
      return sendError(res, 409, "CONFLICT", `Product with sku '${normalizeString(sku)}' already exists`);
    }
    product.sku = normalizeString(sku);
  }

  if (description !== undefined) {
    product.description = normalizeString(description);
  }

  return res.json(product);
}

function deleteProduct(req, res) {
  const productId = req.params.id;
  const index = products.findIndex((item) => item.id === productId);

  if (index === -1) {
    return sendError(res, 404, "NOT_FOUND", `Product ${productId} not found`);
  }

  products.splice(index, 1);
  return res.status(204).send();
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
