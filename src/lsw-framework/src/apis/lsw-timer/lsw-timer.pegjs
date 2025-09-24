{
  const recomponer_objeto = function(partes) {
    let objeto = {};
    for(let i=0; i<partes.length; i++) {
      const parte = partes[i];
      objeto[parte.unidad] = parte.valor;
    }
    return objeto;
  };
}

Inicio
  = Lista

Lista
  = primero:UnidadDeTiempo otras:OtraUnidadDeTiempo* {
      return [primero].concat(otras || []);
    }

OtraUnidadDeTiempo 
  = _* "," _* tiempo:UnidadDeTiempo {
      return tiempo;
    }

UnidadDeTiempo
  = Duracion
  / Rango
  / Momento

Rango
  = inicio:Momento "-" fin:Momento {
      return { tipo: "Rango", inicio, fin };
    }

Momento
  = FechaHora
  / SoloFecha
  / Hora

FechaHora
  = fecha:SoloFecha ("+"/" ") hora:Hora {
      delete fecha.tipo;
      delete hora.tipo;
      return { tipo: "FechaHora", ...fecha, ...hora };
    }

SoloFecha
  = anio:Anio "/" mes:Mes "/" dia:Dia {
      return { tipo: "SoloFecha", anio, mes, dia };
    }

Hora
  = hora:HoraExacta ":" minuto:Minuto ":" segundo:Segundo "." milisegundo:Milisegundo {
      return { tipo: "Hora", hora, minuto, segundo, milisegundo };
    }
  / hora:HoraExacta ":" minuto:Minuto ":" segundo:Segundo {
      return { tipo: "Hora", hora, minuto, segundo, milisegundo: 0 };
    }
  / hora:HoraExacta ":" minuto:Minuto {
      return { tipo: "Hora", hora, minuto, segundo: 0, milisegundo: 0 };
    }
  

Duracion
  = partes:ParteDuracion+ {
      return { tipo: "Duracion", ...recomponer_objeto(partes) };
    }

ParteDuracion
  = _* valor:Numero unidad:Unidad {
      return { valor, unidad };
    }

Unidad
  = "y" { return "anios"; }
  / "mon" { return "meses"; }
  / "d" { return "dias"; }
  / "h" { return "horas"; }
  / "min" { return "minutos"; }
  / "s" { return "segundos"; }
  / "ms" { return "milisegundos"; }

Anio
  = [0-9][0-9][0-9][0-9] { return parseInt(text(), 10); }

Mes
  = [0-1][0-9] { return parseInt(text(), 10); }

Dia
  = [0-3][0-9] { return parseInt(text(), 10); }

HoraExacta
  = [0-2][0-9] { return parseInt(text(), 10); }

Minuto
  = [0-5][0-9] { return parseInt(text(), 10); }

Segundo
  = [0-5][0-9] { return parseInt(text(), 10); }

Milisegundo
  = [0-9][0-9]?[0-9]? { return parseInt(text(), 10); }

Numero
  = [0-9]+ { return parseInt(text(), 10); }

_ = " " / "\t"
