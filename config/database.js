const mysql = require('mysql');

const connection = mysql.createPool({
	host :'ap-cdbr-azure-southeast-b.cloudapp.net',
	user : 'bcd1c8cf53aef8',
	password : 'ced445b5',
	database : 'beelajar'
});
module.exports = connection;