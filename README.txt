REENCUENTRO CON IA REAL — GUÍA RÁPIDA

Contenido:
- public/index.html: tu página Reencuentro con el chat conectado al backend.
- server.js: servidor que consulta la API de OpenAI y mantiene la clave protegida.
- .env.example: plantilla de configuración (NO contiene una clave real).

PARA PROBAR EN TU COMPUTADORA
1. Instala Node.js (versión LTS) desde https://nodejs.org/
2. Descomprime esta carpeta.
3. Abre una terminal dentro de la carpeta Reencuentro_IA.
4. Ejecuta: npm install
5. Copia .env.example y crea un archivo llamado .env en la misma carpeta.
6. Dentro de .env, reemplaza el texto de OPENAI_API_KEY por tu clave secreta.
7. Ejecuta: npm start
8. Abre http://localhost:3000

IMPORTANTE PARA PUBLICAR
No basta con subir public/index.html a Netlify Drop: la IA necesita que también publiques el servidor (por ejemplo, en Render) y configures OPENAI_API_KEY como variable secreta del servicio. Luego se configura el frontend para llamar a la URL pública del servidor. El proyecto preparado aquí usa /api/chat en el mismo dominio; para despliegues separados hay que ajustar la URL y CORS.

SEGURIDAD Y USO RESPONSABLE
- Nunca pongas tu API key en index.html ni la compartas por chat.
- La API puede generar cargos según el uso y los precios vigentes de OpenAI.
- El asistente brinda información general; no diagnostica ni sustituye atención psicológica.
- No uses el chat para emergencias. En Perú, la Línea 113 opción 5 brinda orientación en salud mental; ante peligro inmediato, acude a emergencias.
