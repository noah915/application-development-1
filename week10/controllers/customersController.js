"use strict";

let nextCustomerId = 1;
const customers = [];

function sendError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

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

  if (!name || typeof name !== "string") {
    return sendError(res, 400, "INVALID_INPUT", "'name' is required and must be a string");
  }

  if (!email || typeof email !== "string") {
    return sendError(res, 400, "INVALID_INPUT", "'email' is required and must be a string");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const duplicateEmail = customers.some((item) => item.email === normalizedEmail);
  if (duplicateEmail) {
    return sendError(res, 409, "CONFLICT", `Customer with email '${normalizedEmail}' already exists`);
  }

  const customer = {
    id: String(nextCustomerId++),
    name: name.trim(),
    email: normalizedEmail,
    phone: typeof phone === "string" ? phone.trim() : "",
    address: typeof address === "string" ? address.trim() : ""
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
    if (typeof name !== "string" || !name.trim()) {
      return sendError(res, 400, "INVALID_INPUT", "'name' must be a non-empty string");
    }
    customer.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== "string" || !email.trim()) {
      return sendError(res, 400, "INVALID_INPUT", "'email' must be a non-empty string");
    }
    const normalizedEmail = email.trim().toLowerCase();
    const duplicateEmail = customers.some(
      (item) => item.email === normalizedEmail && item.id !== customerId
    );
    if (duplicateEmail) {
      return sendError(res, 409, "CONFLICT", `Customer with email '${normalizedEmail}' already exists`);
    }
    customer.email = normalizedEmail;
  }

  if (phone !== undefined) {
    if (typeof phone !== "string") {
      return sendError(res, 400, "INVALID_INPUT", "'phone' must be a string");
    }
    customer.phone = phone.trim();
  }

  if (address !== undefined) {
    if (typeof address !== "string") {
      return sendError(res, 400, "INVALID_INPUT", "'address' must be a string");
    }
    customer.address = address.trim();
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
