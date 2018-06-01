"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get(`/:url_id`, (req, res) => {
    knex
      ("likes")
      .count('like')
      .where("url_id", "=", req.params.url_id)
      .where('like', '=', 'true')
      .then(function (result) {
        res.json({
          result: result
        }); // respond back to request
      });
  });

  router.post("/", (req, res) => {
    knex
      ("likes")
      .insert({
        like: req.body.like,
        liker_id: req.body.liker_id,
        url_id: req.body.url_id
      })
      .then(function () {
        res.json({
          message: 'ok'
        }); // respond back to request
      })
  });

  router.put("/", (req, res) => {
    knex
      ("likes")
      .update({
        like: req.body.like,
      })
      .where('url_id', '=', req.body.url_id)
      .where('liker_id', '=', req.body.liker_id)
      .then(function () {
        res.json({
          message: 'successfully adjusted like'
        }); // respond back to request
      });
  });
  return router;
}
