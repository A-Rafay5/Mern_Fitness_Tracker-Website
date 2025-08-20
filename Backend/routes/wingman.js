const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyD47R4e-QPuBsZP6hInNpok2WmtJviFTfs';
const genAI = new GoogleGenerativeAI(API_KEY);  
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


router.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
  
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }
  
    try {
      
      const result = await model.generateContent(userMessage);  
      const botReply = result.response.text();  
  
      res.json({ reply: botReply });
    } catch (error) {
      console.error('Error from Generative AI:', error);
      res.status(500).json({ error: 'Something went wrong with the AI service.' });
    }
  });

  module.exports = router;