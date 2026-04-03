const { Router } = require("express");

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeTaskPayload(body) {
  return {
    title: typeof body.title === "string" ? body.title.trim() : "",
    description: typeof body.description === "string" ? body.description.trim() : "",
    dueDate:
      typeof body.dueDate === "string" && body.dueDate.trim()
        ? body.dueDate.trim()
        : null,
    category:
      typeof body.category === "string" && body.category.trim()
        ? body.category.trim()
        : "General"
  };
}

function validateTaskPayload(task) {
  if (!task.title) {
    throw createHttpError(400, "Task title is required.");
  }

  if (task.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)) {
    throw createHttpError(400, "Due date must use YYYY-MM-DD format.");
  }
}

function parseTaskId(rawId) {
  if (!/^[a-fA-F0-9]{24}$/.test(rawId)) {
    throw createHttpError(400, "Task id must be a valid MongoDB ObjectId.");
  }

  return rawId;
}

function ensureTaskExists(task, id) {
  if (!task) {
    throw createHttpError(404, `Task with id ${id} was not found.`);
  }
}

function createTaskRouter(repository) {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      const tasks = await repository.listTasks();
      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const payload = normalizeTaskPayload(req.body);
      validateTaskPayload(payload);

      const task = await repository.createTask(payload);

      res.status(201).json({
        success: true,
        message: "Task created successfully.",
        data: task
      });
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const id = parseTaskId(req.params.id);
      const existingTask = await repository.findTaskById(id);
      ensureTaskExists(existingTask, id);

      const payload = normalizeTaskPayload(req.body);
      validateTaskPayload(payload);

      const updatedTask = await repository.updateTask(id, payload);

      res.json({
        success: true,
        message: "Task updated successfully.",
        data: updatedTask
      });
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id/complete", async (req, res, next) => {
    try {
      const id = parseTaskId(req.params.id);
      const existingTask = await repository.findTaskById(id);
      ensureTaskExists(existingTask, id);

      if (existingTask.completed) {
        throw createHttpError(409, "Task is already marked as completed.");
      }

      const completedTask = await repository.completeTask(id);

      res.json({
        success: true,
        message: "Task marked as completed.",
        data: completedTask
      });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const id = parseTaskId(req.params.id);
      const deleted = await repository.deleteTask(id);

      if (!deleted) {
        throw createHttpError(404, `Task with id ${id} was not found.`);
      }

      res.json({
        success: true,
        message: "Task deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createTaskRouter };
