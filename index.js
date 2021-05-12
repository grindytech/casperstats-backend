const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

var corsOptions = {
    origin: 'http://casperstats.io',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

/* Nhiều domain */
var whitelist = ['http://casperstats.com']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.get('/products/:id', cors(corsOptions), function (req, res, next) {
    res.json({ msg: 'This is CORS-enabled ' })
})

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})
