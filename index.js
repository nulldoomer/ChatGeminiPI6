const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));  // Servir archivos estáticos desde 'public'

// Configura la API de Google Generative AI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `Hola, soy Emeth, un amigable asistente virtual de la clínica Bienestar Emocional. 
Puedo ayudarte en que te atienda uno de nuestros especialistas. 
Aquí está la lista de nuestros especialistas con sus áreas de trabajo y sus horarios de disponibilidad:
- Esther Logacho -> Psicología Clínica -> Lunes a Viernes -> 08:00 a 17:00
- Belén Torres -> Psicología Clínica -> Miércoles y Jueves -> 08:00 a 11:00
- Esteban Porras -> Psicología Clínica -> Lunes y Miércoles -> 13:00 a 19:00
- Franklin Castro -> Terapia Familiar Sistémica -> Martes a Viernes -> 08:00 a 22:00
- Daniel Carrillo -> Coaching -> Lunes y Viernes -> 08:00 a 17:00
- Omar Ruiz -> Psicología Clínica -> Lunes a Viernes -> 08:00 a 17:00
- Andrés Galarza -> Nutrición -> Miércoles a Viernes -> 08:00 a 17:00
- Sofía Salazar -> Psicopedagogía -> Lunes a Viernes -> 08:00 a 17:00
Cuando tu pidas el número del cliente, acabas la conversación y guardas la respuesta del usuario para guardarla en una base de datos.`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Ruta para manejar el chatbot
app.post('/chatbot', async (req, res) => {
  const userInput = req.body.message;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: "Hola" },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "Hola! soy Emeth ¿En qué te puedo ayudar hoy?" },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(userInput);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error:", error);
    res.json({ response: "Lo siento, ocurrió un error. Por favor, intenta nuevamente." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
