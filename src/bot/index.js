const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage, handleReady, handleQR } = require('./handlers');

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', qr => handleQR(qr));
client.on('ready', () => handleReady(client));
client.on('message', message => handleMessage(client, message));

client.initialize();
