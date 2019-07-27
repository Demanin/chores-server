const Users = require('./Postgres/Users');
const Wheels = require('./Postgres/Wheels');

const pgp = require('pg-promise')({
  extend(obj, dc) {
    obj.Users = new Users(obj);
    obj.Wheels = new Wheels(obj, pgp);
  }
});

const Postgres = pgp({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  max: 20,
  statement_timeout: 10000,
});

module.exports = Postgres;
