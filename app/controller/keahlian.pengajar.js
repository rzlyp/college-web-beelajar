const db = require('../../config/database');

function KeahlianController(){
	this.addKeahlian = (req, res, next) =>{
		const data = {
			id_materi : req.body.materi,
			id_pengajar : req.user.id_pengajar
		};
		db.getConnection((err, con) => {
				con.query("insert into pengajar_materi SET ? ", data , (err, data) =>{
				con.release();	
					if(err)
						console.log(err);

					res.redirect('/pengajar/dashboard');
				});
		});
	}
	this.removeKeahlian = (req, res, next) =>{
		con.query("delete from pengajar_materi where id_pengajar_materi ? ", req.params.id_pengajar_materi , (err, data) =>{
				con.release();	
					if(err)
						console.log(err);

					res.redirect('/pengajar/dashboard');
		});
	}
}

module.exports = new KeahlianController();