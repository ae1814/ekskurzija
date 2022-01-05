"use strict";
exports.__esModule = true;
exports.routes = exports.app = void 0;
var persons_route_1 = require("./persons.route");
var school_trip_route_1 = require("./school_trip.route");
var quiz_route_1 = require("./quiz.route");
var qa_route_1 = require("./qa.route");
var express = require('express');
//const bodyParser = require('body-parser')
exports.app = express.Router();
exports.routes = exports.app;
/*
app.use(bodyParser.urlencoded({
    extended: true
  }))
  
app.use(bodyParser.json())
*/
exports.app.use('/school_trip', school_trip_route_1.school_trips);
exports.app.use('/school_trip/quiz', quiz_route_1.quiz);
exports.app.use('/school_trip/quiz/qa', qa_route_1.qa);
exports.app.use('/users', persons_route_1.persons);
