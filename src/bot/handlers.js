const { buscarRespuesta } = require('../nlp/similarity');
const { RESPUESTA_GENERICA } = require('../config/defaults');
const { logUnrecognized } = require('../nlp/logger');
const { getWelcomeMessage, getWelcomeImage } = require('../utils/image');
const fs = require('fs');
const path = require('path');

const bienvenidaPath = path.join(__dirname, '../../logs/bienvenida_enviada.json');
let bienvenidaEnviada = [];

// Contexto conversacional en memoria
const contextoUsuarios = {};

// Guardar la última vez que se envió la bienvenida a cada usuario (en memoria)
const bienvenidaTimestampsPath = path.join(__dirname, '../../logs/bienvenida_timestamps.json');
let bienvenidaTimestamps = {};
const BIENVENIDA_TIMEOUT_MS = 60 * 60 * 1000; // 1 hora

const conversacionesLogPath = path.join(__dirname, '../../logs/conversaciones.log');
function logConversacion(evento) {
  fs.appendFileSync(conversacionesLogPath, JSON.stringify(evento) + '\n', 'utf8');
}

// Cargar la lista de usuarios a los que ya se les envió la bienvenida
if (fs.existsSync(bienvenidaPath)) {
  try {
    bienvenidaEnviada = JSON.parse(fs.readFileSync(bienvenidaPath, 'utf8'));
  } catch (e) {
    bienvenidaEnviada = [];
  }
}

// Cargar los timestamps persistidos
if (fs.existsSync(bienvenidaTimestampsPath)) {
  try {
    bienvenidaTimestamps = JSON.parse(fs.readFileSync(bienvenidaTimestampsPath, 'utf8'));
  } catch (e) {
    bienvenidaTimestamps = {};
  }
}

console.log('DEBUG: Cargando bienvenidaEnviada:', bienvenidaEnviada);

function guardarBienvenida() {
  fs.writeFileSync(bienvenidaPath, JSON.stringify(bienvenidaEnviada, null, 2), 'utf8');
}

function guardarBienvenidaTimestamps() {
  fs.writeFileSync(bienvenidaTimestampsPath, JSON.stringify(bienvenidaTimestamps, null, 2), 'utf8');
}

function handleQR(qr) {
  const qrcode = require('qrcode-terminal');
  qrcode.generate(qr, { small: true });
}

function handleReady(client) {
  console.log('✅ Cliente listo');
}

async function handleMessage(client, message) {
  // Solo responder a mensajes de chat privado
  if (!message.from.endsWith('@c.us')) {
    return;
  }
  console.log('📩 Mensaje recibido:', message.body);
  const user = message.from;
  const now = Date.now();
  const lastBienvenida = bienvenidaTimestamps[user] || 0;
  console.log('DEBUG: Usuario actual:', user);
  console.log('DEBUG: Última bienvenida:', new Date(lastBienvenida).toISOString());
  let nombre = null;
  if (contextoUsuarios[user] && contextoUsuarios[user].nombre) {
    nombre = contextoUsuarios[user].nombre;
  } else if (message._data && message._data.notifyName) {
    nombre = message._data.notifyName;
  }
  // Log de mensaje recibido
  logConversacion({ tipo: 'mensaje_recibido', usuario: user, mensaje: message.body, timestamp: new Date().toISOString() });
  if (now - lastBienvenida > BIENVENIDA_TIMEOUT_MS) {
    try {
      await client.sendMessage(user, getWelcomeMessage(nombre));
      const image = getWelcomeImage();
      if (image) {
        await client.sendMessage(user, image);
      }
      bienvenidaTimestamps[user] = now;
      guardarBienvenidaTimestamps();
      logConversacion({ tipo: 'bienvenida', usuario: user, mensaje: getWelcomeMessage(nombre), timestamp: new Date().toISOString() });
      console.log(`✅ Mensaje de bienvenida enviado a ${user}`);
      return; // No procesar ni loggear el primer mensaje
    } catch (err) {
      console.error(`❌ Error enviando bienvenida a ${user}:`, err.message);
      // Si falla la bienvenida, aún así procesar el mensaje normalmente
    }
  }

  // Manejo de contexto: pedir nombre si el usuario quiere inscribirse
  if (contextoUsuarios[user] && contextoUsuarios[user].estado === 'esperando_nombre') {
    contextoUsuarios[user].nombre = message.body.trim();
    await client.sendMessage(user, `¡Gracias, ${contextoUsuarios[user].nombre}! Hemos registrado tu nombre para el proceso de inscripción.`);
    logConversacion({ tipo: 'respuesta', usuario: user, mensaje: `¡Gracias, ${contextoUsuarios[user].nombre}! Hemos registrado tu nombre para el proceso de inscripción.`, timestamp: new Date().toISOString() });
    delete contextoUsuarios[user]; // Vuelve al flujo normal
    return;
  }

  // Detectar intención de inscripción
  if (/quiero inscribirme|inscribirme|inscripción/i.test(message.body)) {
    contextoUsuarios[user] = { estado: 'esperando_nombre' };
    await client.sendMessage(user, '¡Perfecto! ¿Cuál es tu nombre completo?');
    logConversacion({ tipo: 'respuesta', usuario: user, mensaje: '¡Perfecto! ¿Cuál es tu nombre completo?', timestamp: new Date().toISOString() });
    return;
  }

  const respuesta = buscarRespuesta(message.body);
  if (respuesta === null) {
    client.sendMessage(user, RESPUESTA_GENERICA);
    logConversacion({ tipo: 'respuesta', usuario: user, mensaje: RESPUESTA_GENERICA, timestamp: new Date().toISOString() });
    logUnrecognized(message.body);
  } else {
    client.sendMessage(user, respuesta);
    logConversacion({ tipo: 'respuesta', usuario: user, mensaje: respuesta, timestamp: new Date().toISOString() });
  }
}

module.exports = { handleQR, handleReady, handleMessage };
