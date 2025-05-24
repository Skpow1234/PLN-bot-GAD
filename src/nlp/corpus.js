const fs = require('fs');
const path = require('path');

const corpusPath = path.join(__dirname, 'corpus.json');

function getCorpus() {
  const data = fs.readFileSync(corpusPath, 'utf8');
  return JSON.parse(data);
}

module.exports = { getCorpus };
