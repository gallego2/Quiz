var models = require('../models/models.js');




//Autoload - factoriza el código si ruta incluye: quizId

exports.load = function (req, res, next, quizId) 
{
	console.log('load:'+ quizId);

	models.Quiz.findById(quizId).then 
	(   function (quiz) 
	 	{
	 		if (quiz) 
	 		{
	 			req.quiz = quiz;
	 			next();
	 		} else
	 		{
	 			next(new Error('No existe quizId=' + quizId));
	 		}
	 	}
	).catch
	(
		function (error)
		{
			next(error);
		}
	);
};

exports.index = function(req,res)
{
	var opciones = {};
	console.log('index');
	console.log(req.query.search);
	if (req.query.search)
	  opciones = {where: ["pregunta like ?", '%' + req.query.search.replace('+','%') +'%']}

	models.Quiz.findAll(opciones)
	.then
	(
		function (quizes)
		{
			res.render('quizes/index.ejs', {quizes: quizes});
		}
	);
};

exports.show = function (req, res) {
	res.render('quizes/show',{quiz: req.quiz});
};

exports.answer   = function (req,res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta)	
		resultado = 'Correcto';	
	res.render('quizes/answer',{quiz:req.quiz,respuesta:resultado});
}


exports.new = function (req, res) {
	var quiz = models.Quiz.build ({pregunta: "Pregunta", respuesta: "Respuesta"});
	res.render ('quizes/new', {quiz:quiz});
};

// POST /quizes/create
exports.create = function (req, res) {
	var quiz = models.Quiz.build ( req.body.quiz);
	//guarda en db los campos pregunta y respuesta de quiz
	quiz.save({fields: ["pregunta","respuesta"]}).then(function(){
		res.redirect('/quizes');
	})// redireccion http (url relativo) lista preguntas
};