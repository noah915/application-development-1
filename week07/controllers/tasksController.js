"use strict";

let nextTaskId = 1;
const tasks = [];

function sendError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

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

  // Note: Validation happens in middleware, but we also validate here
  if (!title || typeof title !== "string") {
    return sendError(res, 400, "INVALID_INPUT", "'title' is required and must be a string");
  }

  const task = {
    id: String(nextTaskId++),
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : "",
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
    if (typeof title !== "string" || !title.trim()) {
      return sendError(res, 400, "INVALID_INPUT", "'title' must be a non-empty string");
    }
    task.title = title.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return sendError(res, 400, "INVALID_INPUT", "'description' must be a string");
    }
    task.description = description.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return sendError(res, 400, "INVALID_INPUT", "'completed' must be a boolean");
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
