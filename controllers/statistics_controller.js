//  Adaptación de la solución de Miguel Ángel Santamaría Rogado publicada en el foro.

var models = require('../models/models.js');

var statistics = {
      numQuizes: 0,
      numComments: 0,
      numNoCommentedQuizes: 0,
      numCommentedQuizes: 0
};
var errors = [];

// Obtención de datos y cálculo de las estadisticas
exports.obtenerData = function(req, res, next) {
  var preguntas = models.Quiz.count();
  var numComments = models.Comment.count();
  var numNoCommentedQuizes = models.Comment.numNoCommentedQuizes();
  var numCommentedQuizes = models.Comment.numCommentedQuizes();
   models.Quiz.count().then(function (numQuizes) { // número de preguntas
        statistics.numQuizes = numQuizes;
        return numComments;
   })
   .then(function (numComments) { // número de comentarios
       statistics.numComments = numComments;
       return numNoCommentedQuizes;
    })
    .then(function (numNoCommentedQuizes) { // número preguntas sin comentario
        statistics.numNoCommentedQuizes = numNoCommentedQuizes;
        return numCommentedQuizes;
    })
    .then(function (numCommentedQuizes) { // número de preguntas con comentario
      statistics.numCommentedQuizes = numCommentedQuizes;
    })
    .catch(function (err) { errors.push(err); })
    .finally(function () {
      next();
    });

  };

// GET /statistics
exports.show = function(req, res) {
  res.render('statistics', { statistics: statistics, errors: errors });
};
