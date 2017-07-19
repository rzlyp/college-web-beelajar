const pengajar = require('../controller/pengajar');
const keahlian = require('../controller/keahlian.pengajar');
const lokasi = require('../controller/lokasi.pengajar');
const vertifikasi = require('../controller/vertifikasi.pengajar');
const jadwal = require('../controller/jadwal.pengajar');

module.exports = function(app,passport){
	app.get('/signup',pengajar.getRegister);
	app.post('/pengajar/signup',pengajar.postRegister);

	app.get('/pengajar/login',isLoggedIn,(req, res) => {
		res.render('pengajar/login');
	});
	app.post('/pengajar/login',isLoggedIn,passport.authenticate('local-pengajar',{
		successRedirect : '/pengajar/dashboard',
		failureRedirect : '/pengajar/login',
		failureFlash : true
	}));
	app.post('/pengajar/profile/update',isNotLogged, pengajar.updateProfile);
	app.get('/pengajar/profile',isNotLogged, pengajar.getProfile);
	app.get('/pengajar/dashboard',isNotLogged,pengajar.dashboard);
	app.post('/pengajar/keahlian/add',isNotLogged,keahlian.addKeahlian);
	app.post('/pengajar/keahlian/:id_pengajar_materi',isNotLogged,keahlian.removeKeahlian);
	app.post('/pengajar/lokasi/add',isNotLogged, lokasi.addLokasi);
	app.post('/pengajar/lokasi/edit/:id_tempat',isNotLogged, lokasi.ubahLokasi);
	app.get('/pengajar/vertifikasi',isNotLogged,vertifikasi.vertifikasi);
	app.post('/pengajar/vertifikasi',isNotLogged,vertifikasi.postVertifikasi);
	app.get('/pengajar/jadwal',isNotLogged,jadwal.getJadwal);
	app.post('/pengajar/jadwal/add',isNotLogged,jadwal.postAddJadwal);
	app.post('/pengajar/jadwal/edit/:id_jadwal',isNotLogged,jadwal.postEditJadwal);
	app.post('/pengajar/jadwal/hapus/:id_jadwal',isNotLogged,jadwal.removeJadwal);
	app.post('/pengajar/tarif',isNotLogged, pengajar.updateTarif);
	app.get('/pengajar/logout',(req, res) =>{
		req.logout();
		res.redirect('/pengajar/login')
	});

	function isLoggedIn(req,res,next){
	    if(req.isAuthenticated())
	      res.redirect('/pengajar/dashboard');

	      return next();
	   }
	 function isNotLogged(req,res,next){
	    if(req.isAuthenticated())
	      return next();

	      res.redirect('/pengajar/login');
	  }
};