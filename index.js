const express = require("express");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3012;

require('./middleware/cors')(app);
require('./config/routes')(app);

app.get('/', function (req, res) {
    res.send("created by amarsik1");
});

app.listen(PORT, () => {
    console.log("app is started in " + PORT + " port");
});