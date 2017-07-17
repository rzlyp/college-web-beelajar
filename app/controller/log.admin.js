const db = require('../../config/database');

function LogController(){

	this.getLog = (req, res, next) =>{
		db.getConnection((err,con) => {
				con.query("SELECT pengajar.nama_pengajar, jadwal_mengajar.materi_mengajar ,customer.nama_customer ,jadwal_mengajar.materi_mengajar , DATE_FORMAT(log_mengajar.mulai_mengajar, '%D %M %Y %H:%i') as mulai_mengajar, DATE_FORMAT(log_mengajar.akhir_mengajar, '%D %M %Y %H:%i') as akhir_mengajar, log_mengajar.mulai_mengajar as s_mulai, log_mengajar.akhir_mengajar as s_akhir FROM jadwal_mengajar INNER JOIN pengajar ON pengajar.id_pengajar = jadwal_mengajar.id_pengajar INNER JOIN customer ON customer.id_customer = jadwal_mengajar.id_customer INNER JOIN log_mengajar ON log_mengajar.id_jadwal_mengajar = jadwal_mengajar.id_jadwal_mengajar WHERE jadwal_mengajar.id_pengajar = ? ",req.params.id_pengajar,(err, data) =>{
					con.release();
                              console.log(data);
					res.render('admin/pengajar/log',{log : data, user : req.user});
				});
		});

	}
	
}

module.exports = new LogController();