"use strict";
exports.__esModule = true;
var routes_1 = require("./routes/routes");
require('dotenv').config({ path: './.env' });
var express = require('express');
var app = express();
app.use('/', function (req, res, next) {
    var allowedOrigins = [process.env.ALLOWED_ORIGIN];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1)
        res.header('Access-Control-Allow-Origin', '*');
    /* console.log("ovde " + req.headers.password)
     if (req.headers.password != process.env.NODE_PASSWD)
     {
         res.sendStatus(401);
         return;
     }*/
    res.header('Access-Control-Allow-Headers', ' Origin, X-Requested-With, Content-Type, Accept, password, username, gn');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.json());
app.use('/', routes_1.routes);
app.listen(5201, function () {
    console.log('Server listening on port 5201!');
});
