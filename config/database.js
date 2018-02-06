const mysql = require('mysql');

const connection = mysql.createPool({
	host :'52.230.4.225',
	user : 'root',
	password : 'code@labs',
	database : 'beelajar'
});
module.exports = connection;
