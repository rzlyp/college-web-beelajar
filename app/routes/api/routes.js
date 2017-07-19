const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const async = require('async');
const bcrypt = require('bcrypt-nodejs');

const db = require('../../../config/database');
const materi = require('../../controller/api/materi');
const user = require('../../controller/api/users');
const ulasan = require('../../controller/api/ulasan');


	const log = require('../../controller/api/log');
			router.get('/',(req,res)=>{
				res.json({message : "Welcome to beelajar api"});
			});
			
		router.get('/profile/murid/:id_customer', user.getProfileMurid);
		router.get('/profile/pengajar/:id_pengajar',user.getProfilePengajar);
		router.post('/register',user.registerUser);
		router.get('/pengajar/profile/:id_pengajar/:id_customer/:id_materi',user.getProfile);
		router.post('/auth/pengajar',(req,res)=>{
			const email = req.body.email;
			db.getConnection(function(err,con){
				con.query('SELECT * FROM pengajar where email = ? LIMIT 1',email,function(err,user){
				//con.release();
					if(err)
						console.log(err);

					//res.json(user);
					if(user.length <= 0){
						res.json({
							status_code : 400,
							message : 'user not found'
						});
					}else{
						if(user[0].status !== 'vertified'){
							res.json({
								status_code : 403,
								message : "Pengajar belum tervertifikasi ."
							});
						}else{
							const compare = bcrypt.compareSync(req.body.password, user[0].password);
						
							if(compare === false){
								res.json({
									success : false,
									status_code : 400,
									message : 'Failed ,wrong password or username'
								});
							}else{
							// 	con.query('Update pengajar set firebase_token = '+firebase_token+' where email = ? LIMIT 1',email,function(err,check){
							// 		con.release();
							// 	});
								var data = {
									id_pengajar : user[0].id_pengajar,
									nama_pengajar : user[0].nama_pengajar,
									email : user[0].email,
									role : user[0].role

								}
								
								var token = jwt.sign(data,"beelajarSecret",{
									expiresIn : 60*60*24
								});

									async.parallel({

							profile : function(callback){
						    	con.query('SELECT pengajar.id_pengajar, pengajar.`nama_pengajar`, pengajar.`deskripsi_pengajar`,lokasi_mengajar.lokasi_mengajar, pengajar.tarif_mengajar , AVG(rating.rating) AS rating FROM pengajar INNER JOIN lokasi_mengajar ON pengajar.`id_pengajar` = lokasi_mengajar.`id_pengajar` INNER JOIN rating ON rating.`id_pengajar` = `pengajar`.`id_pengajar` WHERE pengajar.id_pengajar = ?',user[0].id_pengajar,function(err,user){

									if(err)
										console.log(err);

									callback(null, user);
								});
							},
							keahlian : function(callback){
								con.query('select materi.nama_materi from pengajar_materi INNER JOIN materi ON materi.id_materi = pengajar_materi.id_materi WHERE id_pengajar = ?',user[0].id_pengajar,function(err,user){
								con.release();	

									if(err)
										console.log(err);

									callback(null, user);
								});
							}

						}, function(err, results) {
						   //console.log(results);

						   
						   res.json({	status_code : 200,
											message : 'Login success',
											data : results,
											token : token
										});
						});
								
							}
						}

						
							
						
					}

					
				});
			});
				
		});
		/*
			Authentichation for customer 
			
		*/
		router.post('/auth/customer',(req,res)=>{
			const email = req.body.email;
			db.getConnection(function(err,con){
				con.query('SELECT * FROM customer where email = ? LIMIT 1',email,function(err,user){
				con.release();
					if(err)
						console.log(err);

					//res.json(user);
					if(user.length <= 0){
						res.json({
							status_code : 400,
							message : 'user not found'
						});
					}else{
						
							const compare = bcrypt.compareSync(req.body.password, user[0].password);
						
							if(compare === false){
								res.json({
									success : false,
									status_code : 400,
									message : 'Failed ,wrong password or username'
								});
							}else{
								var data = {
									id_customer : user[0].id_customer,
									nama_customer : user[0].nama_customer,
									email : user[0].email,
									role : user[0].role

								}
								var token = jwt.sign(data,"beelajarSecret",{
									expiresIn : 60*60*24
								});
								res.json({
									status_code : 200,
									message : 'Login success',
									data : user,
									token : token
								});
							}
						

						
							
						
					}

					
				});
			});
				
		});

		/* 
			Materi routes api
		*/
		router.get('/materi', materi.getMateri);
		router.post('/materi/search', materi.srcPengajarMateri);
		router.get('/pengajar/materi/:id_materi',materi.getPengajarMateri);


		router.use((req,res,next)=>{
			var token = req.body.token || req.query.token || req.headers['x-access-token'];
			if(token){
				jwt.verify(token,"beelajarSecret",function(err,decoded){
					if(err){
						return res.json({
							status_code : 401,
							message : 'Failed Authenticate Token'
						});
					}else{
						req.decoded = decoded;
						next();
					}
				});
			}else{
				return res.status(403).send({ 
			        success: false, 
			        message: 'No token provided.' 
		    	});
			}
		});

		//Murid
		router.get('/ulasan/:id_pengajar',ulasan.getUlasan);
		router.put('/profile/update/:id_customer', user.updateProfileMurid);

		//Pengajar
		router.post('/ulasan',ulasan.postUlasan);
		router.get('/log/customer/:id_customer', log.getLogMurid);
		router.post('/log/pengajar',log.postLogPengajar);
		router.post('/murid/kelas',log.postPilihKelas);





module.exports = router;