const express = require("express");

const homeRouter = express.Router();

homeRouter.get("/", (req, res) => {
  res.render("home", {
    pageTitle: "MindMate - Home",
    currentPage: "home",
  });
});

module.exports = homeRouter;
