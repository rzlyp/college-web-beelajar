const multer = require('multer');
const bcrypt = require('bcrypt-nodejs');
const async = require('async');


const db = require('../../config/database');

function PegajarController(){
	this.getRegister = (req, res, next) =>{
		res.render('pengajar/register',{message : ''});
	}	
	this.postRegister = (req, res, next) =>{
      		const data = {
      			nama_pengajar : req.body.nama_pengajar,
      			email : req.body.email,
      			no_telp : req.body.no_telp,
      			password : bcrypt.hashSync(req.body.password),
      			foto_pengajar : 'avatar.png',
      			status : 'unvertified',
      			role : 'pengajar'
      		}
      		console.log(data);
      		db.getConnection((err,con) => {
			con.query('insert into pengajar set ?', data,(err, data) =>{
				con.release();
				if(err)
					console.log(err);
				req.flash('message', 'Register Berhasil Silahkan Login');
				res.render('pengajar/register',{message : "Register Berhasil Silahkan <a href='/pengajar/login' class='btn btn-success btn-mini'> Login </a>"});
			});
		});
	}
	this.dashboard = (req, res, next) =>{
		db.getConnection((err, con) => {
			async.parallel({
				    ulasan: function(callback) {
				        con.query('SELECT customer.`nama_customer` , rating.`rating`,rating.`ulasan`, rating.`created_at` FROM rating INNER JOIN customer ON customer.`id_customer` = rating.`id_customer` WHERE rating.`id_pengajar` = ? order by rating.created_at DESC LIMIT 10', req.user.id_pengajar, (err, data) =>{
				        	if(err)
				        		console.log(err);

				        	callback(null, data);
				        });
				    },
				    materi: function(callback) {
				        con.query('select materi.nama_materi , pengajar_materi.id_pengajar_materi from materi inner join pengajar_materi ON pengajar_materi.id_materi = materi.id_materi where pengajar_materi.id_pengajar = ?', req.user.id_pengajar, (err, data) =>{
				        	//con.release();
				        	if(err)
				        		console.log(err);

				        	callback(null, data);
				        });
				    },
				    lokasi : function(callback){
				    	con.query('select lokasi_mengajar.lokasi_mengajar , lokasi_mengajar.id_tempat from lokasi_mengajar where lokasi_mengajar.id_pengajar = ?', req.user.id_pengajar, (err, data) =>{
				        	//con.release();
				        	if(err)
				        		console.log(err);

				        	callback(null, data);
				        });
				    },
				    all_materi : function(callback){
				    	con.query('select * from materi', (err, data) =>{
				        	con.release();
				        	if(err)
				        		console.log(err);

				        	callback(null, data);
				        });
				    }

				}, function(err, results) {
				   console.log(results);

				   res.render('pengajar/index', {data : results, user : req.user});
				});
		});
	}
}

module.exports = new PegajarController();