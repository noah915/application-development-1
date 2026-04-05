"use strict";

const express = require("express");
const tasksController = require("../controllers/tasksController");
const validateTask = require("../middleware/validateTask");

const router = express.Router();

router.get("/", tasksController.listTasks);
router.get("/:id", tasksController.getTask);
router.post("/", validateTask, tasksController.createTask);
router.patch("/:id", validateTask, tasksController.updateTask);
router.delete("/:id", tasksController.deleteTask);

module.exports = router;
