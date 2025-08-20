const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});

// GET route to fetch the user's profile
router.get('/get', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture
        ? `${req.protocol}://${req.get('host')}/uploads/${user.profilePicture}`
        : `${req.protocol}://${req.get('host')}/default-avatar.jpg`,
      bio: user.bio || '',
      gender: user.gender || '',
      city: user.city || '',
      birthDate: user.birthDate || '',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
});

// PUT route to update the user's profile
router.put(
  '/update',
  authMiddleware,
  upload.single('profilePicture'),
  async (req, res) => {
    const { username, bio, gender, city, birthDate } = req.body;
    const profilePicture = req.file ? req.file.filename : undefined;

    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    console.log('req.user:', req.user);

    // Validate input
    if (!username || username.trim().length === 0) {
      console.error('Validation Error: Username is required');
      return res.status(400).json({ error: 'Username is required' });
    }

    try {
      const user = await User.findById(req.user);
      if (!user) {
        console.error('User not found:', req.user);
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete old profile picture if exists
      if (user.profilePicture && profilePicture) {
        try {
          fs.unlinkSync(`uploads/${user.profilePicture}`);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }

      // Update user details
      user.username = username || user.username;
      user.bio = bio || user.bio;
      user.gender = gender || user.gender;
      user.city = city || user.city;
      user.birthDate = birthDate || user.birthDate;
      user.profilePicture = profilePicture || user.profilePicture;

      await user.save();

      res.status(200).json({
        message: 'Profile updated successfully',
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        gender: user.gender || '',
        city: user.city || '',
        birthDate: user.birthDate || '',
        profilePicture: user.profilePicture
          ? `${req.protocol}://${req.get('host')}/uploads/${user.profilePicture}`
          : `${req.protocol}://${req.get('host')}/default-avatar.jpg`,
      });
    } catch (err) {
      console.error('Server Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);


module.exports = router;
