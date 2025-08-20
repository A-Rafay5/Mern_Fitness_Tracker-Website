const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for this workout."],
    },
    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },
    foodItems: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String, // e.g., grams, cups, pieces
          required: true,
        },
        calories: {
          type: Number, // Calories for the specific food item
          required: true,
        },
        macros: {
          protein: {
            type: Number,
            required: true,
          },
          carbs: {
            type: Number,
            required: true,
          },
          fats: {
            type: Number,
            required: true,
          },
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now, // Default to current date if not provided
    },
  },
  {
    timestamps: true, 
  }
);

const Nutrition = mongoose.model("Nutrition", nutritionSchema);

module.exports = Nutrition;
