exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, name: 'Alice', password: '1234', email: 'Alice@example.com'}),
        knex('users').insert({id: 2, name: 'Bob', password: '1234', email: 'Bob@example.com'}),
        knex('users').insert({id: 3, name: 'Jim', password: '1234', email: 'Jim@example.com'}),
        knex('urls').insert({id: 1, title: 'foo', url: 'http://www.foo.com', description: '1234', created_at: '2012-04-03'}),
        knex('urls').insert({id: 2, title: 'bar', url: 'http://www.bar.com', description: '1234', created_at: '2012-04-03'}),
        knex('urls').insert({id: 3, title: 'baz', url: 'http://www.baz.com', description: '1234', created_at: '2012-04-03'}),
        knex('topics').insert({id: 1, topic: 'ajax'}),
        knex('topics').insert({id: 2, topic: 'node.js'}),
        knex('likes').insert({id: 1, like: false, liker_id: 1, url_id: 1}),
        knex('ranks').insert({id: 1, rank: true, ranker_id: 2, url_id: 2}),
        knex('comments').insert({id: 1, comment: 'foo bar buzz', commenter_id: 1, url_id: 1})
      ]);
    });
};
