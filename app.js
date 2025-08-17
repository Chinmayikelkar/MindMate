// Core Module
const path = require("path");

// External Module
const express = require("express");

// Local Module
const rootDir = require("./utils/pathUtil");
const homeRouter = require("./routes/homeRouter");
const chatRouter = require("./routes/mindMateRouter");
const recommendationRouter = require("./routes/recommendationRouter");

const app = express();

app.use(express.json());

// Middleware for ejs files rendering
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware for CSS
app.use(express.static(path.join(rootDir, "public")));

app.use(express.urlencoded());
app.use(chatRouter);
app.use(homeRouter);
app.use(recommendationRouter);

app.use((req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    currentPage: "404",
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on address http://localhost:${PORT}`);
});
