const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const authMiddleware = require("../middlewares/authMiddleware");


// Create a new workout routine
router.post("/create", authMiddleware, async (req, res) => {
  try {
    
    const { name, category, exercises, tags } = req.body;
    const userId = req.user?._id;

    if (!name || !category || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ error: "Missing required fields or invalid data." });
    }

    for (const exercise of exercises) {
      if (!exercise.name || !exercise.sets || !exercise.reps) {
        return res.status(400).json({ error: "Invalid exercise data. Name, sets, and reps are required." });
      }
    }

    const workout = new Workout({ name, category, exercises, tags, user: userId });
    const savedWorkout = await workout.save();
    const populatedWorkout = await Workout.findById(savedWorkout._id).populate("user", "name email");

    res.status(201).json(populatedWorkout);
  } catch (error) {
    console.error("Error saving workout:", error); // Debugging
    res.status(500).json({ error: "Failed to create workout routine." });
  }
});



// Get workout routines
router.get("/workouts", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; 

    // Fetch workouts belonging to the authenticated user, sorted by creation date
    const workouts = await Workout.find({ user: userId }).sort({ createdAt: -1 });

    // if (!workouts.length) {
    //   return res.status(404).json({ message: "No workout routines found for this user." });
    // }

    res.status(200).json(workouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    res.status(500).json({ error: "Failed to fetch workout routines." });
  }
});



// Update a workout routine
router.put("/workouts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ error: "Workout ID is required." });
    }

    // Validate exercises if provided
    if (req.body.exercises) {
      for (const exercise of req.body.exercises) {
        if (!exercise.name || !exercise.sets || !exercise.reps) {
          return res.status(400).json({ error: "Invalid exercise data. Name, sets, and reps are required." });
        }
      }
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation
    });

    if (!updatedWorkout) {
      return res.status(404).json({ error: "Workout routine not found." });
    }

    res.status(200).json(updatedWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update workout routine." });
  }
});

// Delete a workout routine
router.delete("/workouts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ error: "Workout ID is required." });
    }

    const deletedWorkout = await Workout.findByIdAndDelete(id);
    if (!deletedWorkout) {
      return res.status(404).json({ error: "Workout routine not found." });
    }

    res.status(200).json({ message: "Workout routine deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete workout routine." });
  }
});

module.exports = router;
