const pool = require('../../db');

const getAll = async (req, res) => {
    try {
        const allAddress = await pool.query("SELECT * FROM address");
        await res.json(allAddress.rows)
    } catch (err) {
        res.status(500).json(err)
    }
};

const getOnce = async (req, res) => {
    try {
        const {id} = req.params;
        const address = await pool.query("SELECT * FROM address where address_id = $1", [id]);
        await res.json(address.rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

const create = async (req, res) => {
    try {
        const {street_type_id, street_Name, house_Number, apartment_Number} = req.body;
        const newAddress = await pool.query("INSERT INTO address (street_type_id, street_Name, house_Number, apartment_Number) VALUES ($1,$2,$3,$4) RETURNING *",
            [street_type_id, street_Name, house_Number, apartment_Number]);

        res.json(newAddress.rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteOnce = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedTodo = await pool.query("DELETE FROM address WHERE address_id = $1", [id]);
        console.log(deletedTodo);
        res.json("Was success deleted");
    } catch (err) {
        res.status(500).json(err)
    }
};

const update = async (req, res) => {
    try {
        const {id} = req.params;
        const {street_type_id, street_Name, house_Number, apartment_Number} = req.body;

        const updatedAddress = await pool.query("UPDATE address SET street_type_id = $1, street_Name = $2, house_Number = $3, apartment_Number = $4 where address_id = $5",
            [street_type_id, street_Name, house_Number, apartment_Number, id]);
        res.json("Address was updated successfully")
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    getAll,
    getOnce,
    create,
    update,
    deleteOnce,
};