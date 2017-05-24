const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/beelajar');
const check = mongoose.connection;

check.on('error',() =>{
	console.log('Error connection');
});

check.on('open',()=>{
	console.log('mongoodb is connected ..');
});