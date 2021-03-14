const Joi = require('joi'),
    {jwtSecret} = require('../../config/app'),
    jwt = require('jsonwebtoken');

const validateUser = user => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        surname: Joi.string().min(2).max(50).required(),
        patronymic: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(55).required().email(),
        password: Joi.string().min(8).max(55).required(),
    });
    return schema.validate(user);
}

const validateUpdateUser = user => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        surname: Joi.string().min(2).max(50).required(),
        patronymic: Joi.string().min(2).max(50).required(),
        id: Joi.number().required(),
    });
    return schema.validate(user);
}

const generateAuthToken = id => {
    return jwt.sign(
        {
            _id: id,
        }, jwtSecret
    );
};

const getIdFromToken = token => {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded._id
};

module.exports = {
    validateUser,
    validateUpdateUser,
    generateAuthToken,
    getIdFromToken
};