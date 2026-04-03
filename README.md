# Task Manager Assignment

A Node.js + Express task management app with MongoDB persistence, CRUD APIs, validation, and a browser UI.

## Features

- Create, view, edit, complete, and delete tasks
- MongoDB persistence
- Validation for required titles
- Prevents completing an already completed task
- Optional due date and category fields
- Graceful JSON error responses
- Jest + Supertest API tests

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Jest + Supertest

## Project Structure

```text
src/
  app.js                    Express app setup
  server.js                 Server bootstrap
  db/
    database.js             MongoDB connection setup
    taskRepository.js       Task persistence queries
  models/
    taskModel.js            Mongoose Task schema
  middleware/
    errorHandler.js         Central API error formatter
    notFoundHandler.js      404 handler
  routes/
    taskRoutes.js           Task CRUD routes and validation
  public/
    index.html              Browser UI
    styles.css              UI styles
    app.js                  Frontend API integration
tests/
  taskRoutes.test.js        API test coverage
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Start the application:

Create a `.env` file if you want a custom MongoDB connection string:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/task-manager-assignment
PORT=3000
```

Then start the server:

```bash
npm run dev
```

3. Open the app in your browser:

```text
http://localhost:3000
```

4. Run tests:

```bash
npm test
```

## API Endpoints

- `GET /api/tasks` - list all tasks
- `POST /api/tasks` - create a task
- `PUT /api/tasks/:id` - update task title, description, due date, or category
- `PATCH /api/tasks/:id/complete` - mark a task as completed
- `DELETE /api/tasks/:id` - delete a task

## Example Request Body

```json
{
  "title": "Finish assignment",
  "description": "Implement CRUD and validation",
  "dueDate": "2026-04-10",
  "category": "Interview"
}
```

## Key Decisions

- Used MongoDB with Mongoose because the assignment explicitly asks for MySQL/MongoDB persistence and Mongoose gives a clean schema/repository layer.
- Kept database access inside a repository module so route handlers stay focused on HTTP validation and response logic.
- Added a centralized error handler to return consistent JSON messages for validation and not-found cases.
- Included a lightweight browser UI so the assignment can be reviewed without using Postman.

## Notes

- MongoDB must be running locally or via Atlas before `npm run dev`.
- Tests use an in-memory fake repository so route validation and error handling are verified without requiring a live database.
