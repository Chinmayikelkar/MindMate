// routes/homeRouter.js
const express = require("express");
const { getHomePage } = require("../controllers/homeController");

const homeRouter = express.Router();

homeRouter.get("/", getHomePage);

module.exports = homeRouter;
