"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

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
/*
knex.select('*').from('users').join('contacts', function() {
    this.on('users.id', '=', 'contacts.id').onIn('contacts.id', [7, 15, 23, 41])
  })*/