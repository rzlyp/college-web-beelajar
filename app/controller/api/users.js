const multer = require('multer');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const async = require('async');

const db = require('../../../config/database');
const User = require('../../models/users');

//make class UserController
function UserController(){
	//make register function
	this.registerUser = (req, res, next) => {
		

		db.getConnection((err,con) => {
			con.query("select * from customer where email = ?", req.body.email, (err, check)=>{

				if(check.length === 0){
					const dataUser = {
						nama_customer : req.body.nama_user,
						email : req.body.email,
						no_telp : req.body.no_telp,
						foto_customer : 'avatar.png',
						password : bcrypt.hashSync(req.body.password),
						role : 'murid',
						firebase_token : req.body.firebase_token
					}
						con.query('insert into customer set ?', dataUser,(err, data, user) =>{
					

					if(err)
						res.json({status_code : 500, message : err});

						
						con.query('select * from customer where email = ? ', dataUser.email,(err, user) =>{
							con.release();
							console.log(user);
							if(err)
								console.log(err);

							var token = jwt.sign(user[0],"beelajarSecret",{
										expiresIn : 60*60*24
									});
									res.json({
										status_code : 201,
										message : 'register success',
										data : user[0],
										token : token
									});
							
							});
						
					
					
					});
				}else{
					var token = jwt.sign(check[0],"beelajarSecret",{
										expiresIn : 60*60*24
									});
					res.json({
								status_code : 200,
										message : 'User telah terdaftar',
										data : check[0],
										token : token
					});
							
					
					
				}
			});
			
			});
	}

	this.updateProfileMurid = (req, res, next) =>{
			var storage = multer.diskStorage({
	      		destination : function(req,file,callback){
	      			callback(null,'public/img');
	      		},
	      		filename : function(req,file,callback){
	      			console.log(file);
	      			callback(null,file.originalname);
	      		}
	      	});
	      	var upload = multer({storage:storage}).single('foto_customer');

	      	upload(req, res , (err)=>{
				      		db.getConnection((err,con) => {
					      		con.query("select * from customer where id_customer = ?", req.params.id_customer, (err, check) => {
					      			var data = {
							      			nama_customer : req.body.nama_customer,
							      			foto_customer : check[0].foto_customer,
							      			no_telp : req.body.no_telp,
							      			email : req.body.email
							      	}
					      			if(req.file){
						      				 data = {
								      			nama_customer : req.body.nama_customer,
								      			foto_customer : req.file.filename,
								      			no_telp : req.body.no_telp,
								      			email : req.body.email
								      	   }

								      	   if(check[0].foto_customer !== 'avatar.png'){
								      	   		fs.unlink('public/img/'+check[0].foto_customer);
								      	   }
								      	   

					      			}
					      			con.query('update customer set ? where id_customer = '+req.params.id_customer, data,(err, data) =>{
									con.release();

									res.json({
										status_code : 201,
										message : "Success update profile"
									});
								});
					      			
					      		});
								
							});
	      	});
		}

		this.getProfile = (req, res, next) =>{
			db.getConnection((err,con) => {

					async.parallel({

					profile : function(callback){
				    	con.query('SELECT pengajar.id_pengajar, pengajar.`nama_pengajar`, pengajar.`deskripsi_pengajar`,lokasi_mengajar.lokasi_mengajar, pengajar.tarif_mengajar , pengajar.foto_pengajar , ROUND(AVG(rating.rating), 1) AS rating FROM pengajar INNER JOIN lokasi_mengajar ON pengajar.`id_pengajar` = lokasi_mengajar.`id_pengajar` INNER JOIN rating ON rating.`id_pengajar` = `pengajar`.`id_pengajar` WHERE pengajar.id_pengajar = ?',req.params.id_pengajar,function(err,user){

							if(err)
								console.log(err);

							callback(null, user);
						});
					},
					status_pilih : function(callback){
						con.query("select * from kelas_pengajar where id_pengajar = ? AND id_customer = ? AND id_materi = ?", [req.params.id_pengajar, req.params.id_customer, req.params.id_materi], (err, data)=>{
							if(err)
								res.send(err);

							var status = 0;
							if(data.length > 0){
								status = 1;
							}

							callback(null, status);
						});
					},
					keahlian : function(callback){
						con.query('select materi.nama_materi from pengajar_materi INNER JOIN materi ON materi.id_materi = pengajar_materi.id_materi WHERE id_pengajar = ?',req.params.id_pengajar,function(err,user){
							

							if(err)
								console.log(err);

							callback(null, user);
						});
					},
					jadwal : function(callback){
						con.query('select hari,jam_mulai,jam_selesai from jadwal where id_pengajar = ?',req.params.id_pengajar,function(err,user){
							//con.release();

							if(err)
								console.log(err);

							callback(null, user);
						});
					},
					ulasan : function(callback){
						con.query('SELECT customer.`nama_customer` , rating.`rating`,rating.`ulasan`, rating.`created_at` FROM rating INNER JOIN customer ON customer.`id_customer` = rating.`id_customer` WHERE rating.`id_pengajar` = ?', req.params.id_pengajar, (err,rating)=>{
						con.release();	
							if(err)
								console.log(err);

							callback(null, rating);
						});
					}

				}, function(err, results) {
				   console.log(results);

				   res.json({status_code : 200, message : "Success get profile", data : results});
				});
			});
		}

		this.getProfileMurid = (req, res , next) =>{
				db.getConnection((err, con) =>{
				con.query('select * from customer where id_customer = ?', req.params.id_customer , (err, murid) =>{
					con.release();
						res.json({
							status_code : 200,
							message : 'success get profile murid',
							data : murid
						});
					});
				});
		}
		this.getProfilePengajar = (req, res , next) =>{
				db.getConnection((err, con) =>{
				con.query("select * from pengajar where id_pengajar =  ? AND role='pengajar'", req.params.id_pengajar , (err, pengajar) =>{
					con.release();
						res.json({
							status_code : 200,
							message : 'success get profile pengajar',
							data : pengajar
						});
					});
				});
		}
	

}

module.exports = new UserController();