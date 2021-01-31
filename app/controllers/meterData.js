const pool = require('../../config/db'),
    {isExist} = require('./meter');

const create = async (req, res) => {
    try {
        const {value, meter_id} = req.body;
        if (!await isExist(meter_id)) res.status(400).send('Meter is not exist');
        const date = new Date();
        const newIndication = await pool.query("INSERT INTO meter_data (meter_id, value, date) values ($1,$2,$3)  RETURNING *", [meter_id, value, date]);
        res.send(newIndication.rows[0]);
    } catch (err) {
        res.status(500).json({message: err});
    }
};

const getAll = async (req, res) => {
    try {
        const allMeterData = await pool.query("SELECT * FROM meter_data");
        res.send(allMeterData.rows)
    } catch (err) {
        res.status(500).json(err)
    }
};

const getFromOnce = async (req, res) => {
    try {
        const {id} = req.params;
        if (!await isExist(id)) res.status(400).send('Meter is not exist');
        const allMeterData = await pool.query("SELECT * FROM meter_data where meter_id = $1", [id]);

        res.send(allMeterData.rows)
    } catch (err) {
        res.status(500).send(err)
    }
};

// TODO: remove this func
const addTestData = async (req, res) => {
    try {
        await pool.query("INSERT INTO address (street_type_id, street_Name, house_Number, apartment_Number) VALUES ($1,$2,$3,$4)",
            [1, "Шевчsенка", 345, "0"]);
        await pool.query("INSERT INTO organization (name, resource_type_id, address_id, edrpou) values ($1,$2,$3,$4)", ["amarsik Inc.", 1, 1, 5478569]);
        await pool.query("INSERT INTO consumer (name, surname, patronymic, email, password) values ($1,$2,$3,$4,$5)", ["Меsльник", "Артsьом", "Станіслаdвович", "asdad@gmail.com", "asdadad"]);
        await pool.query("INSERT INTO meters_group (name, consumer_id, address_id) values ($1,$2,$3)  RETURNING *", ["тест", 1, 1]);
        await pool.query("INSERT INTO meters_group (name, consumer_id, address_id) values ($1,$2,$3)  RETURNING *", ["тест", 1, 1]);
        await pool.query("INSERT INTO meter (personal_account, resource_type_id, organization_id, meters_group_id) values ($1,$2,$3,$4)", ["тест", 2, 1, 1]);
        await pool.query("INSERT INTO meter (personal_account, resource_type_id, organization_id, meters_group_id) values ($1,$2,$3,$4)", ["тест", 2, 1, 1]);
        await pool.query("INSERT INTO meter (personal_account, resource_type_id, organization_id, meters_group_id) values ($1,$2,$3,$4)", ["тест", 1, 1, 2]);
        res.send('ok');
    } catch (err) {
        res.status(500).json({message: err.detail})
    }
};

module.exports = {
    create,
    getAll,
    addTestData,
    getFromOnce
};
