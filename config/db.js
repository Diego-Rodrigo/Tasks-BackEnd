const config = require('../knexfile');

const knex = require('knex')(config['development'])

knex.migrate.latest([config])

module.exports = knex;