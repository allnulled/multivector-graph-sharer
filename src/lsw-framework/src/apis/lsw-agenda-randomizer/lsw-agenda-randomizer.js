(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswAgendaRandomizer'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswAgendaRandomizer'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  class LswAgendaRandomizer {

    static isTracing = false;

    static trace(method, args = [], extras = false) {
      if (this.isTracing) {
        console.log(`[trace] LswAgendaRandomizer.${method}: ${Array.from(args).length}`);
        console.log(`[trace] Extra parameters:`, extras);
      }
    }

    static elegirMixto(pesos, rangoDePeso = 1.0) {
      const claves = Object.keys(pesos);
      if (claves.length === 0) return null;
      
      const usarPeso = false;

      if (usarPeso) {
        // @TODO: esto no está valiendo ahora mismo.
      } else {
        // Elección uniforme entre claves
        const indice = Math.floor(Math.random() * claves.length);
        return claves[indice];
      }
    }
    

    static generar(reglas = {}, accionesPrevias = [], horaInicio = new Date(), duracionMinima = "20min", horaFinal = new Date(), tasaDePeso = 0.6) {
      this.trace("generar", arguments);
      const ahora = new Date(horaInicio);
      ahora.setSeconds(0, 0); // limpia segundos y ms
    
      const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), horaInicio.getHours(), 0, 0, 0);
      const finDelDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), horaFinal.getHours(), 59, 59, 999);
      const duracionMilisegundos = this._duracionAMilisegundos(duracionMinima);
    
      const acciones = [];
    
      let cursor = new Date(inicio);
      while (cursor <= finDelDia) {
        console.log("cursor:", LswTimer.utils.fromDateToDatestring(cursor));
        
        const concepto = this.elegirMixto(reglas, tasaDePeso);
        acciones.push({
          en_concepto: concepto,
          tiene_estado: "pendiente",
          tiene_inicio: this._formatearFecha(cursor),
          tiene_duracion: duracionMinima,
          tiene_parametros: "",
          tiene_resultados: "",
          tiene_comentarios: "",
          id: this._generarIdUnico()
        });
        cursor = new Date(cursor.getTime() + duracionMilisegundos);
      }
    
      return acciones;
    }    

    static generarComplejo(reglas = {}, accionesPrevias = [], horaActual = new Date(), duracionMinima = "10min") {
      this.trace("generarComplejo", arguments);
      $ensure({ reglas }, 1).to.be.object();
      $ensure({ accionesPrevias }, 1).to.be.array();
      $ensure({ horaActual }, 1).to.be.instanceOf(Date);
      const ahora = new Date(horaActual);
      ahora.setMinutes(0);
      const acciones = accionesPrevias.map(this._normalizarAccion.bind(this));
      const accionesPosibles = Object.keys(reglas);
      const accionesGeneradas = [];
      const finDelDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59, 999);
      let horaCursor = new Date(ahora);
      horaCursor.setMinutes(0);
      const tamanoBloqueMs = this._duracionAMilisegundos(duracionMinima);
      const totalBloques = Math.floor((finDelDia - ahora) / tamanoBloqueMs);
      const { usados, metas } = this._bloquesPorConcepto(reglas, acciones, totalBloques);

      while (horaCursor <= finDelDia) {
        const conceptosOrdenados = accionesPosibles
          .slice()
          .sort((a, b) => (metas[b] - usados[b]) - (metas[a] - usados[a]));

        let accionGenerada = false;

        for (const concepto of conceptosOrdenados) {
          const regla = reglas[concepto];
          const ultima = this._ultimaAccionDe(concepto, acciones.concat(accionesGeneradas));
          const puede = this._evaluarRegla(horaCursor, concepto, regla, ultima, acciones.concat(accionesGeneradas));

          if (puede && metas[concepto] > usados[concepto]) {
            const duracion = this._obtenerDuracionMinima(regla, duracionMinima);
            const nuevaAccion = {
              en_concepto: concepto,
              tiene_estado: "pendiente",
              tiene_inicio: this._formatearFecha(horaCursor),
              tiene_duracion: duracion,
              tiene_parametros: "",
              tiene_resultados: "",
              tiene_comentarios: "",
              id: this._generarIdUnico()
            };
            accionesGeneradas.push(nuevaAccion);
            const bloquesUsados = Math.round(this._duracionAMilisegundos(duracion) / 600000);
            usados[concepto] += bloquesUsados;
            horaCursor = this._avanzarTiempo(horaCursor, duracion);
            accionGenerada = true;
            break;
          }
        }

        if (!accionGenerada) {
          horaCursor = this._avanzarTiempo(horaCursor, "12min");
        }
      }

      return accionesGeneradas;
    }

    static _normalizarAccion(accion) {
      this.trace("_normalizarAccion", arguments);
      return {
        ...accion,
        _inicio: new Date(accion.tiene_inicio),
        _duracionMilisegundos: this._duracionAMilisegundos(accion.tiene_duracion)
      };
    }

    static _ultimaAccionDe(concepto, lista) {
      this.trace("_ultimaAccionDe", arguments);
      return [...lista]
        .filter(a => a.en_concepto === concepto)
        .sort((a, b) => b._inicio - a._inicio)[0];
    }

    static _evaluarRegla(hora, concepto, regla, ultima, generadas) {
      this.trace("_evaluarRegla", arguments);
      const reglas = Array.isArray(regla) ? regla : [regla];
      for (const r of reglas) {
        if (r.nunca_despues_de) {
          const ultimaOtra = this._ultimaAccionDe(r.nunca_despues_de, generadas);
          if (ultimaOtra && hora - ultimaOtra._inicio < this._duracionAMilisegundos(r.durante)) {
            return false;
          }
        }
        if (r.cada && ultima) {
          const msMin = this._duracionAMilisegundos(r.cada);
          if (hora - ultima._inicio < msMin) {
            return false;
          }
        }
      }
      return true;
    }

    static _obtenerDuracionMinima(regla, duracionPorDefecto = "12min") {
      this.trace("_obtenerDuracionMinima", arguments);
      const reglas = Array.isArray(regla) ? regla : [regla];
      for (const r of reglas) {
        if (r.minimo) return r.minimo;
      }
      return duracionPorDefecto;
    }

    static _duracionAMilisegundos(str) {
      this.trace("_duracionAMilisegundos", arguments, [str]);
      const partes = str.match(/((\d+)\s*h)?\s*((\d+)\s*min)?/i);
      const horas = partes?.[2] ? parseInt(partes[2]) : 0;
      const minutos = partes?.[4] ? parseInt(partes[4]) : 0;
      return (horas * 60 + minutos) * 60 * 1000;
    }

    static _avanzarTiempo(date, duracionStr) {
      this.trace("_avanzarTiempo", arguments, [date, duracionStr]);
      const ms = this._duracionAMilisegundos(duracionStr);
      date.setTime(date.getTime() + ms);
      return new Date(date);
    }

    static _formatearFecha(date) {
      this.trace("_formatearFecha", arguments);
      return LswTimer.utils.fromDateToDatestring(date);
    }

    static _generarIdUnico() {
      this.trace("_generarIdUnico", arguments);
      return Math.floor(Math.random() * 1e9);
    }

    static _bloquesPorConcepto(reglas, accionesTotales, bloquesDisponibles) {
      const porciones = {};
      let total = 0;

      for (const concepto in reglas) {
        const r = Array.isArray(reglas[concepto]) ? reglas[concepto] : [reglas[concepto]];
        const p = r.find(x => x.porcion)?.porcion || 0;
        porciones[concepto] = p;
        total += p;
      }

      const usados = {};
      for (const concepto in reglas) {
        usados[concepto] = accionesTotales
          .filter(a => a.en_concepto === concepto)
          .reduce((suma, a) => suma + Math.round(a._duracionMilisegundos / 600000), 0); // bloques de 10min
      }

      const metas = {};
      for (const concepto in reglas) {
        metas[concepto] = total
          ? Math.round((porciones[concepto] / total) * bloquesDisponibles)
          : 0;
      }

      return { usados, metas };
    }
  }

  return LswAgendaRandomizer;

});