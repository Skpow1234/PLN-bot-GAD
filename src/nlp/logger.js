const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '../../logs/unrecognized.log');

function logUnrecognized(question) {
  const entry = `[${new Date().toISOString()}] ${question}\n`;
  fs.appendFileSync(logPath, entry, 'utf8');
}

module.exports = { logUnrecognized };
