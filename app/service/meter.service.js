const pool = require('../../config/db');

const isExist = async (id) => {
    const allMeterData = await pool.query("SELECT * FROM meter where meter_id = $1", [id]);
    return !!allMeterData.rows.length;
};

const isValueExist = async (meter) => {
    const {resource_type_id, organization_id, meters_group_id} = meter;
    const meterInDb = await pool.query(
        "SELECT * FROM meter where resource_type_id = $1 and organization_id = $2 and meters_group_id = $3",
        [resource_type_id, organization_id, meters_group_id]
    );
    return meterInDb.rows;
};

const create = async (meter) => {
    const {personal_account, resource_type_id, organization_id, meters_group_id} = meter;
    const newMeter = await pool.query("INSERT INTO meter (personal_account, resource_type_id, organization_id, meters_group_id) VALUES ($1,$2,$3,$4) RETURNING *",
        [personal_account, resource_type_id, organization_id, meters_group_id]);
    return newMeter.rows[0];
};

const getMetersByGroupId = async (id) => {
    const meters = await pool.query('select * from meter where meters_group_id = $1', [id]);
    return meters.rows;
};

const update = async (meter) => {
    const {id, personal_account, resource_type_id, organization_id, meters_group_id} = meter;
    await pool.query("UPDATE meter SET personal_account = $1, resource_type_id = $2, organization_id = $3, meters_group_id = $4 where meter_id = $5",
        [personal_account, resource_type_id, organization_id, meters_group_id, id]);
};

const deleteOne = async (id) => {
    await pool.query('delete from meter where meter_id = $1', [id]);
};

module.exports = meterServise = {
    isExist,
    getMetersByGroupId,
    isValueExist,
    create,
    update,
    deleteOne
}
