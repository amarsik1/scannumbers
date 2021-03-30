const { meterData, consumer, meter, address, metersGroup, organization } = require('../app/controllers/');
const authMiddleware = require('../middleware/auth');

module.exports = (app) => {

    app.post('/meter_data', meterData.create);
    app.get('/meter_data/:id', meterData.getFromOnce);

    app.post('/sing-up', consumer.create);
    app.post('/login', consumer.login);
    app.get('/consumer/all', authMiddleware, consumer.getAllInfoFromMeters);
    app.get('/consumer/:id', consumer.findOne);
    app.delete('/consumer/:id', consumer.deleteOne);
    app.put('/consumer', consumer.update);

    app.get('/address/:id', address.getOnce);
    app.post('/address', address.create);
    app.put('/address', address.update);
    app.delete('/address/:id', address.deleteOnce);

    app.post('/meters_group', metersGroup.create);
    app.put('/meters_group', metersGroup.update);
    app.get('/meters_group/:id', metersGroup.getMeters);
    app.delete('/meters_group/:id', metersGroup.deleteOne);

    app.get('/organization', organization.getOrganizationByResource);
    app.post('/organization', organization.create);
    app.put('/organization', organization.update);
    app.get('/organization/:id', organization.getOne);

    app.post('/meter', meter.create);
    app.put('/meter', meter.update);
    app.delete('/meter/:id', meter.deleteOne);

};