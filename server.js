"use strict";

require('dotenv').config();
const cookieSession = require('cookie-session')
const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes    = require("./routes/users");
const urlsRoutes     = require("./routes/docs");
const searchRoutes   = require("./routes/search");
const commentsRoutes = require("./routes/comments");
const likesRoutes    = require("./routes/likes");
const ranksRoutes    = require("./routes/ranks");
const loginRoutes    = require("./routes/login");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set('trust proxy', 1);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use(cookieSession({
  name: 'session',
  keys: ['asdf', 'asde', 'wqwwt'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use('/', (req, res, next) => {
  res.locals.user_id = req.session.user;
  next();
});
// Mount all resource routes
app.use("/api/docs", urlsRoutes(knex));
app.use("/api/users", usersRoutes(knex));
app.use("/api/docs/search", searchRoutes(knex));
app.use("/api/comments", commentsRoutes(knex));//should be urls/id/comments
app.use("/api/likes", likesRoutes(knex));
app.use("/api/ranks", ranksRoutes(knex));
app.use("/api/login", loginRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
