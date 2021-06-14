const { validateMeter } = require('../models/meter.model');
const metersGroupService = require('../service/meterGroup.service');
const organizationService = require('../service/organization.service');
const meterService = require('../service/meter.service');

const create = async (req, res) => {
    const { error } = validateMeter(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    const { organization_id, meters_group_id } = req.body;

    if (!await metersGroupService.isExist(meters_group_id)) return res.status(400).send({ message: 'Meter group does not exists' });
    if (!await organizationService.isExist(organization_id)) return res.status(400).send({ message: 'Organization does not exists' });

    const newMeter = await meterService.create(req.body)

    res.status(201).send(newMeter);
};

const update = async (req, res) => {
    const { error } = validateMeter(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { meter_id, organization_id, meters_group_id } = req.body;

    if (!await metersGroupService.isExist(meters_group_id)) return res.status(400).send({ message: 'Meter group does not exists' });
    if (!await organizationService.isExist(organization_id)) return res.status(400).send({ message: 'Organization does not exists' });
    if (!!!await meterService.isExist(meter_id)) return res.status(400).send({ message: 'Meter does not exists' });

    await meterService.update(req.body);

    res.status(200).send({ message: 'Meters group was successfully updated' });
};

const deleteOne = async (req, res) => {
    const { id } = req.params;

    if (!!!await meterService.isExist(id)) return res.status(400).send({ message: 'Meter does not exists' });
    await meterService.deleteOne(id)
    res.status(200).send({ message: 'Successfully deleted' });

};

module.exports = {
    create,
    update,
    deleteOne
};