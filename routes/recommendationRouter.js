const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const recommendationRouter = express.Router();
const chatHistoryPath = path.join(__dirname, "../data/chatHistory.json");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY;

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${GEMINI_KEY}`;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

// Route to render recommendation page
recommendationRouter.get("/recommendations", (req, res) => {
  res.render("recommendation", {
    pageTitle: "MindMate - Recommended Resources",
    currentPage: "recommendation",
  });
});

// Route to generate Gemini-powered YouTube suggestion
recommendationRouter.get("/api/custom-suggestion", async (req, res) => {
  try {
    const chatData = JSON.parse(fs.readFileSync(chatHistoryPath, "utf-8"));

    const lastUserMessages = chatData
      .slice(-3)
      .map((c) => c.user)
      .join(" ")
      .slice(-300); // Approx. 50 tokens

    console.log("Last user messages:", lastUserMessages);

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

    const searchQuery =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!searchQuery) throw new Error("No search query from Gemini");

    const ytResponse = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        key: YOUTUBE_KEY,
        q: searchQuery,
        part: "snippet",
        maxResults: 1,
        type: "video",
      },
    });

    const video = ytResponse.data.items?.[0];
    if (!video) throw new Error("No video from YouTube");

    res.json({
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.medium.url,
      videoId: video.id.videoId,
    });
  } catch (err) {
    console.error(
      "Custom Suggestion Error:",
      err?.response?.data || err.message
    );

    res.status(500).json({ error: "Failed to generate recommendation" });
  }
});

module.exports = recommendationRouter;
