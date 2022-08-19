require('dotenv').config()
const mongoose = require('mongoose')
const mysql = require('mysql2')

const PORT = process.env.PORT || 3001
const HOST = process.env.HOST

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION
const AWS_Access_key_ID = process.env.AWS_Access_key_ID
const AWS_Secret_access_key = process.env.AWS_Secret_access_key


const MDB_HOST = process.env.MDB_HOST
const MDB_DATABASE = process.env.MDB_DATABASE
const MDB_USER = process.env.MDB_USER
const MDB_PWD = process.env.MDB_PWD
const MDB_PORT = process.env.MDB_PORT
const MDB_PROTOCOL = process.env.MDB_PROTOCOL


//SMTP G-Suit
const sendGEmail = {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_PORT: process.env.EMAIL_PORT,
  clientId: '975688741054-qsre2625tkgveh5jjebdic210b9c2l7g.apps.googleusercontent.com',
  clientSecret: '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',
  refreshToken: '1//0410GTs7ttAJZCgYIARAAGAQSNwF-L9Ir4KaK6nX5h6m_AzNe1F1eQ-jh9JXUvS8lhwIBerNnAFKHyDqayFNo0Dol-kfHfYi0BP0',
  redirectUri: 'https://developers.google.com/oauthplayground'
}


// MongoDB DIgital Ocean-2
//const MONGODB_URI = "mongodb+srv://doadmin:30x814oJ67N2gyYW@db-mongodb-nyc3-97071-024615bf.mongo.ondigitalocean.com/Finanservs?authSource=admin&replicaSet=db-mongodb-nyc3-97071&tls=true&tlsCAFile=ca-certificate-MDB.crt"
const MONGODB_URI = `${MDB_PROTOCOL}://${MDB_USER}:${MDB_PWD}@${MDB_HOST}/${MDB_DATABASE}?authSource=admin&replicaSet=db-mongodb-nyc3-97071&tls=true&tlsCAFile=ca-certificate-MDB.crt`


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

const APC = {
  user: process.env.APC_USER,
  pass: process.env.APC_PASS
}

const CLIENTIFY = {
  username: process.env.CF_USERNAME,
  password: process.env.CF_PASSWORD
}

const ORIGEN = {
  nombre: process.env.NOMBRE,
  agente: process.env.AGENTE
}

module.exports = {
  APC,
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_Access_key_ID,
  AWS_Secret_access_key,
  PORT,
  HOST,
  cnn,
  MONGODB_URI,
  sendGEmail,
  CLIENTIFY,
  ORIGEN
}