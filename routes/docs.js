"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    knex
      ('urls').insert({
    id: req.body.id,
    url: req.body.url,
    title: req.body.title,
    description: req.body.title,
    created_at: req.body.created_at,
    creator_id: req.body.creator_id
    })
      .then((results) => {
        res.json(results);
    });
  });

  router.put("/:id", (req, res) => {
    knex
      ('urls')
  .update({
    url: req.body.url,
    title: req.body.title,
    description: req.body.description,
    }).where('id','=', req.params.id)
      .then(() => {
        knex
        ('tagged_topics')
        .insert({
          topic_id: req.body.topic_id
        })
        .where('urls.id', '=', 'tagged_topics.topic_id')
      })
      .then((results) => {
        res.send(200);
    })
  });

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("urls")
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}

