const async = require('async');
const db = require('../../../config/database');

function MateriController(){
	this.getMateri = (req,res, next) =>{
		db.getConnection(function(err,con){
			con.query('SELECT * FROM materi',function(err,materi){
				con.release();

				if(err)
					console.log(err);

				res.json({
					status_code : 200,
					message : "success get materi",
					data : materi
				});
			});
		});
	}
	this.getPengajarMateri = (req,res, next) =>{
		db.getConnection(function(err,con){
			con.query('SELECT pengajar.id_pengajar, pengajar.nama_pengajar,pengajar.deskripsi_pengajar FROM pengajar_materi INNER JOIN pengajar ON pengajar.id_pengajar = pengajar_materi.id_pengajar where pengajar_materi.id_materi = ?',req.params.id_materi,function(err,user){
				con.release();

				if(err)
					console.log(err);

				res.json({
					status_code : 200,
					message : "success get pengajar materi",
					data : user
				});
			});
		});
	}
}

module.exports = new MateriController();