const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

/* CROS middleware */
app.use(function(req, res, next) {
    // Mọi domain
    // res.header("Access-Control-Allow-Origin", "*");
   
    // Domain nhất định
    res.header("Access-Control-Allow-Origin", process.env.DOMAIN_URL || "*");
   
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})
