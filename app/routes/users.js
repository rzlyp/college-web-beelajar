const pengajar = require('../controller/pengajar');
const keahlian = require('../controller/keahlian.pengajar');
const lokasi = require('../controller/lokasi.pengajar');
const vertifikasi = require('../controller/vertifikasi.pengajar');

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
	app.use(isNotLogged);
	app.get('/pengajar/dashboard',pengajar.dashboard);
	app.post('/pengajar/keahlian/add',keahlian.addKeahlian);
	app.post('/pengajar/lokasi/add', lokasi.addLokasi);
	app.get('/pengajar/vertifikasi',vertifikasi.vertifikasi);
	app.post('/pengajar/vertifikasi',vertifikasi.postVertifikasi);
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