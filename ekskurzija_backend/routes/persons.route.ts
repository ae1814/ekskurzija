export { app as persons };

var express = require('express');
const app = express.Router();
var mysql_connection = require("../common/mysql/mysql.config")


app.get("/get_all_students/:class", (req : any, res : any) => {
    mysql_connection.query('SELECT * FROM person WHERE type = 1 AND class= ? ORDER BY name', [req.params.class], function (error : any, results : any) {

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

app.get("/:id", (req : any, res : any) => {
    mysql_connection.query('SELECT * FROM person WHERE idperson = ?', req.params.id, function (error : any, results : any) {

        if (error)
        {
            
            mysql_connection.end();
            res.send(500);
        }
        else {
            mysql_connection.end();
           // console.log(results)
            res.send(results);
        }
    });
})

app.post("/signin", (req : any, res : any) => {
    //console.log(req.body)
    var passwd = req.body.password
    var email = req.body.email
    mysql_connection.query('SELECT * FROM person WHERE email = ? AND password = ?', [email, passwd], function (error : any, results : any) {

        if (error)
        {
            
            mysql_connection.end();
            res.send(error);
        }
        else {
            mysql_connection.end();
            //console.log(results)
            res.send(results);
        }
    });
})
app.post("/signup", (req : any, res : any) => {

    mysql_connection.query('INSERT INTO person (name, email, password, type, class) VALUES (?, ?, ?, ?, ?)', [req.body.name, req.body.email, req.body.password, req.body.type, req.body.class], function (error : any, results : any) {

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
app.delete("/:id", (req : any, res : any) => {
    
    mysql_connection.query('DELETE FROM person where idperson = ?', req.params.id, function (error : any, results : any) {

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
    if (data_json.email != undefined && data_json.email != null)
    {
        selected_columns += ",email = ?"
        selected_inputs.push(data_json.email);
    }
    if (data_json.password != undefined && data_json.password != null && data_json.password != "")
    {
        selected_columns += ",password = ?"
        selected_inputs.push(data_json.password);
    }
    if (data_json.type != undefined && data_json.type != null)
    {
        selected_columns += ",type = ?"
        selected_inputs.push(data_json.type);
    }
    if (data_json.class != undefined && data_json.class != null)
    {
        selected_columns += ",class = ?"
        selected_inputs.push(data_json.class);
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
    mysql_connection.query('UPDATE person SET '+selected_columns+' WHERE idperson=?', selected_inputs,  function (error : any, results : any) {
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

