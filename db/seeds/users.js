exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('topics').insert({id: 5, topic: 'sql'}),
        knex('topics').insert({id: 6, topic: 'java'}),
        knex('topics').insert({id: 7, topic: 'c#'}),
        knex('topics').insert({id: 8, topic: 'python'})
      ]);
    });
};
