export { app as school_trips };

var express = require('express');
const app = express.Router();
var mysql_connection = require("../common/mysql/mysql.config")


app.get("/:id", (req : any, res : any) => {
    mysql_connection.query('SELECT * FROM school_trip WHERE idschool_trip = ?', req.params.id, function (error : any, results : any) {

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

app.get("/get_by_teacher_id/:id", (req : any, res : any) => {
    mysql_connection.query('SELECT * FROM school_trip WHERE teacherID = ?  ORDER BY name', req.params.id, function (error : any, results : any) {

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
app.get("/get_by_class/:class", (req : any, res : any) => {
    mysql_connection.query("SELECT * FROM school_trip WHERE class  LIKE '%"+req.params.class+"%'", function (error : any, results : any) {

        if (error)
        {
            //console.log(error)
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
    
    mysql_connection.query('DELETE FROM school_trip where idschool_trip = ?', req.params.id, function (error : any, results : any) {

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
    var data_json = req.body;
    var selected_inputs = [];
    var selected_columns = "";
    if (data_json.name != undefined && data_json.name != null)
    {
        selected_columns += ",name = ?"
        selected_inputs.push(data_json.name);
    }
    if (data_json.n_questions != undefined && data_json.n_questions != null)
    {
        selected_columns += ",n_questions = ?"
        selected_inputs.push(data_json.n_questions);
    }
    if (data_json.summary != undefined && data_json.summary != null)
    {
        selected_columns += ",summary = ?"
        selected_inputs.push(data_json.summary);
    }
    if (data_json.class != undefined && data_json.class != null)
    {
        selected_columns += ",class = ?"
        selected_inputs.push(data_json.class);
    }
    if (data_json.quizes_to_solve != undefined && data_json.quizes_to_solve != null)
    {
        selected_columns += ",quizes_to_solve = ?"
        selected_inputs.push(data_json.quizes_to_solve);
    }
    if (selected_inputs.length == 0)
    {
        res.send(400);
        return;
    }
    selected_inputs.push(req.params.id)
    if (selected_columns.charAt(0) == ",")
        selected_columns = selected_columns.substring(1, selected_columns.length)
    //console.log(selected_columns)
    mysql_connection.query('UPDATE school_trip SET '+selected_columns+' WHERE idschool_trip=?', selected_inputs,  function (error : any, results : any) {
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
    mysql_connection.query('INSERT INTO school_trip (name, class, n_questions, quizes_to_solve, summary, teacherID) VALUES (?, ?, ?, ?, ?, ?)', [req.body.name, req.body.class, req.body.n_questions, req.body.quizes_to_solve, req.body.summary, req.body.teacherID], function (error : any, results : any) {

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

app.get("/grades/all/:id/:class", (req : any, res : any) => {
    mysql_connection.query('SELECT grades.idgrades, grades.grade, grades.studentID, grades.school_tripID, grades.class, person.name, person.email FROM grades INNER JOIN person ON grades.studentID = person.idperson WHERE grades.school_tripID = ? AND grades.class = ? ORDER BY person.name', [req.params.id, req.params.class], function (error : any, results : any) {

        if (error)
        {
            console.log(error)
            mysql_connection.end();
            res.send(500);
        }
        else {
            mysql_connection.end();
            console.log(results)
            res.send(results);

        }
    });
})

app.get("/grades/:school_trip_id/:user_id", (req : any, res : any) => {
    mysql_connection.query('SELECT * FROM grades WHERE school_tripID = ? AND studentID = ?', [req.params.school_trip_id, req.params.user_id], function (error : any, results : any) {

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

app.post("/grades/auto_complete", (req : any, res : any) => {
    let razred  = req.body.class
    let school_tripID  = req. body.school_tripID
        mysql_connection.query('SELECT grades.idgrades, grades.grade, grades.studentID, grades.school_tripID, grades.class, person.name, person.email FROM grades INNER JOIN person ON grades.studentID = person.idperson WHERE grades.school_tripID = ? AND grades.class = ? ORDER BY person.name', [school_tripID, razred], function (error : any, results : any) {
    
            if (error)
            {
                console.log(error)
                mysql_connection.end();
                res.send(500);
            }
            else {
                mysql_connection.end();
                console.log("lll", results)
                if (results.length == 0)
                {
                    mysql_connection.query('SELECT * FROM person WHERE type = 1 AND class= ?', [razred], function (error : any, results : any) {

                        if (error)
                        {
                            
                            mysql_connection.end();
                            res.send(500);
                        }
                        else {
                            mysql_connection.end();
                            for (let i = 0; i < results.length; i++)
                            {
                                get_grades_for_student(results[i].idperson, school_tripID, razred, res)
                            }
                            res.send(200)
                        }
                    });
                }
                else
                {
                    res.send("Ocene so ??e dodanje!")
                }
            }
        });
    
})

function get_grades_for_student(idperson : any, school_tripID : any, razred : any, res : any)
{
    let end_score = 0
    return mysql_connection.query('SELECT grade FROM quiz WHERE school_tripID = ? AND studentID = ?', [school_tripID, idperson], function (error : any, results : any) {
        if (error)
        {
            
            mysql_connection.end();
            res.send(error)
        }
        else {
            mysql_connection.end();
            
            if (results.length == 0 || results[0] == null)
                end_score = 1
            else
            {
                end_score = results[0].grade
            }
            return mysql_connection.query('SELECT grade FROM quiz_solutions WHERE qs_idschool_trip = ? AND qs_iduser = ?', [school_tripID, idperson], function (error : any, results : any) {
                if (error)
                {
                    
                    mysql_connection.end();
                    res.send(error)
                }
                else {
                    if (results.length == 0)
                        end_score = (end_score + 1)/2
                    else
                    {
                        let tmp_score = 0
                        for (let i = 0; i < results.length; i++)
                        {
                            if (results[i].grade == null)
                            {
                                if (tmp_score == 0)
                                {
                                    tmp_score = 1
                                }
                                else
                                {
                                    tmp_score = (tmp_score + 1)/2
                                }
                            }
                            else
                            {
                                if (tmp_score == 0)
                                {
                                    tmp_score = results[i].grade
                                }
                                else
                                {
                                    tmp_score = (tmp_score + results[i].grade)/2
                                }
                            }
                        }
                        end_score = (end_score + tmp_score)/2
                        
                    }
                    mysql_connection.query('INSERT INTO grades (grade, studentID, school_tripID, class) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE grade=?;', [end_score, idperson, school_tripID, razred, end_score], function (error : any, results : any) {
        
                        if (error)
                        {
                            mysql_connection.end();
                            res.send(error);
                        }
                        else {
                            mysql_connection.end();
                        }
                    });
                }
            })
        }
    })
}

app.put("/grades/add_grade/:id", (req : any, res : any) => {
    mysql_connection.query('UPDATE grades SET grade = ? WHERE idgrades = ?', [req.body.grade, req.params.id], function (error : any, results : any) {

        if (error)
        {
            console.log(error)
            mysql_connection.end();
            res.send(error);
        }
        else {
            mysql_connection.end();
            console.log(results)
            res.send(results);
        }
    });
})

app.delete("/grades/delete_grade/:id", (req : any, res : any) => {
    mysql_connection.query('DELETE FROM  grades WHERE idgrades = ?', [req.params.id], function (error : any, results : any) {

        if (error)
        {
            console.log(error)
            mysql_connection.end();
            res.send(error);
        }
        else {
            mysql_connection.end();
            console.log(results)
            res.send(results);
        }
    });
})

