const db = require('../../config/database');

function LokasiController(){
	this.addLokasi = (req, res, next) =>{
		const data = {
			lokasi_mengajar : req.body.lokasi_mengajar,
			id_pengajar : req.user.id_pengajar
		};
		db.getConnection((err, con) => {
				con.query("insert into lokasi_mengajar SET ? ", data , (err, data) =>{
				con.release();	
					if(err)
						console.log(err);

					res.redirect('/pengajar/dashboard');
				});
		});
	}
	this.ubahLokasi = (req, res, next) =>{
		con.query("delete from pengajar_materi where id_pengajar_materi ? ", req.params.id_pengajar_materi , (err, data) =>{
				con.release();	
					if(err)
						console.log(err);

					res.redirect('/pengajar/dashboard');
		});
	}
}

module.exports = new LokasiController();