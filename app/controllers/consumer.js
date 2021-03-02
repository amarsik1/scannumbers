const {validateUser, generateAuthToken, getIdFromToken} = require('../models/consumer.model'),
    bCrypt = require('bcrypt');
const consumerService = require('../service/consumer.service');

const create = async (req, res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).jsonp(error.details[0].message);

    const {body} = req;

    const inDbUser = consumerService.findByEmail(body.email)
    if (inDbUser) return res.status(400).send('User already exists');

    body.password = await bCrypt.hash(body.password, 10);

    const newConsumer = consumerService.create(body);
    const {consumer_id} = newConsumer;

    const token = generateAuthToken(consumer_id);
    res
        .header("x-auth-token", token)
        .status(200)
        .send({
            consumer_id: consumer_id,
            name: body.name,
            surname: body.surname,
            patronymic: body.patronymic,
            email: body.email,
        });
};

const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) return res.status(400).send('Empty password or email');

    const DbUser = consumerService.findByEmail(email);
    if (!DbUser) return res.status(400).send('User does not exists');

    const isPasswordCorrect = await bCrypt.compare(password, DbUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).send('Wrong password');
    }

    const token = generateAuthToken(DbUser.consumer_id);

    res
        .header("x-auth-token", token)
        .status(200)
        .send({
            consumer_id: DbUser.consumer_id,
            name: DbUser.name,
            surname: DbUser.surname,
            patronymic: DbUser.patronymic,
            email: DbUser.email,
        });
};

const findOne = async (req, res) => {

    const {id} = req.params;

    if (isNaN(+id) && !!id) res.status(400).send('Invalid value');
    if (!await consumerService.isExist(id)) return res.status(400).send('User does not exists');

    const inDbUser = consumerService.findOne(id);

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

    if (!await consumerService.isExist(id)) return res.status(400).send('User does not exists');

    await consumerService.deleteOne(id);
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
    findOne,
    deleteOne,
    getAllInfoFromMeters
};