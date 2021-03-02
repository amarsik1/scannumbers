const pool = require('../../config/db');

const isExist = async (id) => {
    const metersGroup = await pool.query("SELECT * FROM meters_group where meters_group_id = $1", [id]);
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

const create = async (group) => {
    const {consumer_id, address_id, name} = group;
    const newGroup = await pool.query("INSERT INTO meters_group (name, consumer_id, address_id) VALUES ($1,$2,$3) RETURNING *",
        [name, consumer_id, address_id]);
    return newGroup.rows[0];
};

const update = async (group) => {
    const {id, name, consumer_id, address_id} = group;
    await pool.query("UPDATE meters_group SET name = $1, consumer_id = $2, address_id = $3 where meters_group_id = $4",
        [name, consumer_id, address_id, id]);
};

const deleteOne = async (id) => {
    await pool.query('delete from meters_group where meters_group_id = $1', [id]);

};

module.exports = {
    isExist,
    isValueExist,
    create,
    update,
    deleteOne
}