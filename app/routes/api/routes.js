const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
var db = require('../../../config/database');
var materi = require('../../controller/api/materi');



router.get('/',(req,res)=>{
	res.json({message : "Welcome to beelajar api"});
});


/*
	Authentichation for pengajar 
	
*/
router.post('/auth/pengajar',(req,res)=>{
	const email = req.body.email;
	console.log(req.body.password);
	db.getConnection(function(err,con){
		con.query('SELECT * FROM pengajar where email = ? LIMIT 1',email,function(err,user){
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
				//console.log(compare);
				if(compare === false){
					res.json({
						success : false,
						status_code : 400,
						message : 'Failed ,wrong password or username'
					});
				}else{
					var token = jwt.sign(user,"beelajarSecret",{
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
	Authentichation for customer 
	
*/
router.post('/auth/customer',(req,res)=>{
	const email = req.body.email;
	console.log(req.body.password);
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
				//console.log(compare);
				if(compare === false){
					res.json({
						success : false,
						status_code : 400,
						message : 'Failed ,wrong password or username'
					});
				}else{
					var token = jwt.sign(user,"beelajarSecret",{
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
router.get('/materi/pengajar/:id_materi',materi.getPengajarMateri);


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


module.exports = router;