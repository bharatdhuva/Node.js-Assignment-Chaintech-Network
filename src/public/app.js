const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dueDateInput = document.getElementById("dueDate");
const categoryInput = document.getElementById("category");
const feedback = document.getElementById("feedback");
const taskList = document.getElementById("task-list");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const refreshBtn = document.getElementById("refresh-btn");
const totalCount = document.getElementById("total-count");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");

let editingTaskId = null;
let cachedTasks = [];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showFeedback(message, isError = true) {
  feedback.textContent = message;
  feedback.classList.remove("error", "success");

  if (!message) {
    return;
  }

  feedback.classList.add(isError ? "error" : "success");
}

function resetForm() {
  taskForm.reset();
  editingTaskId = null;
  submitBtn.textContent = "Create Task";
  cancelEditBtn.classList.add("hidden");
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const rawBody = await response.text();
  let data;

  try {
    data = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

function updateSummary(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  totalCount.textContent = String(total);
  pendingCount.textContent = String(pending);
  completedCount.textContent = String(completed);
}

function renderTasks(tasks) {
  cachedTasks = tasks;
  updateSummary(tasks);

  if (!tasks.length) {
    taskList.innerHTML = "<p class=\"empty-state\">No tasks found. Create your first task above.</p>";
    return;
  }

  taskList.innerHTML = tasks
    .map(
      (task) => `
        <article class="task-card ${task.completed ? "completed" : ""}">
          <h3>${escapeHtml(task.title)}</h3>
          <p>${escapeHtml(task.description || "No description provided.")}</p>
          <div class="task-meta">
            <span class="badge">${escapeHtml(task.category)}</span>
            <span class="badge">Due: ${escapeHtml(task.dueDate || "Not set")}</span>
            <span class="badge">${task.completed ? "Completed" : "Pending"}</span>
          </div>
          <div class="actions">
            <button type="button" data-action="edit" data-id="${task.id}">Edit</button>
            <button type="button" data-action="complete" data-id="${task.id}" ${
              task.completed ? "disabled" : ""
            }>Complete</button>
            <button type="button" class="danger" data-action="delete" data-id="${task.id}">Delete</button>
          </div>
        </article>
      `
    )
    .join("");
}

async function loadTasks() {
  try {
    const result = await requestJson("/api/tasks");
    renderTasks(result.data);
  } catch (error) {
    showFeedback(error.message);
  }
}

function startEdit(task) {
  editingTaskId = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description;
  dueDateInput.value = task.dueDate || "";
  categoryInput.value = task.category;
  submitBtn.textContent = "Update Task";
  cancelEditBtn.classList.remove("hidden");
  showFeedback(`Editing task #${task.id}`, false);
}

async function completeTask(id) {
  try {
    const result = await requestJson(`/api/tasks/${id}/complete`, {
      method: "PATCH"
    });

    showFeedback(result.message, false);
    await loadTasks();
  } catch (error) {
    showFeedback(error.message);
  }
}

async function deleteTask(id) {
  try {
    const result = await requestJson(`/api/tasks/${id}`, {
      method: "DELETE"
    });

    showFeedback(result.message, false);
    if (editingTaskId === id) {
      resetForm();
    }
    await loadTasks();
  } catch (error) {
    showFeedback(error.message);
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    title: titleInput.value,
    description: descriptionInput.value,
    dueDate: dueDateInput.value,
    category: categoryInput.value
  };

  try {
    const result = editingTaskId
      ? await requestJson(`/api/tasks/${editingTaskId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        })
      : await requestJson("/api/tasks", {
          method: "POST",
          body: JSON.stringify(payload)
        });

    showFeedback(result.message, false);
    resetForm();
    await loadTasks();
  } catch (error) {
    showFeedback(error.message);
  }
});

cancelEditBtn.addEventListener("click", () => {
  resetForm();
  showFeedback("");
});

refreshBtn.addEventListener("click", loadTasks);

taskList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const id = button.dataset.id;

  if (button.dataset.action === "edit") {
    const task = cachedTasks.find((item) => item.id === id);
    if (task) {
      startEdit(task);
    }
    return;
  }

  if (button.dataset.action === "complete") {
    await completeTask(id);
    return;
  }

  if (button.dataset.action === "delete") {
    await deleteTask(id);
  }
});

loadTasks();
