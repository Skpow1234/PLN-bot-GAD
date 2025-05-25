const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');

function getWelcomeMessage() {
  return "¡Bienvenido a la Universidad de San Buenaventura Cali! ¿En qué podemos ayudarte hoy?";
}

function getWelcomeImage() {
  // Ruta absoluta a la imagen local
  const imagePath = path.join(__dirname, 'logo-usb-cali.png');
  return MessageMedia.fromFilePath(imagePath);
}

module.exports = { getWelcomeMessage, getWelcomeImage };
