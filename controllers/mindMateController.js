const axios = require("axios");
require("dotenv").config();

const mindMateModel = require("../models/mindMateModel");

const API_KEY = process.env.GEMINI_API_KEY;
const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${API_KEY}`;

// Render MindMate page
exports.renderChatPage = (req, res) => {
  res.render("mindmate", {
    pageTitle: "MindMate - Chat & Mood Tracker",
    currentPage: "mindmate",
  });
};

// Handle AI chat
exports.handleFeelings = async (req, res) => {
  const { feelings } = req.body || {};
  if (!feelings) {
    return res.status(400).json({ error: "Feelings not provided" });
  }

  try {
    const response = await axios.post(endpoint, {
      contents: [
        {
          parts: [
            {
              text: `You are a compassionate assistant named MindMate who helps students cope with stress, anxiety, or academic pressure in a soothing and empathetic way. Avoid medical advice. Respond kindly and supportively.\n\nUser: ${feelings}\nAssistant:`,
            },
          ],
        },
      ],
    });

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here for you. Please try again.";

    // Save chat
    mindMateModel.saveChat(feelings, reply);

    res.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to get Gemini response" });
  }
};

// Get chat history
exports.getChatHistory = (req, res) => {
  const chats = mindMateModel.getChats();
  res.json({ chats });
};

// Log mood
exports.logMood = (req, res) => {
  const { mood, note } = req.body;
  const result = mindMateModel.saveMood(mood, note);
  res.json(result);
};

// Get moods
exports.getMoods = (req, res) => {
  const moods = mindMateModel.getMoods();
  res.json({ moods });
};
