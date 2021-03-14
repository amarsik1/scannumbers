const pool = require('../../config/db');

const create = async (consumer) => {
    const newConsumer = await pool.query("INSERT INTO consumer (name, surname, patronymic, email, password) values ($1,$2,$3,$4,$5)  RETURNING *", Object.values(consumer));
    return newConsumer.rows[0];
};

const isExist = async (id) => {
    const consumer = await pool.query("SELECT * FROM consumer where consumer_id = $1", [id]);
    return !!consumer.rows.length;
};

const findById = async (id) => {
    const user = await pool.query('select * from consumer where consumer_id = $1', [id]);
    return user.rows[0];
};

const findByEmail = async (email) => {
    const user = await pool.query('SELECT * FROM consumer where email=$1', [email]);
    return user.rows[0];
};

const deleteOne = async (id) => {
    await pool.query('delete from consumer where consumer_id = $1', [id]);
};

const update = async (consumer) => {
    const {consumer_id, name, surname, patronymic} = consumer;
    await pool.query("UPDATE consumer SET name = $1, surname = $2, patronymic = $3 where consumer_id = $4",
        [name, surname, patronymic, consumer_id]);
};

module.exports = consumerService = {
    create,
    isExist,
    findById,
    findByEmail,
    deleteOne,
    update
}