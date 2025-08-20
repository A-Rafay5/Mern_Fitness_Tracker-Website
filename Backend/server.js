require('dotenv').config();  
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import path module
const authRoutes = require('./routes/auth'); // Import auth routes
const profileRoutes = require('./routes/profile'); // Import profile routes
const workoutRoutes = require("./routes/workout");
const nutritionRoutes = require("./routes/nutrition");
const progressRoutes = require("./routes/progress");
const wingmanRoutes = require("./routes/wingman");

const app = express();

app.use(express.json());
app.use(cors()); 

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/profile', profileRoutes); 
app.use("/api/workout", workoutRoutes);  
app.use("/api/nutrition", nutritionRoutes);  
app.use("/api/progress", progressRoutes);  
app.use("/api/wingman", wingmanRoutes);

// Static file serving for uploads (optional based on your app's requirements)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the process if database connection fails
  });

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
