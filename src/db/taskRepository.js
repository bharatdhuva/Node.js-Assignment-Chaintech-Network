const Task = require("../models/taskModel");

async function listTasks() {
  return Task.find().sort({ createdAt: -1 });
}

async function findTaskById(id) {
  return Task.findById(id);
}

async function createTask(payload) {
  return Task.create(payload);
}

async function updateTask(id, payload) {
  return Task.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  });
}

async function completeTask(id) {
  return Task.findByIdAndUpdate(
    id,
    { completed: true },
    {
      new: true,
      runValidators: true
    }
  );
}

async function deleteTask(id) {
  const deletedTask = await Task.findByIdAndDelete(id);
  return Boolean(deletedTask);
}

async function resetTasks() {
  await Task.deleteMany({});
}

module.exports = {
  taskRepository: {
    listTasks,
    findTaskById,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    resetTasks
  }
};
