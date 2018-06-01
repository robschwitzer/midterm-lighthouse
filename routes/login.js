"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    knex
      .select('*')
      .from("users")
      .where("email", "=", req.body.email)
      .where("password", "=", req.body.password)
      .then( function (results) {
      res.json(results)
      req.session.user = results;
      
      });
    });

  router.delete("/", (req, res) => {
    req.session = null;
  });

  return router;
}
