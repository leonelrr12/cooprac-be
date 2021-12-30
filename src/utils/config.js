require('dotenv').config()
const mongoose = require('mongoose')
const mysql = require('mysql2')

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


// SMTP gmail
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const EMAIL_FROM = process.env.EMAIL_FROM
const EMAIL_PORT = process.env.EMAIL_PORT


// MongoDB DIgital Ocean-2
const MONGODB_URI = "mongodb+srv://doadmin:30x814oJ67N2gyYW@db-mongodb-nyc3-97071-024615bf.mongo.ondigitalocean.com/Coopracrl?authSource=admin&replicaSet=db-mongodb-nyc3-97071&tls=true&tlsCAFile=ca-certificate-MDB.crt"


// MySql DIgital Ocean-2
const cnn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  password: process.env.DB_PWD,
  port: process.env.PORTDB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


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