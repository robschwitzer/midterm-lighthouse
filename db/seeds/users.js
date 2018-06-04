exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id:1, name:'Matty', email:'matt@example.com', password:'1234'}),
        knex('users').insert({id:2, name:'Rob', email:'rob@example.com', password:'1234'})
      ]);
    });
};
