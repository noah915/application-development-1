"use strict";

const {
  sendError,
  validateStringField,
  validateBooleanField,
  normalizeString
} = require("../utils/helpers");

let nextTaskId = 1;
const tasks = [];

function listTasks(req, res) {
  return res.json(tasks);
}

function getTask(req, res) {
  const taskId = req.params.id;
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return sendError(res, 404, "NOT_FOUND", `Task ${taskId} not found`);
  }

  return res.json(task);
}

function createTask(req, res) {
  const { title, description, completed } = req.body;

  // Defensive validation (middleware validates too)
  const titleValidation = validateStringField(title, "title");
  if (titleValidation.error) {
    return sendError(res, 400, "INVALID_INPUT", titleValidation.error);
  }

  const task = {
    id: String(nextTaskId++),
    title: normalizeString(title),
    description: normalizeString(description),
    completed: typeof completed === "boolean" ? completed : false
  };

  tasks.push(task);

  return res.status(201).json(task);
}

function updateTask(req, res) {
  const taskId = req.params.id;
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return sendError(res, 404, "NOT_FOUND", `Task ${taskId} not found`);
  }

  const { title, description, completed } = req.body;

  if (title !== undefined) {
    const validation = validateStringField(title, "title");
    if (validation.error) {
      return sendError(res, 400, "INVALID_INPUT", validation.error);
    }
    task.title = normalizeString(title);
  }

  if (description !== undefined) {
    task.description = normalizeString(description);
  }

  if (completed !== undefined) {
    const validation = validateBooleanField(completed, "completed");
    if (validation.error) {
      return sendError(res, 400, "INVALID_INPUT", validation.error);
    }
    task.completed = completed;
  }

  return res.json(task);
}

function deleteTask(req, res) {
  const taskId = req.params.id;
  const index = tasks.findIndex((item) => item.id === taskId);

  if (index === -1) {
    return sendError(res, 404, "NOT_FOUND", `Task ${taskId} not found`);
  }

  tasks.splice(index, 1);
  return res.status(204).send();
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
