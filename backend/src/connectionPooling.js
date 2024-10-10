const mysql = require("mysql");
const dbdata = require("./config.json");

var connection = mysql.createPool({
  connectionLimit: 1000,
  host: dbdata.DB.host,
  user: dbdata.DB.username,
  password: dbdata.DB.password,
  port: dbdata.DB.port,
  database: dbdata.DB.database,
});

module.exports = connection;
