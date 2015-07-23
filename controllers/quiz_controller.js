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
			res.render('quizes/index.ejs', {quizes: quizes, errors:[]});
		}
	);
};

exports.show = function (req, res) {
	res.render('quizes/show',{quiz: req.quiz, errors:[]});
};

exports.answer   = function (req,res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta)	
		resultado = 'Correcto';	
	res.render('quizes/answer',{quiz:req.quiz,
								respuesta:resultado,
								errors:[]
							   });
}


exports.new = function (req, res) {
	var quiz = models.Quiz.build ({pregunta: "Pregunta", respuesta: "Respuesta", categoria: "Categoria"});
	res.render ('quizes/new', {quiz:quiz, errors:[]});
};

// POST /quizes/create
exports.create = function (req, res) {
	var quiz = models.Quiz.build ( req.body.quiz);
	//guarda en db los campos pregunta y respuesta de quiz

	quiz
	.validate()
	.then( function(err){
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			quiz
			.save({fields: ["pregunta","respuesta","categoria"]})
			.then(function(){
				res.redirect('/quizes');
			})// redireccion http (url relativo) lista preguntas			
		}
	});
};

exports.edit = function(req,res) {
	var quiz = req.quiz; //autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//put /quizes/:id
exports.update = function (req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz
  .validate()
  .then(
  	function(err) {
  		if (err) {
  			res.render('quizes/edit',{quiz: req.quiz, errors: err.errors});
  		} else {
  			req.quiz //save: guarda campos pregunta y respuesta en db
  			.save( {fields: ["pregunta","respuesta","categoria"]})
  			.then( function(){res.redirect('/quizes');});
  		}
  	}
  );
};

// DELETE /quizes/:id
exports.destroy = function(req,res) {
	req.quiz
	.destroy()
		.then( function() {
			res.redirect('/quizes');
		})
		.catch( function(error) {next(error)} ) ;
};