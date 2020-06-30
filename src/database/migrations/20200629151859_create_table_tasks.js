
exports.up = function(knex) {
    return knex.schema.createTable('tasks', function(table){
        table.increments('id').primary();
        table.string('desc').notNull();
        table.datetime('estimate_at');
        table.datetime('done_at');
        table.integer('user_id').references('id').inTable('users').notNull();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tasks')
};
