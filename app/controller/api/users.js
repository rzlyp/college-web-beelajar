const multer = require('multer');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const db = require('../../../config/database');
const User = require('../../models/users');

//make class UserController
function UserController(){
	//make register function
	this.registerUser = (req, res, next) => {
		const dataUuser = {
			nama_customer : req.body.nama_user,
			email : req.body.email,
			no_telp : req.body.no_telp,
			foto_customer : 'avatar.png',
			password : bcrypt.hashSync(req.body.password),
			role : 'murid'
		}

		db.getConnection((err,con) => {
			con.query('insert into customer set ?', dataUuser,(err, data, user) =>{
				

				if(err)
					res.json({status_code : 500, message : err});

					
					con.query('select * from customer where email = ? ', dataUuser.email,(err, user) =>{
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
			});
	}

}

module.exports = new UserController();