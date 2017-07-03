const db = require('../../config/database');

function JadwalController(){
	this.getJadwal = (req, res, next) => {
		db.getConnection((err,con) => {
			con.query('SELECT * FROM jadwal where id_pengajar = ?',req.user.id_pengajar, (err, data) =>{
				con.release();

				res.render('pengajar/jadwal', {jadwal : data, user : req.user});
			});
		});
	}
	this.postAddJadwal = (req, res, next) =>{
			
			const data = {
				id_pengajar : req.user.id_pengajar,
				hari : req.body.hari,
				jam_mulai : req.body.jam_mulai,
				jam_selesai : req.body.jam_selesai
			};
			console.log(data);
			
      		db.getConnection((err,con) => {
			con.query('insert into jadwal set ?', data,(err, data) =>{
				con.release();

				res.redirect('/pengajar/jadwal');
			});
		});

	}
	this.postEditJadwal = (req, res, next) =>{
			
			const data = {
				hari : req.body.hari,
				jam_mulai : req.body.jam_mulai,
				jam_selesai : req.body.jam_selesai
			};
			
      		db.getConnection((err,con) => {
			con.query('UPDATE jadwal set ? where id_jadwal = ?', [data, req.params.id_jadwal],(err, data) =>{
				con.release();

				res.redirect('/pengajar/jadwal');
			});
		});

	}
	this.removeJadwal = (req, res, next) =>{
		
			
      		db.getConnection((err,con) => {
			con.query('DELETE FROM jadwal where id_jadwal = ?', req.params.id_jadwal,(err, data) =>{
				con.release();

				res.redirect('/pengajar/jadwal');
			});
		});

	}
}

module.exports = new JadwalController();
