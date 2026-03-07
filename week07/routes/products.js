"use strict";

const express = require("express");
const productsController = require("../controllers/productsController");

const router = express.Router();

router.get("/", productsController.listProducts);
router.get("/:id", productsController.getProduct);
router.post("/", productsController.createProduct);
router.patch("/:id", productsController.updateProduct);
router.delete("/:id", productsController.deleteProduct);

module.exports = router;
