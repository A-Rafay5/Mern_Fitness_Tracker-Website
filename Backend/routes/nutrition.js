const express = require('express');
const Nutrition = require('../models/Nutrition');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 1. Add a new nutrition entry
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { mealType, foodItems, date } = req.body; // Accept date from the request body
    const userId = req.user?._id;

    if (!foodItems || foodItems.length === 0) {
      return res.status(400).json({ message: 'Food items are required.' });
    }

    // Validate food items for missing fields
    for (const item of foodItems) {
      if (!item.name || !item.quantity || !item.unit || !item.calories || !item.macros) {
        return res.status(400).json({ message: 'Each food item must have all the required fields (name, quantity, unit, calories, macros).' });
      }
    }

    // If a date is provided, use it; otherwise, use the current date
    const nutritionDate = date ? new Date(date) : new Date();

    // Create new nutrition entry with the provided data
    const newNutrition = new Nutrition({
      user: userId,
      mealType,
      foodItems,
      date: nutritionDate, // Use the selected date
    });

    // Save the new nutrition entry to the database
    const savedNutrition = await newNutrition.save();

    // Populate the user information and send the response
    const populatedNutrition = await Nutrition.findById(savedNutrition._id).populate("user", "name email");

    res.status(201).json(populatedNutrition);

  } catch (error) {
    console.error('Error adding nutrition entry:', error);
    res.status(500).json({ message: 'Failed to add nutrition entry' });
  }
});


// 2. Get all nutrition entries for a user
router.get('/get', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    // Fetch the nutrition logs for the logged-in user
    const nutritionLogs = await Nutrition.find({ user: userId }).sort({ createdAt: -1 });

    if (!nutritionLogs.length) {
      return res.status(404).json({ message: "No nutrition logs found." });
    }

    res.status(200).json(nutritionLogs);
  } catch (error) {
    console.error('Error fetching nutrition logs:', error); 
    return res.status(500).json({ message: 'Failed to fetch nutrition logs', error: error.message });
  }
});


// 3. Update a nutrition entry by ID
router.put('/update/:id', authMiddleware, async (req, res) => {
  try {
    const { mealType, foodItems } = req.body;
    const nutritionId = req.params.id;
    const userId = req.user.id;

    // Find the nutrition log and update it
    const updatedNutrition = await Nutrition.findOneAndUpdate(
      { _id: nutritionId, userId },
      { mealType, foodItems },
      { new: true }
    );

    if (!updatedNutrition) {
      return res.status(404).json({ message: 'Nutrition entry not found' });
    }

    res.status(200).json(updatedNutrition);
  } catch (error) {
    console.error('Error updating nutrition entry:', error);
    res.status(500).json({ message: 'Failed to update nutrition entry' });
  }
});

// 4. Delete a nutrition entry by ID
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const nutritionId = req.params.id;
    const userId = req.user._id;  // Correcting userId to req.user._id

    // Find and delete the nutrition log
    const deletedNutrition = await Nutrition.findOneAndDelete({
      _id: nutritionId,
      user: userId,  // Corrected the field to user
    });

    if (!deletedNutrition) {
      return res.status(404).json({ message: 'Nutrition entry not found' });
    }

    res.status(200).json({ message: 'Nutrition entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting nutrition entry:', error);
    res.status(500).json({ message: 'Failed to delete nutrition entry' });
  }
});


module.exports = router;
