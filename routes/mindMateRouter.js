const express = require("express");
const mindMateController = require("../controllers/mindMateController");

const chatRouter = express.Router();

// Chat page
chatRouter.get("/chat", mindMateController.renderChatPage);

// AI chat
chatRouter.post("/api/feelings", mindMateController.handleFeelings);

// Chat history
chatRouter.get("/chat-history", mindMateController.getChatHistory);

// Mood tracker
chatRouter.post("/log-mood", mindMateController.logMood);
chatRouter.get("/get-moods", mindMateController.getMoods);

module.exports = chatRouter;
