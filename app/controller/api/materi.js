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
			con.query('SELECT pengajar.id_pengajar, pengajar.`nama_pengajar`, pengajar.`deskripsi_pengajar`,materi.`id_materi`,materi.`nama_materi`,lokasi_mengajar.lokasi_mengajar, pengajar.tarif_mengajar , AVG(rating.rating) AS rating FROM pengajar INNER JOIN `pengajar_materi` ON pengajar.`id_pengajar` = pengajar_materi.`id_pengajar` INNER JOIN materi ON materi.`id_materi` = `pengajar_materi`.`id_materi` INNER JOIN lokasi_mengajar ON pengajar.`id_pengajar` = lokasi_mengajar.`id_pengajar` LEFT JOIN rating ON rating.`id_pengajar` = `pengajar`.`id_pengajar`GROUP BY `pengajar_materi`.`id_pengajar_materi`HAVING id_materi = ?',req.params.id_materi,function(err,user){
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
	this.srcPengajarMateri = (req,res, next) =>{
		const cari = req.body.cari;
		db.getConnection(function(err,con){
			con.query("SELECT pengajar.id_pengajar, pengajar.`nama_pengajar`, pengajar.`deskripsi_pengajar`,materi.`id_materi`,materi.`nama_materi`,lokasi_mengajar.lokasi_mengajar, pengajar.tarif_mengajar , AVG(rating.rating) AS rating FROM pengajar INNER JOIN `pengajar_materi` ON pengajar.`id_pengajar` = pengajar_materi.`id_pengajar` INNER JOIN materi ON materi.`id_materi` = `pengajar_materi`.`id_materi` INNER JOIN lokasi_mengajar ON pengajar.`id_pengajar` = lokasi_mengajar.`id_pengajar` LEFT JOIN rating ON rating.`id_pengajar` = `pengajar`.`id_pengajar`GROUP BY `pengajar_materi`.`id_pengajar_materi`HAVING materi.nama_materi LIKE CONCAT('%',?,'%')",cari,function(err,user){
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