"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  router.get("/:id/docs", (req, res) => {
    knex
      .select("*")
      .from("urls")
      .where('creator_id', '=', req.params.id)
      .then((results) => {
        res.json(results);
    });
  });
  return router;
}
