"use strict";

const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');

module.exports = (knex) => {

  router.post("/", (req, res) => {
    knex
      .select('*')
      .from("users")
      .where("email", "=", req.body.email)
      .where("password", "=", req.body.password)
      .then( function (results) {
      req.session.user = results
      res.json(results);
      });
    });

  router.delete("/", (req, res) => {
    req.session = null;
  });

  return router;
}
