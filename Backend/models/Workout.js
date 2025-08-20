const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Workout name is required."],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Workout category is required."],
      enum: {
        values: ["Strength", "Cardio", "Flexibility", "Endurance"],
        message: "Category must be one of: strength, cardio, flexibility, endurance.",
      },
    },
    exercises: [
      {
        name: {
          type: String,
          required: [true, "Exercise name is required."],
          trim: true,
        },
        sets: {
          type: Number,
          required: [true, "Exercise sets are required."],
          min: [1, "Sets must be at least 1."],
        },
        reps: {
          type: Number,
          required: [true, "Exercise reps are required."],
          min: [1, "Reps must be at least 1."],
        },
        weight: {
          type: Number,
          default: 0,
          min: [0, "Weight cannot be negative."],
        },
        notes: {
          type: String,
          default: "",
        },
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for this workout."],
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Workout", WorkoutSchema);
