const pool = require('../../config/db');

const isExist = async (id) => {
    const organization = await pool.query("SELECT * FROM organization where organization_id = $1", [id]);
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

const create = async (organization) => {
    const {name, resource_type_id, address_id, edrpou} = organization;
    const newOrganization = await pool.query(
        "INSERT INTO organization (name, resource_type_id, address_id, edrpou) VALUES ($1,$2,$3,$4) RETURNING *",
        [name, resource_type_id, address_id, edrpou]
    );
    return newOrganization.rows[0];
};

const getOne = async (id) => {
    const organization = await pool.query('select * from organization where organization_id = $1', [id]);
    return organization.rows[0];
};

const getOneByEDRPOU = async (edrpou) => {
    const organization = await pool.query('select * from organization where edrpou = $1', [edrpou]);
    return organization.rows[0];
};

const update = async (organization) => {
    const {organization_id, address_id, name} = organization;
    await pool.query("UPDATE organization SET name = $1, address_id = $2 where organization_id = $3",
        [name, address_id, organization_id]);
};

const getOrganizationByResourceId = async (id) => {
    const organizations = await pool.query('select * from organization where resource_type_id = $1', [id]);
    return organizations.rows;
};

module.exports = {
    isExist,
    isValueExist,
    getOneByEDRPOU,
    create,
    getOne,
    update,
    getOrganizationByResourceId
}