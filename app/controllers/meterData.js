const meterDataService = require('../service/meterData.service');
const meterService = require('../service/meter.service');

const create = async (req, res) => {
    const {value, meter_id} = req.body;
    if (!await meterService.isExist(meter_id)) return res.status(400).send('Meter is not exist');
    const date = new Date();
    const newIndication = meterDataService.create(meter_id, value, date);
    res.status(200).send(newIndication);
};

const getFromOnce = async (req, res) => {
    const {id} = req.params;
    if (!await meterService.isExist(id)) return res.status(400).send('Meter is not exist');
    const allMeterData = meterDataService.getFromOne(id);
    res.send(allMeterData)
};

module.exports = {
    create,
    getFromOnce
};
