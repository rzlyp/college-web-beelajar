const materi = require('../controller/materi.admin');
const pengajar = require('../controller/pengajar.admin');
const log = require('../controller/log.admin');
const fcm = require('../controller/fcm');
module.exports = function(app,passport){
	app.get('/fcm',fcm.fcmTest);
	app.get('/login/admin',isLoggedIn,(req, res) => {
		res.render('login');
	});
	app.post('/login/admin',isLoggedIn,passport.authenticate('local-login',{
		successRedirect : '/dashboard/admin',
		failureRedirect : '/login',
		failureFlash : true
	}));


	app.get('/dashboard/admin',isNotLogged,(req, res) => {
		res.render('admin/index', {user : req.user});
	});

	app.get('/dashboard/admin/materi',isNotLogged, materi.getMateri);
	app.post('/dashboard/admin/materi/add',isNotLogged, materi.postAddMateri);
	app.post('/dashboard/admin/materi/update/:id_materi',isNotLogged, materi.postEdit);
	app.get('/dashboard/admin/materi/hapus/:id_materi',isNotLogged, materi.deleteMateri);
	app.get('/dashboard/admin/pengajar', isNotLogged,pengajar.getPengajar);
	app.get('/dashboard/admin/pengajar/vertifikasi/:id_pengajar', isNotLogged,pengajar.getVertifikasi);
	app.post('/dashboard/admin/pengajar/vertifikasi/:id_pengajar', isNotLogged,pengajar.postVertifikasi);
	app.get('/dashboard/admin/pengajar/log/:id_pengajar', isNotLogged,log.getLog);
	app.get('/dashboard/admin/logout',(req, res) =>{
		req.logout();
		res.redirect('/login/admin');
	});
	function isLoggedIn(req,res,next){
	    if(req.isAuthenticated())
	      res.redirect('/dashboard/admin');

	      return next();
	   }
	 function isNotLogged(req,res,next){
	    if(req.isAuthenticated())
	      return next();

	      res.redirect('/login/admin');
	  }
};