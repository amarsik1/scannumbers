const Joi = require('joi');

function validateOrganization(organization) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(255).required(),
        resource_type_id: Joi.number().min(1).max(4).required(),
        address_id: Joi.number().min(1).required(),
        edrpou: Joi.number().min(1000000).max(9999999).required()
    });
    return schema.validate(organization);
}

module.exports = {
    validateOrganization
};