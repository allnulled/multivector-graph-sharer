const conceptos = await lsw.database.selectMany("Concepto");
const acciones = await lsw.database.selectMany("Accion");
const acciones_virtuales = await lsw.database.selectMany("Accion_virtual");
const propagadores = await lsw.database.selectMany("Propagador_de_concepto");
const prototipos = await lsw.database.selectMany("Propagador_prototipo");
const acumulaciones_objeto = acciones_virtuales.reduce((out, it) => {
  if(!(it.en_concepto in out)) {
    out[it.en_concepto] = 0;
  }
  out[it.en_concepto] += (LswTimer.utils.fromDurationstringToMilliseconds(it.tiene_duracion) || 0);
  return out;
}, {});
const acumulaciones = Object.keys(acumulaciones_objeto).sort((k1, k2) => {
  const c1 = acumulaciones_objeto[k1];
  const c2 = acumulaciones_objeto[k2];
  return c2 > c1 ? 1 : -1;
}).map(id => {
  const ms = acumulaciones_objeto[id];
  return {
    nombre: id,
    total: LswTimer.utils.fromMillisecondsToDurationstring(ms)
  };
});

return {
  "Acumulaciones virtuales": acumulaciones,
  "Conceptos": conceptos,
  "Acciones": acciones,
  "Acciones virtuales": acciones_virtuales,
  "Propagadores": propagadores,
  "Propagadores prototipo": prototipos,
};