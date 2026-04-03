const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task-manager-assignment";

async function connectDatabase() {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    throw new Error(
      `MongoDB connection failed. Ensure MongoDB is running and MONGODB_URI is valid. Details: ${error.message}`
    );
  }
}

module.exports = { connectDatabase };
