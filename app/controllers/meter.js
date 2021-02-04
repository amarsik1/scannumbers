const pool = require('../../config/db'),
    {isExist: metersGroupIsExist} = require('./metersGroup'),
    {isExist: organizationIsExist} = require('./organization'),
    {validateMeter} = require('../models/meter.model');

const isExist = async (_id) => {
    const allMeterData = await pool.query("SELECT * FROM meter where meter_id = $1", [_id]);
    return !!allMeterData.rows.length
};

const isValueExist = async (meter) => {
    const {resource_type_id, organization_id, meters_group_id} = meter;
    const meterInDb = await pool.query(
        "SELECT * FROM meter where resource_type_id = $1 and organization_id = $2 and meters_group_id = $3",
        [resource_type_id, organization_id, meters_group_id]
    );
    return meterInDb.rows
};

const create = async (req, res) => {
    try {
        const {error} = validateMeter(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        if (!!isValueExist(req.body).rows.length) return res.status(400).send('Meter with this value already exists');
        const {personal_account, resource_type_id, organization_id, meters_group_id} = req.body;

        if (!await metersGroupIsExist(meters_group_id)) return res.status(400).send('Meter group does not exists');
        if (!await organizationIsExist(organization_id)) return res.status(400).send('Organization does not exists');

        const newMeter = await pool.query("INSERT INTO meter (personal_account, resource_type_id, organization_id, meters_group_id) VALUES ($1,$2,$3,$4) RETURNING *",
            [personal_account, resource_type_id, organization_id, meters_group_id]);

        res.status(200).send(newMeter.rows[0]);
    } catch (err) {
        res.status(500).send(err)
    }
};

const update = async (req, res) => {
    const {error} = validateMeter(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const {personal_account, resource_type_id, organization_id, meters_group_id} = req.body;
    const {id} = req.params;

    if (!await metersGroupIsExist(meters_group_id)) return res.status(400).send('Meter group does not exists');
    if (!await organizationIsExist(organization_id)) return res.status(400).send('Organization does not exists');
    if (!await isExist(id)) return res.status(400).send('Meter does not exists');

    const meterInDb = await isValueExist(req.body);
    if (!!meterInDb.length)
        if (meterInDb[0].meter_id !== +id) return res.status(400).send('Meter with this value already exists');

    await pool.query("UPDATE meter SET personal_account = $1, resource_type_id = $2, organization_id = $3, meters_group_id = $4 where meter_id = $5",
        [personal_account, resource_type_id, organization_id, meters_group_id, id]);

    res.status(200).send("Meters group was successfully updated");
};

module.exports = {
    isExist,
    create,
    update
};