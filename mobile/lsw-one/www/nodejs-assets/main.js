// main.js (se ejecuta dentro del runtime Node.js embebido)
const { channel } = require("nodejs-mobile-react-native");

// Envía un mensaje inicial a la app Cordova
channel.send("Hola desde Node.js embebido!");

// Escucha mensajes desde la app Cordova
channel.setListener((msg) => {
  console.log("Node.js recibió:", msg);
  
  // Podés responder
  channel.send(`Respuesta a: ${msg}`);
});
