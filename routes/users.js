"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get("/doc/:url_id/comment/:commenter_id", (req, res) => {
    knex
      .distinct()
      .select("name")
      .from("users")
      .where("users.id", "=", req.params.commenter_id)
      .then((results) => {
        res.json(results[0]);
      });
  });

  router.get("/:id/docs", (req, res) => {
    knex
      .distinct()
      .select("url", "description", "title", "urls.id", "creator_id")
      .from("urls")
      .join('likes', 'urls.id', 'url_id')
      .where('creator_id', '=', req.session.user.id)
      .orWhere('liker_id', '=', req.session.user.id)
      .then((results) => {
        res.json(results);
      });
  });
  return router;
}
