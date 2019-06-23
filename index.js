const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const path = require('path');

app.get('/', function(req, res) {
  res.json()
})
