const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const apiRoutes = require('./routes.js');
const db = require('./db/db-connection')
db.connect()

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

apiRoutes(app);

const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log(`http://localhost:${PORT}/`);
})
