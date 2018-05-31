"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get(`/:search`, (req, res) => {
    const query = (req.params.search)//.replace(/(\d*)([^\w]*)/, ' ')
    knex
      .select("*")
      .from("urls")
      .where('description', 'like', `%${query}%`)
      .orWhere('title', 'like', `%${query}%`)
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}