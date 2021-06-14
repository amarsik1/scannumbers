const { validateUser, validateUpdateUser, generateAuthToken, getIdFromToken } = require('../models/consumer.model'),
    bCrypt = require('bcrypt');
const consumerService = require('../service/consumer.service');
const meterGroupService = require('../service/meterGroup.service');
const meterService = require('../service/meter.service');
const meterDataService = require('../service/meterData.service');

const create = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).jsonp(error.details[0].message);

    const { body } = req;

    const inDbUser = await consumerService.findByEmail(body.email)
    if (inDbUser) return res.status(400).send({ message: 'User already exists' });

    body.password = await bCrypt.hash(body.password, 10);

    const newConsumer = await consumerService.create(body);
    const { consumer_id } = newConsumer;

    const token = generateAuthToken(consumer_id);
    res
        .header("x-auth-token", token)
        .status(201)
        .send({
            consumer_id: consumer_id,
            name: body.name,
            surname: body.surname,
            patronymic: body.patronymic,
            email: body.email,
        });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ message: 'Empty password or email' });

    const DbUser = await consumerService.findByEmail(email);
    if (!DbUser) return res.status(401).send({ message: 'User does not exists' });

    const isPasswordCorrect = await bCrypt.compare(password, DbUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).send({ message: 'Wrong password' });
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

    const { id } = req.params;

    if (isNaN(+id) && !!id) res.status(400).send({ message: 'Invalid value' });
    if (!await consumerService.isExist(id)) return res.status(400).send({ message: 'User does not exists' });

    const inDbUser = await consumerService.findById(id);

    res.status(200).send({
        consumer_id: inDbUser.consumer_id,
        name: inDbUser.name,
        surname: inDbUser.surname,
        patronymic: inDbUser.patronymic,
        email: inDbUser.email,
    });
};

const deleteOne = async (req, res) => {
    const { id } = req.params;

    if (isNaN(+id) && !!id) res.status(400).send({ message: 'Invalid value' });
    if (!await consumerService.isExist(id)) return res.status(400).send({ message: 'User does not exists' });

    await consumerService.deleteOne(id);
    res.status(200).send({ message: 'Successfully deleted' });
};

const getAllInfoFromMeters = async (req, res) => {
    const token = req.get('Authorization');
    const id = getIdFromToken(token);

    const groups = await meterGroupService.getGroupsByUserId(id);

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        const meters = await meterService.getMetersByGroupId(group.meters_group_id);
        for (let j = 0; j < meters.length; j++) {
            const meter = meters[j];
            const allMeterData = await meterDataService.getFromOne(meter.meter_id);
            meters[j].meterData = allMeterData.rows;
        }
        groups[i].meters = meters;
    }

    res.status(200).json(groups);
};

const update = async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) return res.status(400).jsonp(error.details[0].message);

    if (!await consumerService.isExist(req.body.id)) return res.status(400).send({ message: 'User does not exists' });

    await consumerService.update(req.body);
    res.status(200).send({ message: "Consumer info was successfully updated" });
};

module.exports = {
    create,
    login,
    findOne,
    deleteOne,
    getAllInfoFromMeters,
    update
};