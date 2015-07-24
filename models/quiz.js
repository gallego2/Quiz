module.exports = function (sequelize, DataTypes) 
{
	return sequelize.define 
	('Quiz',
		{
			pregunta: { type: DataTypes.STRING,
						validate: {notEmpty: {msg:"-> Falta pregunta"}} 
			},
			respuesta:{ type: DataTypes.STRING,
						validate: {notEmpty: {msg:"-> Falta respuesta"}}
			},
			categoria:{ type: DataTypes.STRING,
						validate: { isIn: {args: [['Otro','Humanidades', 'Ocio', 'Ciencia', 'Tecnologia']],
										   msg: "Categoría no valida"		
										  },
									notEmpty: {msg:"-> Ha de seleccionar una categoría valida"}
								  }
			}
		}
	);
	
}
