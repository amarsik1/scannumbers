const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'amarsik',
    database: 'meters',
    host: 'localhost',
    port: '5432'
});

module.exports = pool;