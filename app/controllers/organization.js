const pool = require('../../config/db'),
    {validateOrganization} = require('../models/organization.model'),
    {isExist: addressIsExist} = require('./address');

const isExist = async (_id) => {
    const organization = await pool.query("SELECT * FROM organization where organization_id = $1", [_id]);
    return !!organization.rows.length
};

const isValueExist = async (organization) => {
    const {name, resource_type_id, address_id, edrpou} = organization;
    const organizationInDb = await pool.query(
        "SELECT * FROM organization where name = $1 and resource_type_id = $2 and address_id = $3 and edrpou = $4",
        [name, resource_type_id, address_id, edrpou]
    );
    return !!organizationInDb.rows.length
};

const create = async (req, res) => {
    const {error} = validateOrganization(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {name, resource_type_id, address_id, edrpou} = req.body;

    const organizationInDb = await pool.query('select * from organization where edrpou = $1', [edrpou]);
    if (!!organizationInDb.rows.length) return res.status(400).send('Organization with this edrpou already exists');

    if (await isValueExist(req.body)) return res.status(400).send('Organization with this value already exists');

    if (!await addressIsExist(address_id)) return res.status(400).send('Address does not exists');

    const newOrganization = await pool.query(
        "INSERT INTO organization (name, resource_type_id, address_id, edrpou) VALUES ($1,$2,$3,$4) RETURNING *",
        [name, resource_type_id, address_id, edrpou]
    );

    res.status(200).send(newOrganization.rows[0]);
};

const getOne = async (req, res) => {
    const id = parseInt(req.params.id);

    if(isNaN(id)) return res.status(400).send('Invalid value organization_id');

    if (!await isExist(id)) return res.status(400).send('Organization does not exists');

    const organization = await pool.query('select * from organization where organization_id = $1', [id]);

    res.status(200).send(organization.rows[0]);
};

const update = async (req, res) => {
    const {error} = validateOrganization(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {id} = req.params;
    const {name, address_id} = req.body;

    if (await isValueExist(req.body)) return res.status(400).send('Organization with this value already exists');
    if (!await isExist(id)) return res.status(400).send('Organization does not exists');
    if (!await addressIsExist(address_id)) return res.status(400).send('Address does not exists');

    await pool.query("UPDATE organization SET name = $1, address_id = $2 where organization_id = $3",
        [name, address_id, id]);

    res.status(200).send("Organization info was successfully updated");
};

module.exports = {
    isExist,
    create,
    update,
    getOne
};