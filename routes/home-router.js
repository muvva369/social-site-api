const express = require("express");
const HomeRouter = express.Router();
const authenticateToken = require("../utils/authentication");
const homeController = require("../controllers/home-controller");

// login
HomeRouter.post("/login", homeController.login);

// get data
HomeRouter.get(
  "/get-categories",
  authenticateToken,
  homeController.getCategories
);
HomeRouter.get(
  "/get-explore-list",
  authenticateToken,
  homeController.getExploreLinks
);
HomeRouter.get("/get-content", authenticateToken, homeController.getContent);
// search
HomeRouter.get(
  "/search-content-title",
  authenticateToken,
  homeController.searchTitles
);

// modify data
HomeRouter.post("/add-content", authenticateToken, homeController.addContent);
HomeRouter.post(
  "/update-content",
  authenticateToken,
  homeController.updateContent
);

module.exports = HomeRouter;
