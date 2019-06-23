const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path')

const hpdController = require('./routes/api/hpd');
const testController = require('./routes/api/test');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


app.use('/api/hpd', hpdController);
app.use('/api/test', testController);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server up and runing on the port ${port} !`));
