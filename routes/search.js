"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get(`/:topic-:query`, (req, res) => {
    const query = req.params.query
      .replace(':', ''),
     topic = (req.params.topic)
       .replace(':', '')
       .replace('alldocs', '');
      if(topic) {
        knex
        .select("*")
        .from("urls")
        .join('tagged_topics', 'urls.id', `url_id`)
        .join('topics', 'topics.id', 'topic_id')
        .where('topics.id','=', `${Number(topic)}`)
        .andWhere(function() {
          this.where('description', 'like', `%${query}%`)
              .orWhere('title', 'like', `%${query}%`)
        })
        .then((results) => {
          res.json(results);
        });
      } else {
        knex
          .select("*")
          .from("urls")
          .where('description', 'like', `%${query}%`)
          .orWhere('title', 'like', `%${query}%`)
          .then((results) => {
            res.json(results);
        });
      }
  });
  return router;
}
