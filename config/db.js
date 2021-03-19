const { Pool } = require('pg');
// heroku database
const pool_heroku = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
//localhost
const pool_localhost = new Pool({
    user: 'postgres',
    password: 'amarsik',
    database: 'meters',
    host: 'localhost',
    port: '5432'
});

if (process.argv[2] === "dev")
    module.exports = pool_localhost;
else
    module.exports = pool_heroku;
