var LocalStrategy = require('passport-local').Strategy;
var db = require('./database');

const bcrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	passport.serializeUser(function(pengajar,done){
		done(null,pengajar.id_pengajar);
	});

	passport.deserializeUser(function(id_pengajar, done) {
		db.getConnection(function(err,con){
				con.query('SELECT * FROM pengajar where id_pengajar = ?',[id_pengajar],function(err,pengajar){
					con.release();
						done(err, pengajar[0]);
				});
		});
    });

    passport.use('local-login',new LocalStrategy({
    	usernameField : 'email',
    	passwordField : 'password',
    	passReqToCallback : true
    },
    function(req,email,password,done){
			db.getConnection(function(err,con){
					con.query('SELECT * FROM pengajar where email = ? ',[email],
							function(err,pengajar){
								con.release();
									if (err) 
											return done(err);
									
									if (pengajar.length <= 0) {
											return done(null, false, {message: 'Username atau password yang anda masukan salah.'});
									}else{
										const compare = bcrypt.compareSync(req.body.password, pengajar[0].password);
										if (compare === false) {
												return done(null, false, {message: 'Invalid password'});
										}

										return done(null, pengajar[0]);
									}
									
					});
			});
    }
    ));
       passport.use('local-pengajar',new LocalStrategy({
    	usernameField : 'email',
    	passwordField : 'password',
    	passReqToCallback : true
    },
    function(req,email,password,done){
			db.getConnection(function(err,con){
					con.query('SELECT * FROM pengajar where email = ? ',[email],
							function(err,pengajar){
								con.release();
									if (err) 
											return done(err);
									
									if (pengajar.length <= 0) {
											return done(null, false, {message: 'Username atau password yang anda masukan salah.'});
									}else{
										const compare = bcrypt.compareSync(req.body.password, pengajar[0].password);
										if (compare === false) {
												return done(null, false, {message: 'Invalid password'});
										}

										return done(null, pengajar[0]);
									}
									
					});
			});
    }
    ));
};
