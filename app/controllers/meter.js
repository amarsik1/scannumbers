const pool = require('../../config/db');

const isExist = async (_id) => {
    const allMeterData = await pool.query("SELECT * FROM meter where meter_id = $1", [_id]);
    return !!allMeterData.rows.length
};

module.exports = {
    isExist
};