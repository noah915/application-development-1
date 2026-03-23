# Task Management Database Results

## Database Representation
This database is a Task Management System. It stores users, projects that belong to users, and tasks that belong to projects.

## Tables Created
- `users`
- `projects`
- `tasks`

## Relationships
- One `user` (users.id) can have many `projects` (projects.user_id).
- One `project` (projects.id) can have many `tasks` (tasks.project_id).
- Each task is linked to one project; each project is linked to one user.

## What is a Primary Key?
A primary key is a column (or set of columns) that uniquely identifies each row in a table and cannot be null. In this database, `id` in each table is the primary key.

## What is a Foreign Key?
A foreign key is a column in one table that references the primary key in another table, enforcing referential integrity. Here, `projects.user_id` references `users.id`, and `tasks.project_id` references `projects.id`.
