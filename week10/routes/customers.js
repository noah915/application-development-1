"use strict";

const express = require("express");
const customersController = require("../controllers/customersController");

const router = express.Router();

router.get("/", customersController.listCustomers);
router.get("/:id", customersController.getCustomer);
router.post("/", customersController.createCustomer);
router.patch("/:id", customersController.updateCustomer);
router.delete("/:id", customersController.deleteCustomer);

module.exports = router;
