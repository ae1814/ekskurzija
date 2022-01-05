import {persons} from "./persons.route"
import {school_trips} from "./school_trip.route"
import {quiz} from "./quiz.route"
import {qa} from "./qa.route"
const express = require('express');
//const bodyParser = require('body-parser')



export const app = express.Router();
export { app as routes };
/*
app.use(bodyParser.urlencoded({
    extended: true
  }))  
  
app.use(bodyParser.json())
*/
app.use('/school_trip', school_trips);
app.use('/school_trip/quiz', quiz);
app.use('/school_trip/quiz/qa', qa);
app.use('/users', persons);
