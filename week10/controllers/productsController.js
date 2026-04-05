"use strict";

let nextProductId = 1;
const products = [];

function sendError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

function parsePagination(query) {
  const page = query.page ? Number.parseInt(query.page, 10) : 1;
  const limit = query.limit ? Number.parseInt(query.limit, 10) : 10;

  if (Number.isNaN(page) || Number.isNaN(limit) || page < 1 || limit < 1) {
    return { error: "INVALID_PAGINATION" };
  }

  return { page, limit };
}

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

  if (!name || typeof name !== "string") {
    return sendError(res, 400, "INVALID_INPUT", "'name' is required and must be a string");
  }

  if (typeof price !== "number" || price <= 0) {
    return sendError(res, 400, "INVALID_INPUT", "'price' must be a positive number");
  }

  if (!sku || typeof sku !== "string") {
    return sendError(res, 400, "INVALID_INPUT", "'sku' is required and must be a string");
  }

  const duplicateSku = products.some((item) => item.sku === sku);
  if (duplicateSku) {
    return sendError(res, 409, "CONFLICT", `Product with sku '${sku}' already exists`);
  }

  const product = {
    id: String(nextProductId++),
    name: name.trim(),
    price,
    sku: sku.trim(),
    description: typeof description === "string" ? description.trim() : ""
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
    if (typeof name !== "string" || !name.trim()) {
      return sendError(res, 400, "INVALID_INPUT", "'name' must be a non-empty string");
    }
    product.name = name.trim();
  }

  if (price !== undefined) {
    if (typeof price !== "number" || price <= 0) {
      return sendError(res, 400, "INVALID_INPUT", "'price' must be a positive number");
    }
    product.price = price;
  }

  if (sku !== undefined) {
    if (typeof sku !== "string" || !sku.trim()) {
      return sendError(res, 400, "INVALID_INPUT", "'sku' must be a non-empty string");
    }
    const duplicateSku = products.some((item) => item.sku === sku && item.id !== productId);
    if (duplicateSku) {
      return sendError(res, 409, "CONFLICT", `Product with sku '${sku}' already exists`);
    }
    product.sku = sku.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return sendError(res, 400, "INVALID_INPUT", "'description' must be a string");
    }
    product.description = description.trim();
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
