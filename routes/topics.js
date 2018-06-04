"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get("/docs/:doc_id", (req, res) => {
    knex
      .select("topic")
      .from("topics")
      .join('tagged_topics', 'topics.id', 'topic_id')
      .where('tagged_topics.url_id', '=', req.params.doc_id)
      .then((results) => {
        res.json(results[0]);
      });
  });
  router.post("/:topic_id/docs/:doc_id", (req, res) => {
    knex
      ('tagged_topics')
      .insert({
          topic_id: req.params.topic_id,
          url_id: req.params.doc_id
      })
      .then((results) => {
        res.json('all is good');
      });
  });

  return router;
}
