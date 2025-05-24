const { buscarRespuesta } = require('../nlp/similarity');
const { RESPUESTA_GENERICA } = require('../config/defaults');
const { logUnrecognized } = require('../nlp/logger');
const { getWelcomeMessage, getWelcomeImage } = require('../utils/image');
const fs = require('fs');
const path = require('path');

const bienvenidaPath = path.join(__dirname, '../../logs/bienvenida_enviada.json');
let bienvenidaEnviada = [];

// Cargar la lista de usuarios a los que ya se les envió la bienvenida
if (fs.existsSync(bienvenidaPath)) {
  try {
    bienvenidaEnviada = JSON.parse(fs.readFileSync(bienvenidaPath, 'utf8'));
  } catch (e) {
    bienvenidaEnviada = [];
  }
}

function guardarBienvenida() {
  fs.writeFileSync(bienvenidaPath, JSON.stringify(bienvenidaEnviada, null, 2), 'utf8');
}

function handleQR(qr) {
  const qrcode = require('qrcode-terminal');
  qrcode.generate(qr, { small: true });
}

function handleReady(client) {
  console.log(' Cliente listo');
}

async function handleMessage(client, message) {
  // Solo responder a mensajes de chat privado
  if (!message.from.endsWith('@c.us')) {
    return;
  }
  console.log('📩 Mensaje recibido:', message.body);
  const user = message.from;
  if (!bienvenidaEnviada.includes(user)) {
    try {
      await client.sendMessage(user, getWelcomeMessage());
      const image = getWelcomeImage();
      if (image) {
        await client.sendMessage(user, image);
      }
      bienvenidaEnviada.push(user);
      guardarBienvenida();
      console.log(`✅ Mensaje de bienvenida enviado a ${user}`);
      return; // No procesar ni loggear el primer mensaje
    } catch (err) {
      console.error(`❌ Error enviando bienvenida a ${user}:`, err.message);
      // Si falla la bienvenida, aún así procesar el mensaje normalmente
    }
  }
  const respuesta = buscarRespuesta(message.body);
  if (respuesta === null) {
    client.sendMessage(user, RESPUESTA_GENERICA);
    logUnrecognized(message.body);
  } else {
    client.sendMessage(user, respuesta);
  }
}

module.exports = { handleQR, handleReady, handleMessage };
