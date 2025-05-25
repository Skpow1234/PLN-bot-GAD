# Proyecto Bot PLN

## Requisitos

- Node.js 18.x

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

## Estructura

- `src/nlp/corpus.json`: Preguntas y respuestas frecuentes.
- `src/config/users.js`: Lista de usuarios para mensajes de bienvenida.
- `logs/unrecognized.log`: Consultas no reconocidas.

## Personalización

- Agrega tus preguntas y respuestas en `src/nlp/corpus.json`.
- Cambia el mensaje y la imagen de bienvenida en `src/utils/image.js`.

---

## Arquitectura física-técnica

```bash
┌────────────┐        ┌──────────────┐        ┌──────────────┐
│  Usuario   │◀─────▶│ WhatsApp Web │◀─────▶│   Bot PLN    │
└────────────┘        └──────────────┘        └──────────────┘
                                            │
                                            ▼
                                 ┌────────────────────┐
                                 │  Procesamiento NLP │
                                 └────────────────────┘
                                            │
                                            ▼
                                 ┌────────────────────┐
                                 │   Logs/Corpus      │
                                 └────────────────────┘
```

- El bot se conecta a WhatsApp Web usando `whatsapp-web.js` y Puppeteer.
- El usuario interactúa con el bot a través de WhatsApp.
- El bot procesa los mensajes usando técnicas de PLN (similitud semántica, corpus).
- Las preguntas no reconocidas se almacenan en logs para mejorar el sistema.
- El corpus de preguntas/respuestas es fácilmente editable y escalable.

## ¿Cómo funciona el bot?

1. **Inicio automático:**
   - Al iniciar, el bot puede enviar un mensaje de bienvenida y una imagen promocional a una lista predefinida de usuarios (ver limitaciones más abajo).

2. **Recepción y respuesta:**
   - El bot recibe mensajes de los usuarios y analiza la intención usando similitud semántica (`string-similarity`).
   - Busca la pregunta más parecida en el corpus y responde con la respuesta asociada.
   - Si la pregunta no se reconoce (baja similitud), responde con un mensaje genérico y registra la consulta en un log.

3. **Gestión de múltiples usuarios:**
   - El bot puede interactuar con varios usuarios a la vez, manteniendo la coherencia de cada conversación.

4. **Escalabilidad y mantenimiento:**
   - El corpus está en un archivo JSON, fácil de editar y ampliar.
   - Los logs permiten mejorar el sistema agregando nuevas preguntas frecuentes.

---

## Limitaciones de WhatsApp para mensajes automáticos a usuarios

WhatsApp impone restricciones para el envío de mensajes automáticos a usuarios a través de bots como whatsapp-web.js:

- **Solo puedes enviar mensajes automáticos a usuarios que ya hayan iniciado una conversación con el bot** (es decir, que hayan enviado al menos un mensaje al número del bot).
- Si intentas enviar un mensaje a un número que nunca ha escrito al bot, WhatsApp-web.js mostrará un error de "invalid wid" y el mensaje no se enviará.
- Esta es una política de WhatsApp para evitar el spam y proteger la privacidad de los usuarios.

### ¿Cómo cumplir el requerimiento de bienvenida automática?

- Si los usuarios de la lista predefinida ya han escrito al bot al menos una vez, el bot puede enviarles el mensaje de bienvenida y la imagen automáticamente al iniciar.
- Si los usuarios nunca han escrito al bot, **no es posible** enviarles mensajes automáticos por limitación de WhatsApp. En este caso, se recomienda pedirles que envíen un primer mensaje al bot (por ejemplo, "Hola"), y a partir de ahí ya podrán recibir mensajes automáticos en el futuro.

**Referencia:** [https://wwebjs.dev/guide/creating-your-bot/handling-attachments.html#sending-media](https://wwebjs.dev/guide/creating-your-bot/handling-attachments.html#sending-media)

---

## ¿Cómo funciona la similitud semántica?

El bot utiliza la librería [`string-similarity`](https://www.npmjs.com/package/string-similarity) para comparar el mensaje recibido con todas las preguntas del corpus. El proceso es el siguiente:

1. **Recepción del mensaje:** Cuando el usuario envía un mensaje, el bot toma el texto y lo compara con cada pregunta almacenada en el corpus.
2. **Cálculo de similitud:** Se calcula un puntaje de similitud (entre 0 y 1) entre el mensaje del usuario y cada pregunta del corpus usando el algoritmo de comparación de cadenas de `string-similarity`.
3. **Selección de la mejor coincidencia:** El bot selecciona la pregunta del corpus con el puntaje de similitud más alto.
4. **Umbral de reconocimiento:** Si el puntaje de similitud supera un umbral (por ejemplo, 0.5), el bot responde con la respuesta asociada a esa pregunta. Si no, responde con un mensaje genérico indicando que no entendió la consulta.

Esto permite que el bot sea flexible ante variaciones en la redacción de las preguntas y pueda identificar la intención del usuario de manera eficiente.

---

## Frontend web para escanear el QR

Ahora el proyecto incluye un pequeño frontend web para mostrar el código QR de WhatsApp en el navegador.

- Cuando inicies el bot, abre [http://localhost:3000](http://localhost:3000) en tu navegador.
- Verás el QR actualizado en tiempo real para escanearlo con tu app de WhatsApp.
- El frontend está en `src/web/index.html` y se sirve automáticamente con Express.

---
