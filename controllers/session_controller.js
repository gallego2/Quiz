//get /login --formulario de login

exports.new = function (req,res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors:errors});
};


//post /login   -crear las sesion
exports.create = function(req,res) {
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');

	userController.autenticar(login, password, function(error, user) {
		if (error) { //si hay error retornamos mensajes de error de session
			req.session.errors = [{"message":'Se ha producido un error:' + error}];
			res.redirect('/login');
			return;
		}

		//crear req.session.user y guardar campos id y username
		// la sessión se define por la existencia de: req.session.user
		req.session.user = {id:user.id, username:user.username};
		console.log('req.session.redir.toString()='+req.session.redir.toString());
		//console.log();

		res.redirect(req.session.redir.toString());//redireccioó a path anterior a login

	});
};

//delete /logout --destruir session
exports.destroy = function(req,res) {
	delete req.session.user;
	console.log('req.session.redir.toString()='+req.session.redir.toString());
	res.redirect(req.session.redir.toString());//
};