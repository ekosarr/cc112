require('dotenv').config();  // Pastikan dotenv di-load di awal file

let mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,         // Mengambil dari .env
  user: process.env.DB_USER,         // Mengambil dari .env
  password: process.env.DB_PASSWORD, // Mengambil dari .env
  database: process.env.DB_NAME,     // Mengambil dari .env
});

connection.connect(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("Connection Success");
  }
});

module.exports = connection;
