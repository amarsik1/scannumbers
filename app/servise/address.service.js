const pool = require('../../config/db');

const create = async (row) => {
    const newAddress = await pool.query("INSERT INTO address (street_type_id, street_name, house_number, apartment_number) VALUES ($1,$2,$3,$4) RETURNING *",
        Object.values(row));
    return newAddress.rows[0];
};

const getOne = async (id) => {
    const address = await pool.query("SELECT * FROM address where address_id = $1", [id]);
    return address.rows[0];
};

const deleteOne = async (id) => {
    try {
        await pool.query("DELETE FROM address WHERE address_id = $1", [id]);
        return {type: 'ok'};
    } catch (err) {
        if (err.code === "23503") return {type: 'error', message: "Key \"address id\" is still referenced in the tables"};
        return {type: 'error', message: err};
    }
};

const update = async (address) => {
    const {id, street_type_id, street_name, house_number, apartment_number} = address;
    await pool.query("UPDATE address SET street_type_id = $1, street_name = $2, house_number = $3, apartment_number = $4 where address_id = $5",
        [street_type_id, street_name, house_number, apartment_number, id]);
};

const isExist = async (id) => {
    const allMeterData = await pool.query("SELECT * FROM address where address_id = $1", [id]);
    return !!allMeterData.rows.length;
};

const isValueExist = async (address) => {
    const {street_type_id, street_name, house_number, apartment_number} = address;
    const allMeterData = await pool.query("SELECT * FROM address where street_type_id = $1 and street_name = $2 and house_number = $3 and apartment_number = $4",
        [street_type_id, street_name, house_number, apartment_number]);
    return !!allMeterData.rows.length;
};

module.exports = {
    create,
    deleteOne,
    update,
    getOne,
    isValueExist,
    isExist
}