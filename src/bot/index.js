const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage, handleReady, handleQR } = require('./handlers');

// --- Express y Socket.IO ---
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir el frontend desde src/web
app.use(express.static(path.join(__dirname, '../web')));

// --- WhatsApp Client ---
const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Emitir QR por Socket.IO y también por terminal
client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  io.emit('qr', qr);
});
client.on('ready', () => handleReady(client));
client.on('message', message => handleMessage(client, message));

client.initialize();

// Iniciar servidor web
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Frontend QR disponible en http://localhost:${PORT}`);
});
