const { validateMetersGroup } = require('../models/metersGroup.model');
const consumerService = require('../service/consumer.service');
const addressService = require('../service/address.service');
const meterService = require('../service/meter.service');
const meterGroupService = require('../service/meterGroup.service');

const getMeters = async (req, res) => {
    const { id } = req.params;
    if (!await meterGroupService.isExist(id)) return res.status(400).send('Meters group does not exists');

    const meters = await meterService.getMetersByGroupId(id);
    res.status(200).send(meters)
};

const create = async (req, res) => {
    const { error } = validateMetersGroup(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (await meterGroupService.isValueExist(req.body)) return res.status(400).send('Meters group with this value already exists');
    const { consumer_id, address_id } = req.body;

    if (!await consumerService.isExist(consumer_id)) return res.status(400).send('Consumer does not exists');
    if (!await addressService.isExist(address_id)) return res.status(400).send('Address does not exists');
    const newMetersGroup = await meterGroupService.create(req.body);

    res.status(200).send(newMetersGroup);
};

const update = async (req, res) => {
    const { error } = validateMetersGroup(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { meters_group_id, consumer_id, address_id } = req.body;

    if (!await meterGroupService.isExist(meters_group_id)) return res.status(400).send('Meters group does not exists');

    if (!await consumerService.isExist(consumer_id)) return res.status(400).send('Consumer does not exists');
    if (!await addressService.isExist(address_id)) return res.status(400).send('Address does not exists');

    if (await meterGroupService.isValueExist(req.body).length)
        if (await meterGroupService.isValueExist(req.body).meters_group_id !== meters_group_id) return res.status(400).send('Meters group with this value already exists');

    await meterGroupService.update(req.body);

    res.status(200).send("Meters group was successfully updated");
};

const deleteOne = async (req, res) => {
    const { id } = req.params;

    if (!await meterGroupService.isExist(id)) return res.status(400).send('Meters group does not exists');
    await meterGroupService.deleteOne(id)
    res.status(200).send('Successfully deleted');
};


module.exports = {
    getMeters,
    create,
    update,
    deleteOne
};