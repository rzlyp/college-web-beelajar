const multer = require('multer');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

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
	

}

module.exports = new UserController();