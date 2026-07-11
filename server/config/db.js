require("dotenv").config();
const mysql = require("mysql2");
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: "+05:30",
    dateStrings: true

});

db.connect((err)=>{

    if(err){

        console.log(err);

    }

    else{

        console.log("✅ MySQL Connected Successfully");

    }

});

module.exports=db;