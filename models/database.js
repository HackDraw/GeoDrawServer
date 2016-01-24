var pgp = require("pg-promise")();
const PG_CONNECTION = {
    host: 'localhost',
    port: 5432,
    database: 'geodraw',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD
};

module.exports = {
    getConnectionObj: function() {
        return PG_CONNECTION;
    }
}
