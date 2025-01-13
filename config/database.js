let mysql = require("mysql");
let connection = mysql.createConnection({
  host: "cc112.kerissumenep.com",
  user: "kera3676_112",
  password: "v~(-fFQCJ+Y9",
  database: "kera3676_cc112",
});

connection.connect(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("Connection Success");
  }
});

module.exports = connection;
