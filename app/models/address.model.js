const Joi = require('joi');

function validateAddress(address) {
    const schema = Joi.object({
        address_id: Joi.number().min(0).required(),
        street_type: Joi.string().required(),
        street_name: Joi.string().required(),
        city: Joi.string().required(),
        house_number: Joi.string().required(),
        apartment_number: Joi.string(),
    });
    return schema.validate(address);
}
function validateAddressCreate(address) {
    const schema = Joi.object({
        street_type: Joi.string().required(),
        street_name: Joi.string().required(),
        city: Joi.string().required(),
        house_number: Joi.string().required(),
        apartment_number: Joi.string(),
    });
    return schema.validate(address);
}

module.exports = {
    validateAddress,
    validateAddressCreate
};