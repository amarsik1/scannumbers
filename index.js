const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3012;
app.use(bodyParser.json());
app.use(cors());

require('./config/routes')(app);

app.get('/', (_, res) => {
    res.send("express application by Melnyk Artem");
});

app.listen(PORT, () => {
    console.log(`app is started in ${PORT} port`);
});
