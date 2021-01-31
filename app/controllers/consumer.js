const pool = require('../../config/db'),
    {validateUser, generateAuthToken} = require('../models/consumer.model'),
    bCrypt = require('bcrypt');

const create = async (req, res) => {
    try {
        const {error} = validateUser(req.body);
        if (error) return res.status(400).jsonp(error.details[0].message);

        const {body} = req;

        const inDbUser = await pool.query('SELECT * FROM consumer where email=$1', [body.email]);
        if (inDbUser.rows[0]) return res.status(400).jsonp('User already exists');

        body.password = await bCrypt.hash(body.password, 10);

        const newConsumer = await pool.query("INSERT INTO consumer (name, surname, patronymic, email, password) values ($1,$2,$3,$4,$5)  RETURNING *", Object.values(body));
        const newConsumerId = newConsumer.rows[0].consumer_id;

        const token = generateAuthToken(newConsumerId);
        res
            .header("x-auth-token", token)
            .status(200)
            .send({
                consumer_id: newConsumerId,
                name: body.name,
                surname: body.surname,
                patronymic: body.patronymic,
                email: body.email,
            });
    } catch (err) {
        console.log(err);
        res.status(500);
    }
};

module.exports = {
    create
};