const db = require('../../../config/database');

function LogController(){
	this.getLogMurid = (req, res, next) => {
		db.getConnection((err, con) => {
			con.query("SELECT pengajar.nama_pengajar, customer.nama_customer ,log_mengajar.materi_mengajar , log_mengajar.mulai_mengajar, log_mengajar.akhir_mengajar FROM log_mengajar INNER JOIN pengajar ON pengajar.id_pengajar = log_mengajar.id_pengajar INNER JOIN customer ON customer.id_customer = log_mengajar.id_customer WHERE log_mengajar.id_customer = ? ", req.params.id_customer, (err,log) =>{
			con.release();	
				if(err)
					console.log(err);

				res.json({status_code : 200, message : "success get log mengajar", data : log});
			});
		});
	}
	this.postLogPengajar = (req, res, next) =>{
		const data = {
			id_pengajar : req.body.id_pengajar,
			id_customer : req.body.id_customer,
			materi_mengajar   : req.body.materi,
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
		this.postPilihKelas = (req, res, next) =>{
			const data = {
				id_pengajar : req.body.id_pengajar,
				id_customer : req.body.id_customer,
				id_materi : req.body.id_materi
			};

			db.getConnection((err, con)=>{
				con.query("SELECT * FROM kelas_pengajar WHERE id_pengajar = ? AND id_customer = ? AND id_materi = ? ",[data.id_pengajar, data.id_customer, data.id_materi], (err, counts)=>{
					if(counts.length === 0){
						con.query("INSERT INTO kelas_pengajar SET ? ", data, (err, status) =>{
							con.release();
							if(err)
								res.json({status_code : 400, message : err});

							res.json({
								status_code : 201,
								message : "Berhasil memilih pengajar"
							});
						});
					}else{
						con.query("DELETE FROM kelas_pengajar WHERE id_kelas_pengajar = ?", counts[0].id_kelas_pengajar , (err, status) =>{
							con.release();
							if(err)
								res.json({status_code : 400, message : err});

							res.json({
								status_code : 201,
								message : "Berhasil membatalkan pengajar"
							});
						});
					}
				});
				
			});
		}
		this.postRemove = (req, res, next) =>{
		

			db.getConnection((err, con)=>{
				con.query("DELETE FROM kelas_pengajar WHERE id_pengajar = ? AND id_customer = ?", [req.params.id_pengajar, req.params.id_customer], (err, status) =>{
					con.release();
					if(err)
						res.end(err);

					res.json({
						status_code : 201,
						message : "Berhasil menghapus pengajar"
					});
				});
			});
		}
}

module.exports = new LogController();