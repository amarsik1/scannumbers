const {validateAddress, validateAddressCreate} = require('../models/address.model');
const addressService = require('../service/address.service');

const getOnce = async (req, res) => {
    const {id} = req.params;
    const address = await addressService.getOne(id);

    if (!address) return res.status(400).send('Address does not exists');
    else res.send(address);
};

const create = async (req, res) => {
    const {error} = validateAddressCreate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (await addressService.isValueExist(req.body)) return res.status(400).send('Address with this value already exists');
    const newAddress = await addressService.create(req.body)
    res.send(newAddress);
};

const deleteOnce = async (req, res) => {
    const {id} = req.params;
    if (!await addressService.isExist(id)) return res.status(400).send('Address does not exists');
    const responce = await addressService.deleteOne(id);

    if (responce.type === 'ok')
        res.status(200).send("Was success deleted");
    res.status(500).send(responce.message);
};

const update = async (req, res) => {
    const {error} = validateAddress(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {address_id} = req.body;
    if (!await addressService.isExist(address_id)) return res.status(400).send('Address does not exists');
    if (await addressService.isValueExist(req.body)) return res.status(400).send('Address with this value already exists');

    await addressService.update(req.body);
    res.send("Address was updated successfully");
};

module.exports = {
    getOnce,
    create,
    update,
    deleteOnce
};