exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, name: 'Alice', password: '1234', email: 'Alice@example.com'}),
        knex('users').insert({id: 2, name: 'Bob', password: '1234', email: 'Bob@example.com'}),
        knex('users').insert({id: 3, name: 'Jim', password: '1234', email: 'Jim@example.com'}),

        knex('urls').insert({id: 1, title: 'foo', url: 'http://www.foo.com', description: '1234', created_at: '2012-04-03', creator_id: 1}),
        knex('urls').insert({id: 2, title: 'bar', url: 'http://www.bar.com', description: '1234', created_at: '2012-04-03', creator_id: 1}),
        knex('urls').insert({id: 3, title: 'baz', url: 'http://www.baz.com', description: '1234', created_at: '2012-04-03', creator_id: 1}),

        knex('topics').insert({id: 1, topic: 'ajax'}),
        knex('topics').insert({id: 2, topic: 'node.js'}),

        knex('likes').insert({id: 1, like: false, liker_id: 1, url_id: 1}),

        knex('ranks').insert({id: 1, rank: true, ranker_id: 2, url_id: 2}),

        knex('comments').insert({id: 1, comment: 'foo bar buzz', commenter_id: 1, url_id: 1}),

        knex('tagged_topics').insert({id: 1, topic_id: 1, url_id: 1}),
        knex('tagged_topics').insert({id: 2, topic_id: 2, url_id: 2}),

        knex('users').insert({id: 4, name: 'Shteve', password: '5678', email: 'shteve@example.com'}),
        knex('users').insert({id: 5, name: 'Byler', password: '5678', email: 'byler@example.com'}),
        knex('users').insert({id: 6, name: 'Pevin', password: '5678', email: 'pevin@example.com'}),

        knex('urls').insert({id: 4, title: 'cat', url: 'http://www.cat.com', description: '6789', created_at: '2011-04-03', creator_id: 4}),
        knex('urls').insert({id: 5, title: 'mouse', url: 'http://www.mouse.com', description: '6789', created_at: '2011-04-03', creator_id: 5}),
        knex('urls').insert({id: 6, title: 'elephant', url: 'http://www.elephant.com', description: '6789', created_at: '2011-04-03', creator_id: 6}),

        knex('topics').insert({id: 3, topic: 'ruby'}),
        knex('topics').insert({id: 4, topic: 'html'}),

        knex('likes').insert({id: 2, like: false, liker_id: 2, url_id: 2}),

        knex('ranks').insert({id: 2, rank: true, ranker_id: 3, url_id: 3}),

        knex('comments').insert({id: 2, comment: 'foo bar buzz', commenter_id: 2, url_id: 2}),

        knex('tagged_topics').insert({id: 3, topic_id: 3, url_id: 3}),
        knex('tagged_topics').insert({id: 4, topic_id: 4, url_id: 4})
      ]);
    });
};
