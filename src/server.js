require("dotenv").config();

const { createApp } = require("./app");
const { connectDatabase } = require("./db/database");

const PORT = process.env.PORT || 3000;
const app = createApp();

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Task Manager app is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
