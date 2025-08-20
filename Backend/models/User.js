const mongoose = require('mongoose');

// Define User schema with profile-related fields
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, // URL or path to the profile picture
    default: 'default-avatar.png' , 
  },
  fullName: {
    type: String, // User's full name
    default: '',
  },
  bio: {
    type: String, // Short bio
    default: '',
  },
  gender: {
    type: String, 
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  birthDate: {
    type: String, 
    default: '',
  },
  // Add more fields as needed
});

const User = mongoose.model('User', userSchema);

module.exports = User;
