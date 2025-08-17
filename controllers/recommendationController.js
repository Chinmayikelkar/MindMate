const recommendationModel = require("../models/recommendationModel");

exports.renderRecommendationPage = (req, res) => {
  res.render("recommendation", {
    pageTitle: "MindMate - Recommended Resources",
    currentPage: "recommendation",
  });
};

exports.getCustomSuggestion = async (req, res) => {
  try {
    const lastUserMessages = recommendationModel.getLastUserMessages(3, 300);

    const searchQuery = await recommendationModel.generateSearchQuery(
      lastUserMessages
    );
    if (!searchQuery) throw new Error("No search query from Gemini");

    const video = await recommendationModel.getYouTubeVideo(searchQuery);
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
};
