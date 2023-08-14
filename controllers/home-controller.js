// importing libraries
const crypto = require("crypto");
const secret = process.env.SECRET;
const jwt = require("jsonwebtoken");
const fs = require("fs");

const homeController = {};

// importing user defined modules
const CustomError = require("../error-handlers/custom-error");
const users = require("../data/users.json");
const categories = require("../data/categories.json");
const exploreList = require("../data/explore-list.json");
const content = require(`${process.cwd()}\\data\\content.json`);
const searchFunction = require("../utils/search-data");

// login the user by recieving username and password
homeController.login = (req, res, next) => {
  // console.log(req.body)
  let { username, password } = req.body;
  const hashPassowrd = crypto
    .createHmac("sha256", secret)
    .update(password)
    .digest("hex");
  try {
    let usr = users.find((u) => u.username == username);
    console.log(usr);
    if (usr == undefined) {
      let errStack = {
        statusCode: 404,
        message:
          "Cannot recognize you. Please check whether you are an existing User!",
        path: req.url,
        method: req.method,
      };
      next(CustomError.unknownUser(errStack));
    } else if (usr.password != hashPassowrd) {
      let errStack = {
        statusCode: 403,
        message:
          "You have given a wrong password? Are you sure that you remember it?",
        path: req.url,
        method: req.method,
      };
      next(CustomError.unknownUser(errStack));
    } else {
      //Create and assign a token
      const token = jwt.sign({ username: usr.username }, secret);
      res.header("auth-token", token);
      res.json({
        sucess: true,
        message: "YAYY....You are logged in!!",
        token: token,
      });
    }
  } catch (error) {
    next(error);
  }
};

// get categories
homeController.getCategories = (req, res, next) => {
  try {
    res.json({
      sucess: true,
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};

// get explore links
homeController.getExploreLinks = (req, res, next) => {
  try {
    res.json({
      sucess: true,
      payload: exploreList,
    });
  } catch (error) {
    next(error);
  }
};

// get the content to display on the cards
homeController.getContent = (req, res, next) => {
  try {
    let resultContent = content.map((element) => {
      return {
        id: element.id,
        title: element.title,
        description: element.description,
        thumbnail: element.thumbnail,
        category: element.category,
        rating: element.rating,
      };
    });
    res.json({
      sucess: true,
      payload: resultContent,
    });
  } catch (error) {
    next(error);
  }
};

// to add new content
homeController.addContent = async (req, res, next) => {
  try {
    // let { id, title, description, rating, category, thumbnail, images } = req.body
    let { contentData } = req.body;
    const anyNull = Object.values(contentData).some(
      (i) => i === null || i === undefined
    );
    if (anyNull) {
      let errStack = {
        statusCode: 500,
        message:
          "Some of the values seems missing in the given data!!! Please Check",
        path: req.url,
        method: req.method,
      };
      next(CustomError.internal(errStack));
    } else {
      let newID = homeController.generateID(content);
      contentData = { id: newID, ...contentData };
      console.log(process.cwd());
      content.push(contentData);

      await fs.writeFile(
        `${process.cwd()}\\data\\content.json`,
        JSON.stringify(content),
        (err) => {
          if (err) {
            console.log(err);
            next(CustomError.internal(err));
          }
        }
      );
      res.json({
        success: true,
        message: `content added with id ${newID}`,
        payload: contentData,
      });
    }
  } catch (error) {
    next(error);
  }
};

// to update decription of the content with provided id
homeController.updateContent = async (req, res, next) => {
  try {
    // let { id, title, description, rating, category, thumbnail, images } = req.body
    let { id, description } = req.body;
    if (id == null || description == null) {
      let errStack = {
        statusCode: 500,
        message:
          "Some of the values seems missing in the given data!!! Please Check",
        path: req.url,
        method: req.method,
      };
      next(CustomError.internal(errStack));
    } else {
      let contentDataIndex = content.findIndex((c) => c.id == id);
      content[contentDataIndex] = { ...content[contentDataIndex], description };

      await fs.writeFile(
        `${process.cwd()}\\data\\content.json`,
        JSON.stringify(content),
        (err) => {
          if (err) {
            console.log(err);
            next(CustomError.internal(err));
          }
        }
      );
      res.json({
        success: true,
        message: `content with id ${id} is updated`,
        payload: content[contentDataIndex],
      });
    }
  } catch (error) {
    next(error);
  }
};

// search based on the titles
homeController.searchTitles = (req, res, next) => {
  try {
    console.log(req.query);
    let { query } = req.query;
    console.log(query);
    if (query == null || query.length < 3) {
      let errStack = {
        statusCode: 500,
        message: "Search need atleast 3 letters to get the results",
        path: req.url,
        method: req.method,
      };
      next(CustomError.internal(errStack));
    } else {
      let results = searchFunction(query, content, "title");
      res.json({
        success: true,
        matches: results.length,
        payload: results,
      });
    }
  } catch (error) {
    next(error);
  }
};

// reusable function to generate a new ID for any dataset
homeController.generateID = (data) => {
  let ids = Object.values(data.map((element) => element.id));
  sortedIDS = ids.sort((a, b) => a - b);
  let lastIndex = sortedIDS[sortedIDS.length - 1];

  return lastIndex + 1;
};

module.exports = homeController;
