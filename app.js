// importing libraries
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config({
  path: `./environment/.env.${process.env.NODE_ENV.trim()}`,
});

// importing user defined modules
const homeRouter = require("./routes/home-router");
const CustomErrorHandler = require("./error-handlers/custom-error-handler");
const CustomError = require("./error-handlers/custom-error");

const port = process.env.PORT ?? 5000;
const whiteList = process.env.WHITELIST;
// application server
const app = express();
app.listen(port, (error) => {
  if (error) console.log(error);
  else console.log("Server is up and running on PORT => ", port);
});
// enabling certain urls to accept
const corsOptions = {
  origin: function (origin, callback) {
    if (
      whiteList.indexOf(origin) !== -1 ||
      origin == undefined ||
      origin == "null"
    )
      callback(undefined, true);
    else callback(new Error(origin + "Not allowed by CORS"));
  },
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// routes
app.use("/test",(req,res,next)=>{res.send('Application Server is Successfully UP')})
app.use("/social-site/api", (req, res, next) => {
  console.log(`pinged URL => ${req.url} `);
  next();
});

app.use("/social-site/api/home", homeRouter);

// invalid routes
app.use("*", (req, res, next) => {
  let errStack = {
    statusCode: 404,
    message:
      "You have ended up in Unknown Territory. Please find you way home!",
    path: req.url,
    method: req.method,
  };
  next(CustomError.unknownPath(errStack));
});

// error handling
app.use(CustomErrorHandler);

module.exports = app;
