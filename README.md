# Proyecto Bot PLN

## Requisitos

- Node.js 18.x
- Docker (opcional para despliegue)

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
   - Al iniciar, el bot envía un mensaje de bienvenida y una imagen promocional a una lista predefinida de usuarios.

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

## Docker

Próximamente instrucciones para Docker.
