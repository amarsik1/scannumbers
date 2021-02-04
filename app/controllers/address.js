const pool = require('../../config/db'),
    {validateAddress} = require('../models/address.model');

const getOnce = async (req, res) => {
    const {id} = req.params;
    const address = await pool.query("SELECT * FROM address where address_id = $1", [id]);
    if (!address.rows[0]) return res.status(400).send('Address does not exists');

    await res.send(address.rows[0]);
};

const isExist = async (id) => {
    const allMeterData = await pool.query("SELECT * FROM address where address_id = $1", [id]);
    return !!allMeterData.rows.length
};

const isValueExist = async (address) => {
    const {street_type_id, street_name, house_number, apartment_number} = address;
    const allMeterData = await pool.query("SELECT * FROM address where street_type_id = $1 and street_name = $2 and house_number = $3 and apartment_number = $4",
        [street_type_id, street_name, house_number, apartment_number]);
    return !!allMeterData.rows.length
};

const create = async (req, res) => {
    const {error} = validateAddress(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (await isValueExist(req.body)) return res.status(400).send('Address with this value already exists');

    const {street_type_id, street_name, house_number, apartment_number} = req.body;
    const newAddress = await pool.query("INSERT INTO address (street_type_id, street_name, house_number, apartment_number) VALUES ($1,$2,$3,$4) RETURNING *",
        [street_type_id, street_name, house_number, apartment_number]);

    res.send(newAddress.rows[0]);
};

const deleteOnce = async (req, res) => {
    try {
        const {id} = req.params;
        if (!await isExist(id)) return res.status(400).send('Address does not exists');

        await pool.query("DELETE FROM address WHERE address_id = $1", [id]);
        res.status(200).send("Was success deleted");
    } catch (err) {
        if (err.code === "23503") res.status(500).send("Key \"address id\" is still referenced in the tables");
        res.status(500).json(err)
    }
};

const update = async (req, res) => {
    const {error} = validateAddress(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {id} = req.params;
    if (!await isExist(id)) return res.status(400).send('Address does not exists');

    if (await isValueExist(req.body)) return res.status(400).send('Address with this value already exists');

    const {street_type_id, street_name, house_number, apartment_number} = req.body;

    await pool.query("UPDATE address SET street_type_id = $1, street_name = $2, house_number = $3, apartment_number = $4 where address_id = $5",
        [street_type_id, street_name, house_number, apartment_number, id]);
    res.send("Address was updated successfully");
};

module.exports = {
    getOnce,
    create,
    update,
    deleteOnce,
    isExist,
};