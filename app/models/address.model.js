const Joi = require('joi');

function validateAddress(address) {
    const schema = Joi.object({
        street_type_id: Joi.number().min(1).max(3).required(),
        street_name: Joi.string().required(),
        house_number: Joi.string().required(),
        apartment_number: Joi.string(),
    });
    return schema.validate(address);
}

module.exports = {
    validateAddress
};