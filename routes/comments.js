"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    knex
      ("comments")
      .insert({
        comment: req.body.comment,
        url_id: req.body.url_id,
        commenter_id: req.body.commenter_id
      })
      .then(function (result) {
        res.json({
          success: result,
          message: req.body.comment
        }); // respond back to request
      })
  });

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("comments")
      .then((results) => {
        res.json(results);
      });
  })

  return router;
}
