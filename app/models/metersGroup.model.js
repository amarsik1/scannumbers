const Joi = require('joi');

function validateMetersGroup(meterGroup) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(255).required(),
        consumer_id: Joi.number().min(1).max(32767).required(),
        address_id: Joi.number().min(1).required()
    });
    return schema.validate(meterGroup);
}

module.exports = {
    validateMetersGroup
};