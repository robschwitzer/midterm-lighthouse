"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get(`/:url_id`, (req, res) => {
    knex
      ("ranks")
      .count('rank')
      .where("ranker_id", "=", req.session.user.id)
      .where('url_id', '=', req.params.url_id)
      .then(function (result) {
        res.json(result[0]); // respond back to request
      });
  });

  router.post("/:url_id", (req, res) => {
    knex
      ("ranks")
      .insert({
        id: undefined,
        rank: true,
        ranker_id: req.session.user.id,
        url_id: req.params.url_id
      })
      .then(function () {
        res.json({
          message: 'all ok'
        }); // respond back to request
      })
  });

  router.delete("/:url_id", (req, res) => {
    knex
      ("ranks")
      .where('ranker_id', '=', req.session.user.id)
      .where('url_id', '=', req.params.url_id)
      .del()

      .then(function () {
        res.json({
          message: 'successfully adjusted rank'
        }); // respond back to request
      });
  });
  return router;
}
