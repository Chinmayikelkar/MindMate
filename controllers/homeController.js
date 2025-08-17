// controllers/homeController.js

const getHomePage = (req, res) => {
  res.render("home", {
    pageTitle: "MindMate - Home",
    currentPage: "home",
  });
};

module.exports = { getHomePage };
