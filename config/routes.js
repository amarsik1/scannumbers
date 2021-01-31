const {meterData, consumer} = require('../app/controllers/');

module.exports = (app) => {
    // meter_data
    app.post('/meter_data', meterData.create);
    app.post('/add_test_data', meterData.addTestData);
    app.get('/meter_data', meterData.getAll);
    app.get('/meter_data/:id', meterData.getFromOnce);

    //consumer
    app.post('/consumer', consumer.create);
};