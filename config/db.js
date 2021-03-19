const {Pool} = require('pg');
// heroku database
const pool_heroku = new Pool({
    user: 'huezrtdstrnpjb',
    password: '3e671a9599d101cd9a2d3d2c0545edfe0e2aec3718da58be73758e4d7887a5e0',
    database: 'de7gt9f6dtmh45',
    host: 'ec2-54-205-183-19.compute-1.amazonaws.com',
    port: '5432',
    ssl: true,
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
