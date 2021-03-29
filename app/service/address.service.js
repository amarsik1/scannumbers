const pool = require('../../config/db');

const create = async (row) => {
    const { street_type, street_name, house_number, apartment_number, city } = row;
    const newAddress = await pool.query("INSERT INTO address (street_type, street_name, house_number, apartment_number, city) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [street_type, street_name, house_number, apartment_number, city]);
    return newAddress.rows[0];
};

const getOne = async (id) => {
    const address = await pool.query("SELECT * FROM address where address_id = $1", [id]);
    return address.rows[0];
};

const deleteOne = async (id) => {
    try {
        await pool.query("DELETE FROM address WHERE address_id = $1", [id]);
        return { type: 'ok' };
    } catch (err) {
        if (err.code === "23503") return { type: 'error', message: "Key \"address id\" is still referenced in the tables" };
        return { type: 'error', message: err };
    }
};

const update = async (address) => {
    const { id, street_type, street_name, house_number, apartment_number, city } = address;
    await pool.query("UPDATE address SET street_type = $1, street_name = $2, house_number = $3, apartment_number = $4 where address_id = $5 and city = $6",
        [street_type, street_name, house_number, apartment_number, id, city]);
};

const isExist = async (id) => {
    const allMeterData = await pool.query("SELECT * FROM address where address_id = $1", [id]);
    return !!allMeterData.rows.length;
};

const isValueExist = async (address) => {
    const { city, street_type, street_name, house_number, apartment_number } = address;
    const allMeterData = await pool.query("SELECT * FROM address where street_type = $1 and street_name = $2 and house_number = $3 and apartment_number = $4 and city = $5",
        [street_type, street_name, house_number, apartment_number, city]);
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