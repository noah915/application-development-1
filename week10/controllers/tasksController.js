"use strict";

const pool = require("../db");

function sendError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

async function listTasks(req, res) {
  const [rows] = await pool.query("SELECT * FROM tasks");
  return res.json(rows);
}

async function getTask(req, res) {
  const taskId = Number(req.params.id);
  if (Number.isNaN(taskId)) {
    return sendError(res, 400, "INVALID_INPUT", "Task id must be a number");
  }

  const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [taskId]);
  const task = rows[0];

  if (!task) {
    return sendError(res, 404, "NOT_FOUND", `Task ${taskId} not found`);
  }

  return res.json(task);
}

async function createTask(req, res) {
  const { title, description = "", completed = false } = req.body;

  if (!title || typeof title !== "string") {
    return sendError(res, 400, "INVALID_INPUT", "'title' is required and must be a string");
  }

  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return sendError(res, 400, "INVALID_INPUT", "'title' must be a non-empty string");
  }

  const [result] = await pool.query(
    "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)",
    [trimmedTitle, description && typeof description === "string" ? description.trim() : "", completed ? 1 : 0]
  );

  const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [result.insertId]);
  return res.status(201).json(rows[0]);
}

async function updateTask(req, res) {
  const taskId = Number(req.params.id);
  if (Number.isNaN(taskId)) {
    return sendError(res, 400, "INVALID_INPUT", "Task id must be a number");
  }

  const [existingRows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [taskId]);
  if (!existingRows[0]) {
    return sendError(res, 404, "NOT_FOUND", `Task ${taskId} not found`);
  }

  const { title, description, completed } = req.body;
  const fields = [];
  const values = [];

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return sendError(res, 400, "INVALID_INPUT", "'title' must be a non-empty string");
    }
    fields.push("title = ?");
    values.push(title.trim());
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return sendError(res, 400, "INVALID_INPUT", "'description' must be a string");
    }
    fields.push("description = ?");
    values.push(description.trim());
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return sendError(res, 400, "INVALID_INPUT", "'completed' must be a boolean");
    }
    fields.push("completed = ?");
    values.push(completed ? 1 : 0);
  }

  if (fields.length > 0) {
    values.push(taskId);
    await pool.query(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`, values);
  }

  const [updatedRows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [taskId]);
  return res.json(updatedRows[0]);
}

async function deleteTask(req, res) {
  const taskId = Number(req.params.id);
  if (Number.isNaN(taskId)) {
    return sendError(res, 400, "INVALID_INPUT", "Task id must be a number");
  }

  const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [taskId]);
  if (result.affectedRows === 0) {
    return sendError(res, 404, "NOT_FOUND", `Task ${taskId} not found`);
  }

  return res.status(204).send();
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
