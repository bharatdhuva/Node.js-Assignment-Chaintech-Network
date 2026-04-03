const request = require("supertest");
const { createApp } = require("../src/app");

function createFakeRepository() {
  let tasks = [];
  let nextId = 1;

  function buildId() {
    return String(nextId++).padStart(24, "0");
  }

  return {
    async listTasks() {
      return [...tasks].reverse();
    },

    async findTaskById(id) {
      return tasks.find((task) => task.id === id) || null;
    },

    async createTask(payload) {
      const now = new Date().toISOString();
      const task = {
        id: buildId(),
        ...payload,
        completed: false,
        createdAt: now,
        updatedAt: now
      };
      tasks.push(task);
      return task;
    },

    async updateTask(id, payload) {
      const index = tasks.findIndex((task) => task.id === id);
      if (index === -1) {
        return null;
      }

      tasks[index] = {
        ...tasks[index],
        ...payload,
        updatedAt: new Date().toISOString()
      };

      return tasks[index];
    },

    async completeTask(id) {
      const index = tasks.findIndex((task) => task.id === id);
      if (index === -1) {
        return null;
      }

      tasks[index] = {
        ...tasks[index],
        completed: true,
        updatedAt: new Date().toISOString()
      };

      return tasks[index];
    },

    async deleteTask(id) {
      const originalLength = tasks.length;
      tasks = tasks.filter((task) => task.id !== id);
      return tasks.length !== originalLength;
    },

    async resetTasks() {
      tasks = [];
      nextId = 1;
    }
  };
}

const fakeRepository = createFakeRepository();
const app = createApp(fakeRepository);

beforeEach(async () => {
  await fakeRepository.resetTasks();
});

describe("Task routes", () => {
  test("creates and lists a task", async () => {
    const createResponse = await request(app)
      .post("/api/tasks")
      .send({
        title: "Write assignment",
        description: "Build CRUD app",
        dueDate: "2026-04-10",
        category: "Interview"
      })
      .expect(201);

    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data.title).toBe("Write assignment");

    const listResponse = await request(app).get("/api/tasks").expect(200);
    expect(listResponse.body.data).toHaveLength(1);
    expect(listResponse.body.data[0].category).toBe("Interview");
  });

  test("rejects empty title", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "   ", description: "Invalid task" })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Task title is required.");
  });

  test("updates a task", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Old title", description: "Old description" })
      .expect(201);

    const taskId = created.body.data.id;

    const updated = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({
        title: "New title",
        description: "New description",
        dueDate: "2026-05-01",
        category: "Updated"
      })
      .expect(200);

    expect(updated.body.data.title).toBe("New title");
    expect(updated.body.data.category).toBe("Updated");
  });

  test("marks a task as complete only once", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Complete me" })
      .expect(201);

    const taskId = created.body.data.id;

    const firstCompletion = await request(app)
      .patch(`/api/tasks/${taskId}/complete`)
      .expect(200);

    expect(firstCompletion.body.data.completed).toBe(true);

    const secondCompletion = await request(app)
      .patch(`/api/tasks/${taskId}/complete`)
      .expect(409);

    expect(secondCompletion.body.message).toBe("Task is already marked as completed.");
  });

  test("deletes a task", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Delete me" })
      .expect(201);

    const taskId = created.body.data.id;

    await request(app).delete(`/api/tasks/${taskId}`).expect(200);

    const listResponse = await request(app).get("/api/tasks").expect(200);
    expect(listResponse.body.data).toHaveLength(0);
  });

  test("returns 404 for missing task", async () => {
    const missingId = "000000000000000000000999";

    const response = await request(app)
      .put(`/api/tasks/${missingId}`)
      .send({ title: "Still missing" })
      .expect(404);

    expect(response.body.message).toBe(`Task with id ${missingId} was not found.`);
  });
});
