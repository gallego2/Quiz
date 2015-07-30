var path = require('path');

//Configuracion bd dev o pro
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);

var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//cargar modelo ORM
var Sequelize = require('sequelize');

//usar bbdd sqlite
var sequelize = new Sequelize (DB_name,user,pwd,
							  {
							  	dialect:protocol, 
							  	protocol:protocol,
							  	port:port,
							  	host: host,
							  	storage:storage, //soloo sqlite (.env)
							  	omitNull:true //solo postgres
							  }
							  );

//importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
var Comment = sequelize.import(path.join(__dirname,'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;//exportar la definición de la tabla Quiz
exports.Comment = Comment;

//crea e inicializa tabla de preguntas en DB
sequelize.sync().then
(
	function () 
	{
		Quiz.count().then
		(
			function (count) 
			{
				console.log('Count = ' + count);
				if (count === 0) 
				{ //la tabla se inicializa solo si está vacía
					Quiz.create({pregunta:'Capital de Italia',respuesta:'Roma'});
					Quiz.create({pregunta:'Capital de Portugal',respuesta:'Lisboa'});
					Quiz.create({pregunta:'Capital de Francia',respuesta:'Paris'})
					.then(function(){console.log('Base de datos inicializada')});
				};
			}
		);
	}
);
