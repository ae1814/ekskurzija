var mysql = require('mysql');
require('dotenv').config({ path: '/Users/aljazerzin/OneDrive/ŠOLA/IOI/SEMINAR 2/ekskurzija/.env'});
import { callbackify } from 'util';
var pool = mysql.createPool({
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    database : process.env.DB_NAME,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    insecureAuth : true
});


module.exports = {
    query: function(){
        
        var sql_args : any[] = [];
        var args : any[] = [];
        for(var i=0; i<arguments.length; i++){
            args.push(arguments[i]);
        }
        var callback = args[args.length-1];
        pool.getConnection(function(err : any, connection : any) {
        if(err) {
                return callback(err);
            }
            if(args.length > 2){
                sql_args = args[1];
            }
        connection.query(args[0], sql_args, function(err : any, results : any) {
          connection.release();
          if(err){
                    return callback(err);
                }
          callback(null, results);
        });
      });
    },
    end: function() {
        pool.getConnection(function(err : any, connection : any) {
            if(err) {
                    //console.log(err)
                    return callbackify(err);
                }
                connection.release();
          });
    }
};
