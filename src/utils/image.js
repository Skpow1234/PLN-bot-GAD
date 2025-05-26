const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');

function getWelcomeMessage(nombre = null) {
  if (nombre) {
    return `¡Hola, ${nombre}! 👋\n\nBienvenido a la Universidad de San Buenaventura Cali. Descubre nuestros programas, servicios y oportunidades. ¿Te gustaría conocer nuestras promociones o inscribirte? ¡Responde a este mensaje y te ayudamos!`;
  }
  return "¡Hola! 👋\n\nBienvenido a la Universidad de San Buenaventura Cali. Descubre nuestros programas, servicios y oportunidades. ¿Te gustaría conocer nuestras promociones o inscribirte? ¡Responde a este mensaje y te ayudamos!";
}

function getWelcomeImage() {
  // Ruta absoluta a la imagen local
  const imagePath = path.join(__dirname, 'logo-usb-cali.png');
  return MessageMedia.fromFilePath(imagePath);
}

module.exports = { getWelcomeMessage, getWelcomeImage };
