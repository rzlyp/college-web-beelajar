const db = require('../../../config/database');

function UlasanController(){
	this.getUlasan = (req, res, next) =>{
		if(!req.params.id_pengajar){
				res.json({
					status_code : 400,
					message : "Params id materi not found"
				});
		}else{
			db.getConnection((err,conn) => {
			conn.query('SELECT customer.`nama_customer` , rating.`rating`,rating.`ulasan`, rating.`created_at` FROM rating INNER JOIN customer ON customer.`id_customer` = rating.`id_customer` WHERE rating.`id_pengajar` = ?', req.params.id_pengajar, (err,rating)=>{
			conn.release();	
				if(err)
					console.log(err);

				res.json({status_code:200, message : 'success get ulasan', data : rating});
			});

			});
		}
		
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
			   conn.query("select * from rating where id_pengajar = "+data.id_pengajar+" and id_customer = "+data.id_customer, (err, check) =>{
			   	console.log(check.length);
			   		if(check.length === 0){
			   			conn.query('INSERT INTO rating SET ?', data, (err,rating)=>{
						conn.release();	
							if(err)
								console.log(err);

							res.json({status_code:201, message : 'Ulasan berhasil disimpan'});
						});
			   		}else{
			   			res.json({status_code : 400, message : "Ulasan telah dikirim sebelumnya"})
			   		}
			   		
				 });	
				
			});
		
	}
	
}

module.exports = new UlasanController();