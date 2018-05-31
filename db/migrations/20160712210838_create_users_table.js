exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function (table) {
      table.increments('id');
      table.string('name');
      table.string('email');
      table.string('password');
    }),
    knex.schema.createTable('comments', function (table) {
      table.increments('id');
      table.text('comment');
      table.integer('commenter_id');
      table.integer('url_id');
    }),
    knex.schema.createTable('ranks', function (table) {
      table.increments('id');
      table.string('rank');
      table.integer('ranker_id');
      table.integer('url_id');
    }),
    knex.schema.createTable('likes', function (table) {
      table.increments('id');
      table.string('like');
      table.integer('liker_id');
      table.integer('url_id');
    }),
    knex.schema.createTable('urls', function (table) {
      table.increments('id');
      table.string('title');
      table.string('url');
      table.string('description');
      table.date('created_at');
      table.integer('creator_id');
    }),
    knex.schema.createTable('tagged_topics', function (table) {
      table.increments('id');
      table.integer('topic_id');
      table.integer('url_id');
    }),
    knex.schema.createTable('topics', function (table) {
      table.increments('id');
      table.string('topic');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
  knex.schema.dropTable('comments'),
  knex.schema.dropTable('ranks'),
  knex.schema.dropTable('likes'),
  knex.schema.dropTable('urls'),
  knex.schema.dropTable('tagged_topics'),
  knex.schema.dropTable('topics')
  ])
};
