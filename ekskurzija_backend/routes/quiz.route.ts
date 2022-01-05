export { app as quiz };

var express = require('express');
const app = express.Router();
var mysql_connection = require("../common/mysql/mysql.config")


app.get("/:id", (req : any, res : any) => {
    mysql_connection.query('SELECT * FROM quiz WHERE idquiz = ?', req.params.id, function (error : any, results : any) {

        if (error)
        {
            
            mysql_connection.end();
            res.send(500);
        }
        else {
            mysql_connection.end();
            //console.log(results)
            res.send(results);
        }
    });
})




app.get("/by_school_trip/:id", (req : any, res : any) => {
    mysql_connection.query('SELECT * FROM quiz WHERE school_tripID = ?', req.params.id, function (error : any, results : any) {

        if (error)
        {
            mysql_connection.end();
            res.send(500);
        }
        else {
            mysql_connection.end();
            //console.log(results)
            res.send(results);
        }
    });
})
app.get("/by_student/:id", (req : any, res : any) => {
    mysql_connection.query('SELECT * FROM quiz WHERE studentID = ?', req.params.id, function (error : any, results : any) {

        if (error)
        {
            mysql_connection.end();
            res.send(500);
        }
        else {
            mysql_connection.end();
            //console.log(results)
            res.send(results);
        }
    });
})

app.get("/by_school_trip/:id_trip/by_student/:id_student", (req : any, res : any) => {
    //console.log(req.params.id_trip, req.params.id_student)
    mysql_connection.query('SELECT * FROM quiz WHERE school_tripID = ? AND studentID = ?', [req.params.id_trip, req.params.id_student], function (error : any, results : any) {

        if (error)
        {
            mysql_connection.end();
            res.send(500);
        }
        else {
            mysql_connection.end();
            //console.log(results)
            res.send(results);
        }
    });
})

app.delete("/:id", (req : any, res : any) => {
    
    mysql_connection.query('DELETE FROM quiz where idquiz = ?', req.params.id, function (error : any, results : any) {

        if (error)
        {
            mysql_connection.end();
            res.send(error);
        }
        else {
            mysql_connection.end();
            res.send(results);
        }
    });
})

app.put("/:id", (req : any,res : any) => {
    //console.log(req.params.id)
    var data_json = req.body;
    var selected_inputs = [];
    var selected_columns = "";
    if (data_json.submited != undefined && data_json.submited != null)
    {
        selected_columns += ",submited = ?"
        selected_inputs.push(data_json.submited);
    }
    if (selected_inputs.length == 0)
    {
        res.send(400);
        return;
    }
    selected_inputs.push(req.params.id)
    if (selected_columns.charAt(0) == ",")
        selected_columns = selected_columns.substring(1, selected_columns.length)
    mysql_connection.query('UPDATE quiz SET '+selected_columns+' WHERE idquiz=?', selected_inputs,  function (error : any, results : any) {
        if (error)
        {
            mysql_connection.end();
            res.send(error);
        }
        else {
            mysql_connection.end();
            res.send(results);
        }
    });
})

app.post("/add_new", (req : any, res : any) => {
    mysql_connection.query('INSERT INTO quiz (school_tripID, studentID, submited) VALUES (?, ?, ?)', [req.body.school_tripID, req.body.studentID, req.body.submited], function (error : any, results : any) {

        if (error)
        {
            mysql_connection.end();
            res.send(error);
        }
        else {
            mysql_connection.end();
            res.send(results);
        }
    });
})
app.post("/solving_quizes/add_new", (req : any, res : any) => {
    mysql_connection.query('INSERT INTO quiz_solutions (qs_idquiz, qs_iduser, answers, qs_idschool_trip) VALUES ?', [req.body], function (error : any, results : any) {

        if (error)
        {
            mysql_connection.end();
            res.send(error);
        }
        else {
            mysql_connection.end();
            res.send(results);
        }
    });
})

app.put("/quiz_solving/update", (req : any, res : any) => {
    if (req.body == [])
    {
        mysql_connection.end();
        res.send(200)
        return
    }
        mysql_connection.query('UPDATE quiz_solutions SET answers = ? WHERE idquiz_solutions = ?', [req.body.answers, req.body.idquiz_solutions],  function (error : any, results : any) {
            
            if (error)
            {
                mysql_connection.end();
                res.send(error);
            }
            else {
                    mysql_connection.end();
                    res.send(results);
                
            }
        });
})


app.put("/quiz_solving/submit", (req : any, res : any) => {
    mysql_connection.query('UPDATE quiz_solutions SET answers = ?, score = ? WHERE idquiz_solutions = ?', [req.body.answers, req.body.score, req.body.idquiz_solutions],  function (error : any, results : any) {
        
        if (error)
        {
            mysql_connection.end();
            res.send(error);
        }
        else {
                mysql_connection.end();
                res.send(results);
            
        }
    });
})
app.get("/quiz_solving/by_trip_user/:id_school_trip/:id_user", (req : any, res : any) => {
    mysql_connection.query('SELECT * FROM quiz_solutions WHERE qs_iduser = ? AND qs_idschool_trip = ?', [req.params.id_user, req.params.id_school_trip], function (error : any, results : any) {

        if (error)
        {
            mysql_connection.end();
            res.send(500);
        }
        else {
            mysql_connection.end();
            //console.log(results)
            res.send(results);
        }
    });
})

app.get("/quiz_solving/by_quiz_user/:id_quiz/:id_user", (req : any, res : any) => {
    mysql_connection.query('SELECT * FROM quiz_solutions WHERE qs_iduser = ? AND qs_idquiz = ?', [req.params.id_user, req.params.id_quiz], function (error : any, results : any) {

        if (error)
        {
            mysql_connection.end();
            res.send(500);
        }
        else {
            console.log("ja", results)
            mysql_connection.end();
            //console.log(results)
            res.send(results);
        }
    });
})

app.get("/by_trip_and_class/:id_trip/:razred", (req : any, res : any) => {
    mysql_connection.query("SELECT quiz.idquiz, quiz.studentID, quiz.submited, quiz.grade, person.name, person.email FROM person INNER JOIN quiz ON person.idperson=quiz.studentID WHERE quiz.school_tripID = ? AND person.class  LIKE '%"+req.params.razred+"%' ORDER BY person.name", [req.params.id_trip], function (error : any, results : any) {

        if (error)
        {
            mysql_connection.end();
            res.send(500);
        }
        else {
            console.log("ja", results)
            mysql_connection.end();
            //console.log(results)
            res.send(results);
        }
    });
})

app.get("/solving_quizes/by_trip_and_class/:id_trip/:razred", (req : any, res : any) => {
    mysql_connection.query("SELECT quiz_solutions.idquiz_solutions, quiz_solutions.qs_idquiz, quiz_solutions.qs_iduser, quiz_solutions.score, quiz_solutions.grade, person.name, person.email FROM person INNER JOIN quiz_solutions ON person.idperson=quiz_solutions.qs_iduser WHERE  quiz_solutions.qs_idschool_trip = ? AND person.class  LIKE '%"+req.params.razred+"%' ORDER BY person.name", [req.params.id_trip], function (error : any, results : any) {

        if (error)
        {
            mysql_connection.end();
            res.send(error);
        }
        else {
            console.log("ja", results)
            mysql_connection.end();
            //console.log(results)
            res.send(results);
        }
    });
})

app.put("/update_grade/:quiz_id", (req : any, res : any) => {
    console.log("Jljklj")
        mysql_connection.query('UPDATE quiz SET grade = ? WHERE idquiz = ?', [req.body.grade, req.params.quiz_id],  function (error : any, results : any) {
            
            if (error)
            {
                mysql_connection.end();
                res.send(error);
            }
            else {
                    mysql_connection.end();
                    res.send(results);
                
            }
        });
})

app.put("/update_submission/:quiz_id", (req : any, res : any) => {
    console.log("how", req.body)
        mysql_connection.query('UPDATE quiz SET teacher_comment = ?, submited = FALSE WHERE idquiz = ?', [req.body.komentar, req.params.quiz_id],  function (error : any, results : any) {
            
            if (error)
            {
                mysql_connection.end();
                res.send(error);
            }
            else {
                    mysql_connection.end();
                    res.send(results);
                
            }
        });
})

app.put("/quiz_solving/update_grade/:quiz_id", (req : any, res : any) => {
        mysql_connection.query('UPDATE quiz_solutions SET grade = ? WHERE idquiz_solutions = ?', [req.body.grade, req.params.quiz_id],  function (error : any, results : any) {
            
            if (error)
            {
                    console.log("erzin", error)
                mysql_connection.end();
                res.send(error);
            }
            else {
                console.log("aljaz", results)
                    mysql_connection.end();
                    res.send(results);
                
            }
        });
})