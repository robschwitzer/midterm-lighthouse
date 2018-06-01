"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get(`/:url_id`, (req, res) => {
    knex
      ("ranks")
      .count('rank')
      .where("url_id", "=", req.params.url_id)
      .where('rank', '=', 'true')
      .then(function (result) {
        res.json({
          result: result
        }); // respond back to request
      });
  });

  router.post("/", (req, res) => {
    knex
      ("ranks")
      .insert({
        rank: req.body.rank,
        ranker_id: req.body.ranker_id,
        url_id: req.body.url_id
      })
      .then(function () {
        res.json({
          message: 'successfully ranked'
        }); // respond back to request
      })
      .catch({
        err: 'like authentication failed'
      });

  });

  router.put("/", (req, res) => {
    knex
      ("ranks")
      .update({
        rank: req.body.rank,
      })
      .where('url_id', '=', req.body.url_id)
      .where('ranker_id', '=', req.body.ranker_id)
      .then(function () {
        res.json({
          message: 'successfully adjusted rank'
        }); // respond back to request
      })
      .catch({
        err: 'like authentication failed'
      });

  });

  return router;
}
