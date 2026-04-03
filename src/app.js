const express = require("express");
const path = require("path");
const { createTaskRouter } = require("./routes/taskRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const { notFoundHandler } = require("./middleware/notFoundHandler");
const { taskRepository } = require("./db/taskRepository");

function createApp(repository = taskRepository) {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/tasks", createTaskRouter(repository));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
