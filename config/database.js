const mysql = require('mysql');

const connection = mysql.createPool({
	host :'localhost',
	user : 'root',
	password : '',
	database : 'beelajar'
});
module.exports = connection;