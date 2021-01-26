const {Pool} = require('pg');
// heroku database
const pool_heroku = new Pool({
    user: 'exqjhahjxhxgpi',
    password: 'c52b707e33087fb0c1646860c77b85f4734aeee4786702d703640f172fb0a6c3',
    database: 'dcouv2s8q4a3eh',
    host: 'ec2-52-44-139-108.compute-1.amazonaws.com',
    port: '5432'
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
