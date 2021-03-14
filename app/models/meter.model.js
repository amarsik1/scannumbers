const Joi = require('joi');

function validateMeter(meter) {
    const schema = Joi.object({
        meter_id: Joi.number().min(0),
        personal_account: Joi.string().min(1).max(255).required(),
        resource_type_id: Joi.number().min(1).max(4).required(),
        organization_id: Joi.number().min(1).required(),
        meters_group_id: Joi.number().min(1).required(),
        name: Joi.string().required(),
    });
    return schema.validate(meter);
}

module.exports = {
    validateMeter
};