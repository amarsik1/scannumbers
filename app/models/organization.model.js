const Joi = require('joi');

function validateOrganization(organization) {
    const schema = Joi.object({
        organization_id: Joi.number().required(),
        name: Joi.string().min(1).max(255).required(),
        resource_type: Joi.string().required(),
        address_id: Joi.number().min(1).required(),
        edrpou: Joi.string().required()
    });
    return schema.validate(organization);
}

module.exports = {
    validateOrganization
};