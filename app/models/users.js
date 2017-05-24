const mongoose = require('mongoose');

const userSchema =  mongoose.Schema({
	nama_user : String,
	email : String,
	password : String,
	no_telp : String,
	foto : String,
	deskripsi : String,
	nama_instansi : String,
	jurusan_kuliah : String,
	foto_surat_aktif : String,
	foto_ktm : String,
	role : String,
	
});

const user = mongoose.model('User',userSchema);

module.exports = user;