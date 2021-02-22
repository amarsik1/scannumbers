const pool = require('../../config/db'),
    {validateUser, generateAuthToken, getIdFromToken} = require('../models/consumer.model'),
    bCrypt = require('bcrypt');

const create = async (req, res) => {
    try {
        const {error} = validateUser(req.body);
        if (error) return res.status(400).jsonp(error.details[0].message);

        const {body} = req;

        const inDbUser = await pool.query('SELECT * FROM consumer where email=$1', [body.email]);
        if (inDbUser.rows[0]) return res.status(400).send('User already exists');

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

const isExist = async (_id) => {
    const consumer = await pool.query("SELECT * FROM consumer where consumer_id = $1", [_id]);
    return !!consumer.rows.length
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) return res.status(400).send('Empty password or email');

        const DbUser = await pool.query('SELECT * FROM consumer where email=$1', [email]),
            inDbUser = DbUser.rows[0];
        if (!inDbUser) return res.status(400).send('User does not exists');

        const isPasswordCorrect = await bCrypt.compare(password, inDbUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).send('Wrong password');
        }

        const token = generateAuthToken(inDbUser._id);

        res
            .header("x-auth-token", token)
            .status(200)
            .send({
                consumer_id: inDbUser.consumer_id,
                name: inDbUser.name,
                surname: inDbUser.surname,
                patronymic: inDbUser.patronymic,
                email: inDbUser.email,
            });
    } catch (err) {
        console.log(err);
        res.status(500);
    }
};

const findOne = async (req, res) => {

    const {id} = req.params;

    if (isNaN(+id) && !!id) res.status(400).send('Invalid value');

    if (!await isExist(id)) return res.status(400).send('User does not exists');

    const user = await pool.query('select * from consumer where consumer_id = $1', [id]);
    const inDbUser = user.rows[0];

    res.status(200).send({
        consumer_id: inDbUser.consumer_id,
        name: inDbUser.name,
        surname: inDbUser.surname,
        patronymic: inDbUser.patronymic,
        email: inDbUser.email,
    });
};

const deleteOne = async (req, res) => {
    const {id} = req.params;

    if (!await isExist(id)) return res.status(400).send('User does not exists');

    await pool.query('delete from consumer where consumer_id = $1', [id]);

    res.status(200).send('Successfully deleted');
};

const getAllInfoFromMeters = async (req, res) => {
    const token = req.get('Authorization');
    const id = getIdFromToken(token);

    const response = await pool.query('select * from meters_group where consumer_id = $1', [id]);
    const metersGroup = response.rows;

    // on this rows killed three hours
    // TODO: remove for
    for (let i = 0; i < metersGroup.length; i++) {
        const group = metersGroup[i];
        const response = await pool.query('select * from meter where meters_group_id = $1', [group.meters_group_id]);
        const meters = response.rows;
        console.log()
        for (let j = 0; j < meters.length; j++) {
            const meter = meters[j];
            const allMeterData = await pool.query("SELECT * FROM meter_data where meter_id = $1", [meter.meter_id]);
            meters[j].meterData = allMeterData.rows;
        }
        metersGroup[i].meters = meters;
    }


    res.status(200).json(metersGroup);
};

module.exports = {
    create,
    login,
    isExist,
    findOne,
    deleteOne,
    getAllInfoFromMeters
};