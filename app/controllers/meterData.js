const meterDataService = require('../service/meterData.service');
const meterService = require('../service/meter.service');
const { difference } = require('../../config/constants');

const create = async (req, res) => {
    const { value, meter_id } = req.body;
    const innerMeter = await meterService.isExist(meter_id);
    if (!innerMeter) return res.status(400).send({ message: 'Meter is not exist' });
    const { value: prevValue } = await meterDataService.getLastRowFromMeter(meter_id);
    const date = new Date();
    if (prevValue) {
        if (prevValue > value) return res.status(400).send({ message: 'The value cannot be less than the previous' });
        if ((value - prevValue) > difference[innerMeter.resource_type]) return res.status(400).send({ message: 'Value is much higher than the previous' });
    }
    const newIndication = await meterDataService.create(meter_id, value, date);
    res.status(201).send(newIndication);
};

const getFromOnce = async (req, res) => {
    const { id } = req.params;
    if (!await meterService.isExist(id)) return res.status(400).send({ message: 'Meter is not exist' });
    const allMeterData = await meterDataService.getFromOne(id);
    res.send(allMeterData);
};

module.exports = {
    create,
    getFromOnce
};
