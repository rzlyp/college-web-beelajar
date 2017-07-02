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
		const data = {
			lokasi_mengajar : req.body.lokasi_mengajar
		};
		db.getConnection((err, con) => {
			con.query("update lokasi_mengajar set ? where id_tempat = ? ",[data,req.params.id_tempat] , (err, data) =>{
					con.release();	
						if(err)
							console.log(err);

						res.redirect('/pengajar/dashboard');
			});
		});
	}
}

module.exports = new LokasiController();