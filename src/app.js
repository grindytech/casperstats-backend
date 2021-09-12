const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

require('./models');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/* CROS middleware */
app.use(function (req, res, next) {

  // All domain
  // res.header("Access-Control-Allow-Origin", "*");

  // Specific domain
  const allowedOrigins = ['https://casperstats.io', 'http://localhost'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// icon for bookmarks
app.get('/favicon.ico', (req, res) => {
  res.sendStatus(200);
});

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
})
