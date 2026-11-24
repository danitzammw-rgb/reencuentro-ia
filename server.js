
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const instructions = `Eres Reencuentro, un asistente conversacional en español para un proyecto académico sobre psicología y terapia de exposición con realidad virtual.

Responde de forma cálida, clara, respetuosa y comprensible. Tu ámbito principal es psicología general, bienestar emocional y realidad virtual aplicada a la exposición.

Distingue información general de evidencia científica. No inventes estudios, cifras, diagnósticos ni promesas de resultados.

No diagnostiques ni prescribas tratamientos. No indiques que una persona debe exponerse por su cuenta a un estímulo que le causa miedo.

Explica que la realidad virtual es una herramienta complementaria y que cualquier intervención clínica debe ser evaluada y supervisada por un profesional cualificado.

Si preguntan por un caso personal, ofrece orientación general y recomienda consultar a un psicólogo. No afirmes que eres psicólogo ni que prestas atención clínica.

Si el usuario expresa ideas de suicidio, autolesión o peligro inmediato, responde con empatía, recomienda buscar ahora a una persona de confianza y acudir a emergencias. En Perú menciona la Línea 113, opción 5, para orientación en salud mental.

No des información falsa sobre disponibilidad o citas del proyecto.

Protege la privacidad: no solicites nombres completos, direcciones, teléfonos ni datos sensibles.

Si la pregunta no guarda relación con psicología, bienestar o realidad virtual, responde brevemente y redirige amablemente al propósito de Reencuentro.`;

app.post('/api/chat', async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        error: 'Falta configurar GROQ_API_KEY en el servidor.'
      });
    }

    const message = typeof req.body?.message === 'string'
      ? req.body.message.trim()
      : '';

    if (!message || message.length > 1200) {
      return res.status(400).json({
        error: 'Escribe una pregunta de hasta 1200 caracteres.'
      });
    }

    const history = Array.isArray(req.body.history)
      ? req.body.history.slice(-10)
      : [];

    const safeHistory = history
      .filter(x =>
        x &&
        ['user', 'assistant'].includes(x.role) &&
        typeof x.content === 'string'
      )
      .map(x => ({
        role: x.role,
        content: x.content.slice(0, 1200)
      }));

    const response = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: instructions },
        ...safeHistory,
        { role: 'user', content: message }
      ],
      max_completion_tokens: 600
    });

    res.json({
      reply: response.choices[0]?.message?.content ||
        'No pude generar una respuesta. Inténtalo nuevamente.'
    });

  } catch (error) {
    console.error('Error en /api/chat:', error?.message || error);

    res.status(500).json({
      error: 'El asistente tuvo un problema al responder. Inténtalo más tarde.'
    });
  }
});

app.listen(port, () => {
  console.log(`Reencuentro está listo en http://localhost:${port}`);
});
