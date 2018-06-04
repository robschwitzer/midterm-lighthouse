exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id:1, name:'Matty', email:'matt@example.com', password:'1234'}),
        knex('users').insert({id:2, name:'Rob', email:'rob@example.com', password:'1234'}),
        knex('topics').insert({id:2, topic:'html/css'}),
        knex('topics').insert({id:3, topic:'Ruby'}),
        knex('topics').insert({id:4, topic:'Ajax'}),
        knex('topics').insert({id:5, topic:'SQL'}),
        knex('topics').insert({id:6, topic:'Java'}),
        knex('topics').insert({id:7, topic:'C#'}),
        knex('topics').insert({id:8, topic:'Python'})
      ]);
    });
};