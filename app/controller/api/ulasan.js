const db = require('../../../config/database');

function UlasanController(){
	this.getUlasan = (req, res, next) =>{
		db.getConnection((err,conn) => {
			conn.query('SELECT customer.`nama_customer` , rating.`rating`,rating.`ulasan`, rating.`created_at` FROM rating INNER JOIN customer ON customer.`id_customer` = rating.`id_customer` WHERE rating.`id_pengajar` = ?', req.params.id_pengajar, (err,rating)=>{
			conn.release();	
				if(err)
					console.log(err);

				res.json({status_code:200, message : 'success get ulasan', data : rating});
			});

		});
	}
	this.postUlasan = (req, res, next) =>{
		const tgl = new Date();
		const data = {
			id_pengajar : req.body.id_pengajar,
			id_customer : req.body.id_customer,
			rating : req.body.rating,
			ulasan : req.body.ulasan,
			created_at : tgl
		};
		db.getConnection((err,conn) => {
			conn.query('INSERT INTO rating SET ?', data, (err,rating)=>{
			conn.release();	
				if(err)
					console.log(err);

				res.json({status_code:201, message : 'Ulasan berhasil disimpan'});
			});

		});
	}
}

module.exports = new UlasanController();