export { app as qa };

var express = require('express');
const app = express.Router();
var mysql_connection = require("../common/mysql/mysql.config")


app.get("/get_by_quiz_id/:id", (req : any, res : any) => {
    mysql_connection.query('SELECT * FROM qa WHERE quizID = ? ORDER BY idqa', req.params.id, function (error : any, results : any) {

        if (error)
        {
            
            mysql_connection.end();
            res.sendStatus(500);
        }
        else {
            mysql_connection.query('SELECT * FROM qa_images WHERE image_quiz_id = ?', req.params.id, function (error_1 : any, results_images : any) {

                if (error_1)
                {
                    
                    mysql_connection.end();
                    res.sendStatus(error_1);
                }
                else {
                    mysql_connection.end();
                    var images : any = {}
                    for (let i = 0; i < results_images.length; i++)
                    {
                        var blobString = new String(results_images[i].url)
                        images[results_images[i].name] = blobString
                    }
                    //console.log(images)
                    res.send({"data":results, "images":images});
                }
            });
        }
    });
})




app.post("/add_new", (req : any, res : any) => {
    //console.log(req.body)
    var array = []
    for (let i = 0; i < req.body.length; i++)
    {
        array[i] = [req.body[i].question, req.body[i].answers, req.body[i].correct_answer, req.body[i].summary, req.body[i].school_tripID, req.body[i].quizID]
    }
    mysql_connection.query('INSERT INTO qa (question, answers, correct_answer, summary, school_tripID, quizID) VALUES ?', [array], function (error : any, results : any) {

        if (error)
        {
            mysql_connection.end();
            console.log(error)
            res.send(error);
        }
        else {
            //console.log(results)
            mysql_connection.end();
            res.send(results);
        }
    });
})


app.put("/update_qa", (req : any, res : any) => {
    var array = []
    var q = []
    for (let i = 0; i < req.body.length; i++)
    {
        var tmp_array = []
        tmp_array.push(req.body[i].question)
        tmp_array.push(req.body[i].answers)
        tmp_array.push(req.body[i].correct_answer)
        tmp_array.push(req.body[i].summary)
        tmp_array.push(req.body[i].idqa)
        array.push(tmp_array)
    }
    //console.log(array)
    for (let i = 0; i < req.body.length; i++)
    {
        mysql_connection.query('UPDATE qa SET question = ?, answers = ?, correct_answer = ?, summary = ?  WHERE idqa = ?', array[i],  function (error : any, results : any) {
            
            if (error)
            {
                mysql_connection.end();
                res.send(error);
            }
            else {
                if (i == req.body.length - 1)
                {
                    mysql_connection.end();
                    res.send(results);
                }
                
            }
        });
    }
    
})

app.post("/upload_image", (req : any, res : any) => {
    var images = req.body[0]
    var names = Object.keys(images)
    var quizid = req.body[1]
    var data : any[]= []
    for (let i = 0; i < names.length; i++)
    {
        data[i] = [quizid, names[i], images[names[i]]]
    }
    mysql_connection.query('DELETE FROM qa_images WHERE image_quiz_id = ?', quizid, function (error : any, results : any) {
        if (error) {
            mysql_connection.end();
            res.send(error);
        }
        else {
            mysql_connection.end();
            mysql_connection.query('INSERT INTO qa_images (image_quiz_id, name, url) VALUES ?', [data], function (error : any, results : any) {

                if (error)
                {
                    mysql_connection.end();
                    console.log(error)
                    res.send(error);
                }
                else {
                    //console.log(results)
                    mysql_connection.end();
                    res.send(results);
                }
            });
        }
    });
})