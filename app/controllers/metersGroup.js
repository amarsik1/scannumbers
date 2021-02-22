const pool = require('../../config/db'),
    {isExist: consumerIsExist} = require('./consumer'),
    {isExist: addressIsExist} = require('./address'),
    {validateMetersGroup} = require('../models/metersGroup.model');

const getMeters = async (req, res) => {
    const {id} = req.params;
    if (!await isExist(id)) return res.status(400).send('Meters group does not exists');

    const meters = await pool.query('select * from meter where meters_group_id = $1', [id]);

    if (!!!meters.rows.length) return res.status(400).send("There are no meters in this group");

    res.status(200).send(meters.rows)
};

const isExist = async (_id) => {
    const metersGroup = await pool.query("SELECT * FROM meters_group where meters_group_id = $1", [_id]);
    return !!metersGroup.rows.length
};

const isValueExist = async (metersGroup) => {
    const {consumer_id, address_id} = metersGroup;
    const meterGroup = await pool.query("SELECT * FROM meters_group where consumer_id = $1 and address_id = $2",
        [consumer_id, address_id]);
    const meterGroupAddress = await pool.query("SELECT * FROM meters_group where address_id = $1",
        [address_id]);
    return !!meterGroup.rows[0] || !!meterGroupAddress.rows[0]
};

const create = async (req, res) => {
    const {error} = validateMetersGroup(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (await isValueExist(req.body)) return res.status(400).send('Meters group with this value already exists');
    const {name, consumer_id, address_id} = req.body;

    if (!await consumerIsExist(consumer_id)) return res.status(400).send('Consumer does not exists');
    if (!await addressIsExist(address_id)) return res.status(400).send('Address does not exists');
    const newMetersGroup = await pool.query("INSERT INTO meters_group (name, consumer_id, address_id) VALUES ($1,$2,$3) RETURNING *",
        [name, consumer_id, address_id]);

    res.status(200).send(newMetersGroup.rows[0]);
};

const update = async (req, res) => {
    const {error} = validateMetersGroup(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {name, consumer_id, address_id} = req.body;
    const {id} = req.params;

    if (!await isExist(id)) return res.status(400).send('Meters group does not exists');

    if (!await consumerIsExist(consumer_id)) return res.status(400).send('Consumer does not exists');
    if (!await addressIsExist(address_id)) return res.status(400).send('Address does not exists');

    if (await isValueExist(req.body).length)
        if (await isValueExist(req.body).meters_group_id !== id) return res.status(400).send('Meters group with this value already exists');

    await pool.query("UPDATE meters_group SET name = $1, consumer_id = $2, address_id = $3 where meters_group_id = $4",
        [name, consumer_id, address_id, id]);

    res.status(200).send("Meters group was successfully updated");
};

const deleteOne = async (req, res) => {
    const {id} = req.params;

    if (!await isExist(id)) return res.status(400).send('Meters group does not exists');
    await pool.query('delete from meters_group where meters_group_id = $1', [id]);

    res.status(200).send('Successfully deleted');
};


module.exports = {
    getMeters,
    isExist,
    create,
    update,
    deleteOne
};