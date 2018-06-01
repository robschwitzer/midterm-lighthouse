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
        .leftJoin('tagged_topics', 'urls.id', `url_id`)
        .leftJoin('topics', 'topics.id', 'topic_id')
        .where('topics.topic','=', `${topic}`)
        .where('description', 'like', `%${query}%`)
        .orWhere('title', 'like', `%${query}%`)
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
/*
select * from urls 
join tagged_topics on tagged_topics.url_id = urls.id join topics on topic_id = topics.id where topics.topic = '${var}';
*/