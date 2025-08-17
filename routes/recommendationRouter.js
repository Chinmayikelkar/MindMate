const express = require("express");
const recommendationController = require("../controllers/recommendationController");

const recommendationRouter = express.Router();

// Render recommendation page
recommendationRouter.get(
  "/recommendations",
  recommendationController.renderRecommendationPage
);

// Gemini-powered YouTube suggestion
recommendationRouter.get(
  "/api/custom-suggestion",
  recommendationController.getCustomSuggestion
);

module.exports = recommendationRouter;
