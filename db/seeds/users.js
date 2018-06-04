exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id:6, name:'Matty', email:'Mattischad@example.com', password:'1234'})
      ]);
    });
};
