const materi = require('../controller/materi.admin');

module.exports = function(app,passport){
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
	app.get('/logout',(req, res) =>{
		req.logout();
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