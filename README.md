<div align="center">
  <h1>Task Manager API and Dashboard</h1>
  <p><strong>Node.js Interview Assignment | PR: NODEJSIIP-01909</strong></p>

  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
</div>

---

## About The Project

This project is a Node.js internship practical submission for a Task Management application.

It includes:

- Full task CRUD flow
- MongoDB persistence
- Input validation and consistent API error responses
- Browser-based UI for quick manual review
- Unit and integration-style API tests

---

## Live Deployment

[![Live App](https://img.shields.io/badge/View-Live%20Deployment-22c55e?style=for-the-badge)](https://task-manager-assignment-3w3r.onrender.com/)

---

## Core Features

- Create tasks with title and description
- List all tasks
- Edit task details
- Mark a task as completed
- Prevent duplicate completion on already completed tasks
- Delete tasks
- Optional due date and category support
- Clean JSON error handling

---

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Jest + Supertest

---

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/task-manager-assignment
PORT=3000
```

3. Start the app:

```bash
npm run dev
```

4. Open in browser:

```text
http://localhost:3000
```

---

## Test Commands

```bash
npm test
```

---

## API Endpoints

- `GET /api/tasks` : Get all tasks
- `POST /api/tasks` : Create task
- `PUT /api/tasks/:id` : Update task
- `PATCH /api/tasks/:id/complete` : Mark task completed
- `DELETE /api/tasks/:id` : Delete task

### Example Request Body

```json
{
  "title": "Finish assignment",
  "description": "Implement CRUD and validation",
  "dueDate": "2026-04-10",
  "category": "Interview"
}
```

---

## Project Structure

```text
src/
  app.js                    Express app setup
  server.js                 Server bootstrap
  db/
    database.js             MongoDB connection setup
    taskRepository.js       Task data operations
  models/
    taskModel.js            Mongoose task schema
  middleware/
    errorHandler.js         Central error responses
    notFoundHandler.js      Route not found middleware
  routes/
    taskRoutes.js           Task routes and validation
  public/
    index.html              Browser UI
    styles.css              UI styles
    app.js                  Frontend API logic
tests/
  taskRoutes.test.js        API test coverage
```

---

## Assignment Requirements Coverage

| Requirement | Status |
|-------------|--------|
| Create task with title and description | Done |
| View list of all tasks | Done |
| Mark task as completed | Done |
| Edit task details | Done |
| Delete task | Done |
| MySQL/MongoDB persistence requirement | Done (MongoDB) |
| Title required validation | Done |
| Prevent duplicate completion | Done |
| Graceful error messages | Done |
| Due date (bonus) | Done |
| Category (bonus) | Done |
| Unit/API tests (bonus) | Done |

---

## Key Engineering Decisions

- MongoDB + Mongoose used to satisfy assignment persistence criteria with schema-based modeling.
- Repository layer used to keep route handlers focused on request validation and response flow.
- Error middleware returns predictable JSON structure for easier debugging and frontend integration.
- Frontend kept lightweight to allow non-technical reviewers to test functionality quickly.

---

## Deployment Notes

- Deployment target: Render
- Database: MongoDB Atlas
- Render environment variable required:

```env
MONGODB_URI=<your-atlas-uri>
```

If SRV DNS issues occur on local network, use standard non-SRV MongoDB URI format.

---

## Final Note

This project is built specifically against the Node.js internship practical guide and evaluation criteria.

I can explain architecture, route flow, validation logic, and deployment setup end-to-end.

Thanks for reviewing this submission.

**Bharat**
