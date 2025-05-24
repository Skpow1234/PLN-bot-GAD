const stringSimilarity = require('string-similarity');
const { getCorpus } = require('./corpus');

function buscarRespuesta(inputUsuario) {
  const corpus = getCorpus();
  const preguntas = corpus.map(item => item.pregunta);
  const matches = stringSimilarity.findBestMatch(inputUsuario, preguntas);
  if (matches.bestMatch.rating < 0.5) return null;
  const mejor = corpus[matches.bestMatchIndex];
  return mejor.respuesta;
}

module.exports = { buscarRespuesta };
