const {validateOrganization} = require('../models/organization.model');
const addressService = require('../service/address.service');
const organizationService = require('../service/organization.service');

const create = async (req, res) => {
    const {error} = validateOrganization(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {address_id, edrpou} = req.body;

    const organizationInDb = organizationService.getOneByEDRPOU(edrpou);
    if (!!organizationInDb) return res.status(400).send('Organization with this edrpou already exists');

    if (await organizationService.isValueExist(req.body)) return res.status(400).send('Organization with this value already exists');
    if (!await addressService.isExist(address_id)) return res.status(400).send('Address does not exists');

    const newOrganization = organizationService.create(req.body);

    res.status(200).send(newOrganization);
};

const getOne = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) return res.status(400).send('Invalid value organization_id');

    if (!await organizationService.isExist(id)) return res.status(400).send('Organization does not exists');
    const organization = organizationService.getOne(id);

    res.status(200).send(organization);
};

const getOrganizationByResourceId = async (req, res) => {
    const id = parseInt(req.query.resourceType);

    if (id > 5 || id < 1) return res.status(400).send('Invalid value');
    const organizations = organizationService.getOrganizationByResourceId(id);

    res.status(200).send(organizations);
};

const update = async (req, res) => {
    const {error} = validateOrganization(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {organization_id, address_id} = req.body;

    if (await organizationService.isValueExist(req.body)) return res.status(400).send('Organization with this value already exists');
    if (!await organizationService.isExist(organization_id)) return res.status(400).send('Organization does not exists');
    if (!await addressService.isExist(address_id)) return res.status(400).send('Address does not exists');

    await organizationService.update(req.body);

    res.status(200).send("Organization info was successfully updated");
};

module.exports = {
    create,
    update,
    getOne,
    getOrganizationByResourceId
};