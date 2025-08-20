const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true },
  bodyMeasurements: { type: Map, of: Number }, 
  performanceMetrics: { type: Map, of: Number }, 
  date: { type: Date, required: true }, 
});

const Progress = mongoose.model('Progress', progressSchema);

// Add Progress Entry
router.post('/add', authMiddleware, async (req, res) => {
  const { weight, bodyMeasurements, performanceMetrics, date } = req.body;

  if (!weight) {
    return res.status(400).json({ error: 'Weight is required.' });
  }

  // Ensure that the date is provided by the user
  if (!date) {
    return res.status(400).json({ error: 'Date is required.' });
  }

  try {
    const progress = new Progress({
      userId: req.user._id,
      weight,
      bodyMeasurements,
      performanceMetrics,
      date, // Use the manually specified date
    });

    await progress.save();
    res.status(201).json({ message: 'Progress added successfully!', progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get All Progress Entries for a User
router.get('/get', authMiddleware, async (req, res) => {
  try {
    const progressEntries = await Progress.find({ userId: req.user._id }).sort({ date: 1 });

    res.status(200).json({ progressEntries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const deletedProgress = await Progress.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deletedProgress) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }
    res.status(200).json({ message: 'Nutrition entry deleted successfully' });
  } catch (error) {
    console.error("Error deleting progress:", error);
    res.status(500).json({ message: 'Failed to delete progress' });
  }
});


module.exports = router;
