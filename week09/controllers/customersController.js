"use strict";

const {
  sendError,
  validateStringField,
  hasDuplicate,
  normalizeString,
  normalizeEmail
} = require("../utils/helpers");

let nextCustomerId = 1;
const customers = [];

function listCustomers(req, res) {
  return res.json(customers);
}

function getCustomer(req, res) {
  const customerId = req.params.id;
  const customer = customers.find((item) => item.id === customerId);

  if (!customer) {
    return sendError(res, 404, "NOT_FOUND", `Customer ${customerId} not found`);
  }

  return res.json(customer);
}

function createCustomer(req, res) {
  const { name, email, phone, address } = req.body;

  // Validate required fields
  const nameValidation = validateStringField(name, "name");
  if (nameValidation.error) {
    return sendError(res, 400, "INVALID_INPUT", nameValidation.error);
  }

  const emailValidation = validateStringField(email, "email");
  if (emailValidation.error) {
    return sendError(res, 400, "INVALID_INPUT", emailValidation.error);
  }

  const normalizedEmail = normalizeEmail(email);
  if (hasDuplicate(customers, "email", normalizedEmail)) {
    return sendError(res, 409, "CONFLICT", `Customer with email '${normalizedEmail}' already exists`);
  }

  const customer = {
    id: String(nextCustomerId++),
    name: normalizeString(name),
    email: normalizedEmail,
    phone: normalizeString(phone),
    address: normalizeString(address)
  };

  customers.push(customer);

  return res.status(201).json(customer);
}

function updateCustomer(req, res) {
  const customerId = req.params.id;
  const customer = customers.find((item) => item.id === customerId);

  if (!customer) {
    return sendError(res, 404, "NOT_FOUND", `Customer ${customerId} not found`);
  }

  const { name, email, phone, address } = req.body;

  if (name !== undefined) {
    const validation = validateStringField(name, "name");
    if (validation.error) {
      return sendError(res, 400, "INVALID_INPUT", validation.error);
    }
    customer.name = normalizeString(name);
  }

  if (email !== undefined) {
    const validation = validateStringField(email, "email");
    if (validation.error) {
      return sendError(res, 400, "INVALID_INPUT", validation.error);
    }
    const normalizedEmail = normalizeEmail(email);
    if (hasDuplicate(customers, "email", normalizedEmail, customerId)) {
      return sendError(res, 409, "CONFLICT", `Customer with email '${normalizedEmail}' already exists`);
    }
    customer.email = normalizedEmail;
  }

  if (phone !== undefined) {
    customer.phone = normalizeString(phone);
  }

  if (address !== undefined) {
    customer.address = normalizeString(address);
  }

  return res.json(customer);
}

function deleteCustomer(req, res) {
  const customerId = req.params.id;
  const index = customers.findIndex((item) => item.id === customerId);

  if (index === -1) {
    return sendError(res, 404, "NOT_FOUND", `Customer ${customerId} not found`);
  }

  customers.splice(index, 1);
  return res.status(204).send();
}

module.exports = {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
