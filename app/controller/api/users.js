const multer = require('multer');
const bcrypt = require('bcrypt-nodejs');
const User = require('../../models/users');

//make class UserController
function UserController(){
	//make register function
	this.registerUser = (req, res, next) => {
		const dataUuser = {
			nama_user : req.body.nama_user,
			email : req.body.email,
			no_telp : req.body.phone,
			foto : 'avatar.png',
			password : bcrypt.hashSync(req.body.password),
			role : 'user'
		}

		const saveUser = new User(dataUuser);
		saveUser.save((err, doc)=>{
			if(err)
				res.json({message : err});


			const data = {
				staus_code : 200,
				message : 'Register berhasil',
				data : doc
			};
			res.status(200).json(data);
		});
		//res.json({test : dataUuser});
	}
}

module.exports = new UserController();