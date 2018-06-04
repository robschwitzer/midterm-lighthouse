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
      .distinct()
      .select("url", "description", "title", "urls.id", "creator_id")
      .from("urls")
      .join('likes', 'urls.id', 'url_id')
      .where('creator_id', '=', req.params.id)
      .orWhere('liker_id', '=', req.params.id)
      .then((results) => {
        res.json(results);
    });
  });
  return router;
}
