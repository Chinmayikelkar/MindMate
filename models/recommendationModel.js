const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const chatHistoryPath = path.join(__dirname, "../data/chatHistory.json");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY;

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${GEMINI_KEY}`;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

// Read last N user messages (limited to maxChars characters)
exports.getLastUserMessages = (count, maxChars) => {
  const chatData = JSON.parse(fs.readFileSync(chatHistoryPath, "utf-8"));
  return chatData
    .slice(-count)
    .map((c) => c.user)
    .join(" ")
    .slice(-maxChars);
};

// Generate search query using Gemini API
exports.generateSearchQuery = async (lastUserMessages) => {
  const geminiResponse = await axios.post(GEMINI_ENDPOINT, {
    contents: [
      {
        parts: [
          {
            text: `Based on this student conversation, recommend a YouTube search query for their mental wellness: "${lastUserMessages}"`,
          },
        ],
      },
    ],
  });

  return geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
};

// Fetch YouTube video for given search query
exports.getYouTubeVideo = async (searchQuery) => {
  const ytResponse = await axios.get(YOUTUBE_SEARCH_URL, {
    params: {
      key: YOUTUBE_KEY,
      q: searchQuery,
      part: "snippet",
      maxResults: 1,
      type: "video",
    },
  });

  return ytResponse.data.items?.[0];
};
