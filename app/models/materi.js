const mongoose = require('mongoose');

const materiSchema =  mongoose.Schema({
	nama_materi : String,
	foto_materi : String
});

const Materi = mongoose.model('Materi',materiSchema);

module.exports = Materi;