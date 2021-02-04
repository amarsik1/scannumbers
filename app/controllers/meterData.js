const pool = require('../../config/db'),
    {isExist} = require('./meter');

const create = async (req, res) => {
    const {value, meter_id} = req.body;
    if (!await isExist(meter_id)) return res.status(400).send('Meter is not exist');
    const date = new Date();
    const newIndication = await pool.query("INSERT INTO meter_data (meter_id, value, date) values ($1,$2,$3)  RETURNING *", [meter_id, value, date]);
    res.send(newIndication.rows[0]);
};


const getFromOnce = async (req, res) => {
    const {id} = req.params;
    if (!await isExist(id)) return res.status(400).send('Meter is not exist');
    const allMeterData = await pool.query("SELECT * FROM meter_data where meter_id = $1", [id]);

    res.send(allMeterData.rows)
};

module.exports = {
    create,
    getFromOnce
};
