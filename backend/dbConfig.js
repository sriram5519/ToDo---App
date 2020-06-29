const knex = require('knex');

const CONFIG = {
    client: "pg",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "password",
        database: "todo-app",
        charset: "utf8"
    }
}

const config = knex(CONFIG);
module.exports = require('bookshelf')(config);