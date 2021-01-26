const meterData = require('../app/controllers/meterData');

module.exports = (app) => {
  app.post('/meter_data', meterData.add);
  app.post('/add_test_data', meterData.addTestData);
  app.get('/meter_data', meterData.getAll);
};