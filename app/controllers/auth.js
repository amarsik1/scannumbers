const pool = require('../../db');
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../../config/app');
const saltRounds = 10;

const singIn = async (req, res) => {
    try {
        const {email, password} = req.body;
        const response = await pool.query("SELECT * FROM consumer where email = $1", [email]);
        const user = response.rows[0];
        if (!user) {
            res.status(401).json({message: "User does not exist"})
        }
        const isValid = bCrypt.compareSync(password, user.password);
        if (isValid) {
            const token = jwt.sign(user.consumer_id.toString(), jwtSecret);
            res.json({token});
        } else {
            res.status(401).json({message: "Invalid password"});
        }
    } catch (err) {
        res.status(500).json({message: err})
    }
};

const test = async (req, res) => {
    try {
        const {name, surname, patronymic, email} = req.body;
        const hash = bCrypt.hashSync(req.body.password, saltRounds);
        const allAddress = await pool.query("INSERT INTO consumer (name, surname, patronymic, email, password) values ($1,$2,$3,$4,$5)", [name, surname, patronymic, email, hash]);
        await res.json(allAddress.rows)
    } catch (err) {
        res.status(500).json(err)
    }
};
const getAll = async (req, res) => {
    try {
        const allAddress = await pool.query("select * from consumer");
        await res.json(allAddress.rows)
    } catch (err) {
        res.status(500).json(err)
    }
};

module.exports = {
    singIn,
    test,
    getAll
};