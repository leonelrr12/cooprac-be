require('dotenv').config()
const mongoose = require('mongoose')
const mysql = require('mysql2')
const mysql2Timeout = require('mysql2-timeout-additions');
const MAX_QUERY_EXECUTION_TIME_SECONDS = 35;

const PORT = process.env.PORT || 3001
const HOST = process.env.HOST
const AWS_Access_key_ID = process.env.AWS_Access_key_ID
const AWS_Secret_access_key = process.env.AWS_Secret_access_key

const MDB_HOST = process.env.MDB_HOST
const MDB_DATABASE = process.env.MDB_DATABASE
const MDB_USER = process.env.MDB_USER
const MDB_PWD = process.env.MDB_PWD
const MDB_PORT = process.env.MDB_PORT
const MDB_PROTOCOL = process.env.MDB_PROTOCOL


//SMTP gmail
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const EMAIL_FROM = process.env.EMAIL_FROM
const EMAIL_PORT = process.env.EMAIL_PORT


// MySql DB
// const cnn = mysql.createConnection({
//     host: process.env.DB_HOST,
//     database: process.env.DATABASE,
//     user: process.env.DB_USER,
//     password: process.env.DB_PWD,
//     port: process.env.PORTDB
// })


const cnn = mysql.createPool({
  connectionLimit : 100,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  port: process.env.PORTDB
});
const promisePool = cnn.promise();

mysql2Timeout.addTimeoutToPromisePool({ 
  pool: promisePool, 
  seconds: MAX_QUERY_EXECUTION_TIME_SECONDS 
});


// MongoDB DIgital Ocean-2
// const MONGODB_URI = "mongodb+srv://doadmin:30x814oJ67N2gyYW@db-mongodb-nyc3-97071-024615bf.mongo.ondigitalocean.com/Finanservs?authSource=admin&replicaSet=db-mongodb-nyc3-97071&tls=true&tlsCAFile=ca-certificate-MDB.crt"
const MONGODB_URI = ""

// Check connection
cnn.query("select * from profesions", (err, data) => {
  if(err) {
    console.log(err)
    return
  } 
  console.log(data)
})

// cnn.connect(error => {
//   if (error) throw error;
//   console.log('Database server runnuning!');
// })


module.exports = {
  AWS_Access_key_ID,
  AWS_Secret_access_key,
  PORT,
  HOST,
  cnn,
  MONGODB_URI,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  EMAIL_PORT,
}