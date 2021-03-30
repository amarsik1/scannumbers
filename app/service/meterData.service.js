const pool = require('../../config/db');

const create = async (meter_id, value, date) => {
    const newData = await pool.query("INSERT INTO meter_data (meter_id, value, date) values ($1,$2,$3)  RETURNING *", [meter_id, value, date]);
    return newData.rows[0];
};

const getFromOne = async (id) => {
    const data = await pool.query("SELECT * FROM meter_data where meter_id = $1", [id]);
    return data.rows;
};

const getLastRowFromMeter = async (id) => {
    const data = await pool.query("SELECT * FROM meter_data where meter_id = $1 ORDER BY date DESC LIMIT 1", [id]);
    return data.rows[0];
};

module.exports = meterDataService = {
    create,
    getFromOne,
    getLastRowFromMeter
};