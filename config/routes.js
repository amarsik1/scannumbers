const {meterData, consumer, meter, address, metersGroup, organization} = require('../app/controllers/');

module.exports = (app) => {

    app.post('/meter_data', meterData.create);
    app.get('/meter_data/:id', meterData.getFromOnce);

    app.post('/sing-up', consumer.create);
    app.post('/login', consumer.login);

    app.get('/address/:id', address.getOnce);
    app.post('/address', address.create);
    app.put('/address/:id', address.update);
    app.delete('/address/:id', address.deleteOnce);

    app.post('/meters_group', metersGroup.create);
    app.get('/meters_group/:id', metersGroup.getMeters);
    app.put('/meters_group/:id', metersGroup.update);

    app.post('/organization', organization.create);
    app.get('/organization/:id', organization.getOne);
    app.put('/organization/:id', organization.update);

    app.post('/meter', meter.create);
    app.put('/meter/:id', meter.update);

};