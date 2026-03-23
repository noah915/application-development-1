-- Part 1: Create Database and Use It
CREATE DATABASE IF NOT EXISTS task_management_db;
USE task_management_db;

-- Part 3: Create Tables
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  project_id INT,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Part 4: Insert Sample Data
INSERT INTO users (name, email) VALUES
  ('Alice Johnson', 'alice.johnson@example.com'),
  ('Bob Smith', 'bob.smith@example.com'),
  ('Celine Martinez', 'celine.martinez@example.com');

INSERT INTO projects (name, description, user_id) VALUES
  ('Website Redesign', 'Refresh UI/UX of the public website', 1),
  ('Mobile App Launch', 'Initial MVP release for mobile', 2),
  ('Support Automation', 'Automate recurring support tasks', 3);

INSERT INTO tasks (title, status, project_id) VALUES
  ('Design homepage wireframe', 'completed', 1),
  ('Build login API', 'in progress', 1),
  ('Create onboarding walkthrough', 'pending', 2),
  ('Deploy beta to store', 'in progress', 2),
  ('Set up automated support tickets', 'completed', 3),
  ('Create help center template', 'pending', 3);

-- Part 5: Required Queries
-- Query 1: Show all users
SELECT * FROM users;

-- Query 2: Show all projects
SELECT * FROM projects;

-- Query 3: Show all tasks
SELECT * FROM tasks;

-- Query 4: Show tasks with project names
SELECT
  t.title AS task_title,
  t.status AS task_status,
  p.name AS project_name
FROM tasks t
JOIN projects p ON t.project_id = p.id;

-- Query 5: Show projects with user names
SELECT
  p.name AS project_name,
  u.name AS user_name
FROM projects p
JOIN users u ON p.user_id = u.id;

-- Query 6: Show only completed tasks
SELECT *
FROM tasks
WHERE status = 'completed';

-- Query 7: Sort tasks alphabetically by title
SELECT *
FROM tasks
ORDER BY title ASC;
