(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswAgendaRandomizerReglas'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswAgendaRandomizerReglas'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  const reglas = {
    "Trackeo de números de conducta/agenda": [{ porcion: 500 }],
    "Trackeo de conceptos/relaciones": [{ porcion: 500 }],
    "Trackeo de ideas/notas": [{ porcion: 1 }],
    "Programación de interfaces gráficas": [{ porcion: 500 }],
    "Arquitectura por patrones": [{ porcion: 200 }],
    "Arquitectura de la realidad": [{ porcion: 200 }],
    "Arquitectura del yo": [{ porcion: 200 }],
    "Lenguajes formales": [{ porcion: 1 }],
    "Investigación de cocina/nutrición/química": [{ porcion: 200 }],
    "Investigación de nutrición": [{ porcion: 1 }],
    "Investigación de química": [{ porcion: 1 }],
    "Investigación de física": [{ porcion: 1 }],
    "Investigación de matemáticas": [{ porcion: 1 }],
    "Investigación de geometría": [{ porcion: 1 }],
    "Investigación de canvas/perspectiva": [{ porcion: 1 }],
    "Investigación de medicina/biología/fisiología": [{ porcion: 100 }],
    "Investigación de musculación/flexibilidad": [{ porcion: 100 }],
    "Investigación de las emociones": [{ porcion: 100 }],
    "Cocinar/Comer": [{ cada: "6h", minimo: "1h" }],
    "Pasarlo bien con la perrillo": [{ cada: "6h", minimo: "1h" }],
    "Cuidados de plantas": [{ porcion: 1 }],
    "Cuidados del hogar": [{ porcion: 1 }],
    "Actividad física": [{ porcion: 500 }, { nunca_despues_de: "comer", durante: "2h" }, { cada: "24h", minimo: "20min" }],
    "Optimización de RAM": [{ porcion: 500 }],
    "Autocontrol/Autobservación/Autoanálisis": [{ porcion: 500 }],
    "Meditación/Relajación": [{ porcion: 500 }],
    "Paisajismo": [{ cada: "3h", minimo: "20min" }],
    "Dibujo 3D/Perspectiva/Geometría/Mates": [{ porcion: 1 }],
    "Dibujo artístico/anime/abstracto/esquemista/conceptualista": [{ porcion: 1 }],
    "Reflexión/Diálogo interno": [{ porcion: 500 }],
  };

  return reglas;

});