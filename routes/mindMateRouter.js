const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const chatRouter = express.Router();
const API_KEY = process.env.GEMINI_API_KEY;
const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${API_KEY}`;

// File paths
const chatHistoryPath = path.join(__dirname, "../data/chatHistory.json");
const moodLogsPath = path.join(__dirname, "../data/moodLogs.json");

// Utility to read/write JSON
const readJsonFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
};

const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Route to render the MindMate page
chatRouter.get("/chat", (req, res) => {
  res.render("mindmate", {
    pageTitle: "MindMate - Chat & Mood Tracker",
    currentPage: "mindmate",
  });
});

// Gemini AI chat handler
chatRouter.post("/api/feelings", async (req, res) => {
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

    // Save chat history
    const chats = readJsonFile(chatHistoryPath);
    chats.push({
      timestamp: new Date().toISOString(),
      user: feelings,
      assistant: reply,
    });
    writeJsonFile(chatHistoryPath, chats);

    res.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to get Gemini response" });
  }
});

// Get chat history
chatRouter.get("/chat-history", (req, res) => {
  const chats = readJsonFile(chatHistoryPath);
  res.json({ chats });
});

// Mood tracker: Save mood
chatRouter.post("/log-mood", (req, res) => {
  const { mood, note } = req.body;
  const timestamp = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const moodLogs = readJsonFile(moodLogsPath); // Load existing moods
  moodLogs.push({ date: timestamp, mood, note });
  writeJsonFile(moodLogsPath, moodLogs); // Save updated moods

  let summary = null;

  if (moodLogs.length % 7 === 0) {
    const last7 = moodLogs.slice(-7);
    const count = { happy: 0, neutral: 0, sad: 0 };
    last7.forEach((m) => count[m.mood]++);

    summary = `Your Last 7 Mood Entries\n😊 Happy: ${count.happy}\n😐 Neutral: ${count.neutral}\n😔 Sad: ${count.sad}`;
  }

  res.json({ message: "Mood saved", moods: moodLogs, summary });
});

// Mood tracker: Get mood data
chatRouter.get("/get-moods", (req, res) => {
  const logs = readJsonFile(moodLogsPath);
  res.json({ moods: logs });
});

module.exports = chatRouter;
