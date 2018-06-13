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
      .then(function (results) {
        req.session.user = {
          id: results[0].id,
          name: results[0].name,
          email: results[0].email,
          password: results[0].password
        }
        res.json(results[0]);
      });
  });

  router.delete("/", (req, res) => {
    req.session = null;
    res.json('')
  });

  return router;
}
