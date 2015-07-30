var users = 
	{
		admin: {id:1, username:"admin", password:"1234"},
		gallego: {id:2, username:"gallego", password:"5678"}
	};


//comprueba si el susuario esta registrado en users
// si autenticacion falla o hay errores se ejecuta callback(error);

exports.autenticar = function (login, password, callback) {
	if (users[login]) {
		if(password === users[login].password) {
			console.log('autenticado');
			callback(null, users[login]);
		}
		else {
			callback(new Error('Password erróneo'));
		}
	} else {
		callback(new Error('No existe el usuario'));
	};
};