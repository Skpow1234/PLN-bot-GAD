const users = require('../config/users');
const { getWelcomeMessage, getWelcomeImage } = require('../utils/image');

async function sendWelcomeMessages(client) {
  const message = getWelcomeMessage();
  const image = getWelcomeImage();
  for (const user of users) {
    try {
      await client.sendMessage(user, message);
      if (image) {
        await client.sendMessage(user, image);
      }
      console.log(`✅ Mensaje de bienvenida enviado a ${user}`);
    } catch (err) {
      console.error(`❌ Error enviando mensaje a ${user}:`, err.message);
    }
  }
}

module.exports = { sendWelcomeMessages };
