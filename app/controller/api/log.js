const db = require('../../../config/database');

function LogController(){
	this.getLogPengajar = (req, res, next) => {
		db.getConnection((err, con) => {
			con.query("SELECT pengajar.nama_pengajar, customer.nama_customer , materi.nama_materi, log_mengajar.mulai_mengajar, log_mengajar.akhir_mengajar FROM log_mengajar INNER JOIN pengajar ON pengajar.id_pengajar = log_mengajar.id_pengajar INNER JOIN customer ON customer.id_customer = log_mengajar.id_customer INNER JOIN materi ON materi.id_materi = log_mengajar.id_materi WHERE log_mengajar.id_pengajar = ? ", req.params.id_pengajar, (err,log) =>{
			con.release();	
				if(err)
					console.log(err);

				res.json({status_code : 200, message : "success get log mengajar", data : log});
			});
		});
	}
	this.postLogPengajar = (req, res, next) =>{
		const data {
			id_pengajar : req.body.id_pengajar,
			id_customer : req.body.id_customer,
			id_materi   : req.body.id_materi,
			mulai_mengajar : req.body.mulai_mengajar
		};
		db.getConnection((err, con) =>{
			con.query("INSERT INTO log_mengajar SET ?",data, (err, log) =>{
			con.release();

				if(err)
					console.log(err);

				res.json({
					status_code : 201,
					message : 'Log berhasil ditambahkan .'
				});
			});
		});
	}
	this.getLogPengajar = (req, res, next) => {
		db.getConnection((err, con) => {
			con.query("SELECT pengajar.nama_pengajar, customer.nama_customer , materi.nama_materi, log_mengajar.mulai_mengajar, log_mengajar.akhir_mengajar FROM log_mengajar INNER JOIN pengajar ON pengajar.id_pengajar = log_mengajar.id_pengajar INNER JOIN customer ON customer.id_customer = log_mengajar.id_customer INNER JOIN materi ON materi.id_materi = log_mengajar.id_materi WHERE log_mengajar.id_customer = ? ", req.params.id_customer, (err,log) =>{
			con.release();	
				if(err)
					console.log(err);

				res.json({status_code : 200, message : "success get log murid", data : log});
			});
		});
	}
}

module.exports = new LogController();