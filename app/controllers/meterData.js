const pool = require('../../config/db');

const add = async (req, res) => {
    try {
        const {value, meter_id} = req.body;
        const date = new Date();
        const newIndication = await pool.query("INSERT INTO meter_data (meter_id, value, date) values ($1,$2,$3)  RETURNING *", [meter_id, value, date]);
        res.send(newIndication.rows[0]);
    } catch (err) {
        switch (err.code) {
            case "42P01": res.status(500).json({message: "Invalid name table"}); break;
            case "23503": {
                const field = err.detail.slice(6,err.detail.indexOf(')'));
                res.status(500).json({message: "Invalid value in field "+field});
                break;
            }
            default: res.status(500).json({message: err});
        }
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

const addTestData = async (req, res) => {
    try {
        await pool.query("INSERT INTO address (street_type_id, street_Name, house_Number, apartment_Number) VALUES ($1,$2,$3,$4)",
            [1, "Шевченка", 345, "0"]);
        await pool.query("INSERT INTO organization (name, resource_type_id, address_id, edrpou) values ($1,$2,$3,$4)", ["amarsik Inc.", 1, 1, 5478569]);
        await pool.query("INSERT INTO consumer (name, surname, patronymic) values ($1,$2,$3)", ["Мельник", "Артьом", "Станіславович"]);
        await pool.query("INSERT INTO meters_group (name, consumer_id, address_id) values ($1,$2,$3)  RETURNING *", ["тест", 1, 1]);
        await pool.query("INSERT INTO meter (personal_account, resource_type_id, organization_id, meters_group_id) values ($1,$2,$3,$4)", ["тест", 1, 1, 1]);
        res.send('ok');
    } catch (err) {
        res.status(500).json({message: err.detail})
    }
};

module.exports = {
    add,
    getAll,
    addTestData
};
