const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    dueDate: {
      type: String,
      default: null
    },
    category: {
      type: String,
      default: "General",
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
      }
    }
  }
);

module.exports = mongoose.model("Task", taskSchema);
