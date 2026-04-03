const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task-manager-assignment";

async function connectDatabase() {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
}

module.exports = { connectDatabase };
