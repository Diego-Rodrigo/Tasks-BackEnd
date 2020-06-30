const knex = require('knex');

const config = process.env.NODE_ENV === 'test' ? configuration.test : configuration.development;
const configuration = require('../../knexfile');

const connection = knex(config);

module.exports = connection;