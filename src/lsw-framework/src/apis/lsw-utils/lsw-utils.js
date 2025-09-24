(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswUtils'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswUtils'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  // @code.start: LswUtils | @section: Lsw Utils API » Lsw Utils global
  const LswUtils = {};

  LswUtils.hello = () => console.log("Hello!");

  ///////////////////////////////////////////////////////
  // API de Excel: usa SheetJS
  Object.assign(LswUtils, {
    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsArrayBuffer(file);
      });
    },
    readFileAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
      });
    },
    readFileAsBinaryString(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsBinaryString(file);
      });
    },
    selectFile() {
      return new Promise(resolve => {
        const inputHtml = document.createElement("input");
        inputHtml.setAttribute("type", "file");
        inputHtml.setAttribute("accept", ".ods,.xlsx,.xls,.csv");
        inputHtml.style.display = "none";
        document.body.appendChild(inputHtml);
        inputHtml.addEventListener("change", event => {
          try {
            const file = event.target.files[0];
            if (file) {
              return resolve(file);
            } else {
              return resolve(undefined);
            }
          } catch (error) {
            console.log("This should not happen :(", error);
          } finally {
            inputHtml.remove();
          }
        });
        inputHtml.click();
      });
    },
    sheetToArray(sheet) {
      // Obtener el rango de celdas activo de la hoja
      const range = sheet['!ref']; // Ejemplo: 'A1:C3'
      // Extraer las coordenadas de la celda inicial y final del rango
      const [startCell, endCell] = range.split(':');
      const startCol = startCell.match(/[A-Z]+/)[0]; // Columna de la primera celda (por ejemplo, 'A')
      const startRow = parseInt(startCell.match(/\d+/)[0], 10); // Fila de la primera celda (por ejemplo, 1)
      const endCol = endCell.match(/[A-Z]+/)[0]; // Columna de la última celda (por ejemplo, 'C')
      const endRow = parseInt(endCell.match(/\d+/)[0], 10); // Fila de la última celda (por ejemplo, 3)
      const data = [];
      // Iterar sobre las filas y columnas dentro del rango
      for (let row = startRow; row <= endRow; row++) {
        const rowData = [];
        for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
          const cellAddress = String.fromCharCode(col) + row;
          const cell = sheet[cellAddress]; // Obtener la celda
          rowData.push(cell ? cell.v : null); // Si la celda existe, tomar su valor. Si no, agregar `null`
        }
        data.push(rowData); // Agregar la fila al array de datos
      }
      return data;
    }
  });

  ///////////////////////////////////////////////////////
  // API de Conductometria: usa API de Excel (so: SheetJS)
  Object.assign(LswUtils, {
    isDatePassed(date, time, currentDate = new Date()) {
      const [day, month, year] = date.split("/").map(Number);
      const [hour, minute, second] = time.split(":").map(Number);
      const targetDate = new Date(year, month - 1, day, hour, minute, second);
      return currentDate > targetDate;
    },
    sheetToRegistros(sheet, asObjectIsOkay = false) {
      const raw = this.sheetToArray(sheet);
      const byDate = {};
      let lastDate = undefined;
      const currentDate = new Date();
      Compact_by_date_using_last_date: {
        for (let index = 0; index < raw.length; index++) {
          const cells = raw[index];
          const [time, content] = cells;
          const isDate = time.match(/[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9]/g);
          if (isDate) {
            if (!(time in byDate)) {
              byDate[time] = {};
            }
            lastDate = time;
          } else {
            if (typeof content === "string") {
              if (!(time in byDate[lastDate])) {
                byDate[lastDate][time] = [];
              }
              Add_properties_to_hour: {
              }
              const items = content.split(".").filter(l => l !== "");
              for (let indexItem = 0; indexItem < items.length; indexItem++) {
                const item = items[indexItem];
                const [name, details] = item.split(":").filter(l => l !== "");
                let event = {};
                Add_properties_to_event: {
                  Object.assign(event, { name });
                  Object.assign(event, details ? { details: details.trim() } : {});
                }
                byDate[lastDate][time].push(event);
              }
            }
          }
        }
      }
      if (asObjectIsOkay) {
        return byDate;
      }
      const output = [];
      Format_to_pure_array_to_avoid_confusions: {
        const daysSorted = Object.keys(byDate).sort();
        for (let index_day = 0; index_day < daysSorted.length; index_day++) {
          const day_id = daysSorted[index_day];
          const day_data = byDate[day_id];
          const day_output = {
            day: day_id,
            hours: []
          };
          const hoursSorted = Object.keys(day_data).sort();
          for (let index_hour = 0; index_hour < hoursSorted.length; index_hour++) {
            const hour_id = hoursSorted[index_hour];
            const hour_data = day_data[hour_id];
            const hour_is_passed = this.isDatePassed(day_id, hour_id, currentDate);
            const hour_is_current = hour_is_passed && (() => {
              const [hours, minutes, seconds] = hour_id.split(":").map(Number);
              const hour_next_id = [hours + 1, minutes, seconds].map(t => ("" + t).padStart(2, "0")).join(":");
              console.log(hour_next_id);
              return !this.isDatePassed(day_id, hour_next_id, currentDate);
            })();
            const hour_output = {
              hour: hour_id,
              events: [],
              passed: hour_is_passed,
              current: hour_is_current,
            };
            for (let index_item = 0; index_item < hour_data.length; index_item++) {
              const item = hour_data[index_item];
              hour_output.events.push(item);
            }
            day_output.hours.push(hour_output);
          }
          output.push(day_output);
        }
      }
      return output;
    },
    async loadConductometriaByExcelFile() {
      try {
        const file = await this.selectFile();
        const data = await this.readFileAsBinaryString(file);
        const workbook = XLSX.read(data, { type: "binary", cellDates: false });
        const sheet = workbook.Sheets["Tracking"];
        const registros = this.sheetToRegistros(sheet);
        return { registros };
      } catch (error) {
        console.log(error);
      }
    },
  });

  // API de LSW:
  LswUtils.toPlainObject = function (obj) {
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return undefined; // Ignora referencias circulares
        seen.add(value);
      }
      return value;
    }));
  };


  LswUtils.stringify = function (argInput, avoidedIndexes = [], currentLevel = 0, maxLevel = -1) {
    const seen = new WeakSet();
    return JSON.stringify(argInput, function (key, value) {
      if (avoidedIndexes.indexOf(key) !== -1) {
        return;
      }
      if (typeof value === "object") {
        if (value === null) {
          return null;
        }
        if (value.$el) {
          return `[VueComponent:${value?.$options?.name}]`;
        }
        if (seen.has(value)) {
          return "[Circular]";
        }
        if (value !== null) {
          seen.add(value);
        }
      }
      return value;
    }, 2);
  };

  LswUtils.pluralizar = function (singular, plural, contexto, cantidad) {
    return contexto.replace("%s", cantidad === 1 ? singular : plural).replace("%i", cantidad);
  };

  LswUtils.getRandomString = function (len = 10) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    let out = "";
    while (out.length < len) {
      out += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return out;
  };

  LswUtils.hello = function () {
    console.log("hello");
  };

  LswUtils.waitForMilliseconds = function (ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  };

  LswUtils.toIntegerOr = function (txt, defaultValue = undefined) {
    const val = parseInt(txt);
    return isNaN(val) ? defaultValue : val;
  };

  LswUtils.toFloatOr = function (txt, defaultValue = undefined) {
    const val = parseFloat(txt);
    return isNaN(val) ? defaultValue : val;
  };

  LswUtils.joinPaths = function(...subpaths) {
    let joined = '';
    for(let index=0; index<subpaths.length; index++) {
      const subpath = subpaths[index];
      joined = joined.replace(/\/$/g, "") + "/" + subpath.replace(/^\/|\/$/g, "");
    }
    return joined;
  };

  LswUtils.splitStringOnce = function (text, splitter) {
    if (typeof text !== "string") {
      throw new Error("Required parameter «text» to be a string on «LswUtils.splitStringOnce»");
    }
    if (typeof splitter !== "string") {
      throw new Error("Required parameter «text» to be a string on «LswUtils.splitStringOnce»");
    }
    const pos = text.indexOf(splitter);
    if (pos === -1) return [undefined, text];
    const parts = text.split("");
    return [[...parts].splice(0, pos).join(""), [...parts].splice(pos + 1).join("")];
  };

  LswUtils.reverseString = function (text) {
    return text.split("").reverse().join("");
  };

  LswUtils.capitalize = function (text) {
    return text.substr(0, 1).toUpperCase() + text.substr(1);
  };

  LswUtils.startThread = function (callback) {
    setTimeout(callback, 0);
  };

  LswUtils.openAddNoteDialog = async function () {
    const response = await Vue.prototype.$lsw.dialogs.open({
      title: "Nueva nota",
      template: `
        <div class="pad_1 position_absolute top_0 right_0 left_0 bottom_0 flex_column">
          <div class="flex_1">
            <input class="width_100" type="text" v-model="value.tiene_fecha" placeholder="Fecha de la nota" ref="fecha" />
          </div>
          <div class="flex_1 flex_row centered" style="padding-top: 1px;">
            <div class="flex_1">Estado: </div>
            <select class="flex_100" v-model="value.tiene_estado">
              <option value="creada">Creada</option>
              <option value="procesada">Procesada</option>
              <option value="dudosa">Dudosa</option>
              <option value="desestimada">Desestimada</option>
            </select>
          </div>
          <div class="flex_1" style="padding-top: 2px;">
            <input class="width_100" type="text" v-model="value.tiene_categorias" placeholder="categoría 1; categoria 2; categoria 3" />
          </div>
          <div class="flex_100" style="padding-top: 1px;">
            <textarea v-model="value.tiene_contenido" spellcheck="false" style="height: 100%;" placeholder="Contenido de la nota. Acepta **markdown**, recuerda." ref="contenido" />
          </div>
          <div class="flex_1" style="padding-top: 2px;">
            <input class="width_100" type="text" v-model="value.tiene_titulo" placeholder="Título de la nota" ref="titulo" />
          </div>
          <div class="flex_row pad_top_1">
            <div class="flex_100"></div>
            <div class="flex_1 flex_row">
              <div class="pad_right_1">
                <button class="mini" v-on:click="validate">➕ Añadir</button>
              </div>
            </div>
          </div>
        </div>
      `,
      factory: {
        methods: {
          validate() {
            const isValidFecha = LswTimer.parser.parse(this.value.tiene_fecha);
            const isValidContenido = this.value.tiene_contenido.trim() !== "";
            const isValidTitulo = this.value.tiene_titulo.trim() !== "";
            if (!isValidTitulo) {
              window.alert("Necesita un título la nota.");
              return this.$refs.titulo.focus();
            }
            if (!isValidContenido) {
              window.alert("Necesita un contenido la nota.");
              return this.$refs.contenido.focus();
            }
            if (!isValidFecha) {
              window.alert("Necesita una fecha válida la nota.");
              return this.$refs.fecha.focus();
            }
            return this.accept();
          }
        },
        data: {
          value: {
            tiene_fecha: LswTimer.utils.formatDatestringFromDate(new Date(), false, false, true),
            tiene_titulo: "",
            tiene_categorias: "",
            tiene_contenido: "",
            tiene_estado: "creada", // "procesada"
          }
        }
      }
    });
    return response;
  };

  LswUtils.openAddArticuloDialog = async function () {
    const response = await Vue.prototype.$lsw.dialogs.open({
      title: "Nuevo artículo",
      template: `
        <div class="">
          <lsw-schema-based-form
            :model="{
              databaseId:'lsw_default_database',
              tableId:'Articulo',
              rowId: -1,
            }"
            :on-submit="validate"
          />
        </div>
      `,
      factory: {
        methods: {
          validate(value) {
            console.log("Validating:", value);
            this.value = value;
            const isValidFecha = LswTimer.parser.parse(this.value.tiene_fecha);
            const isValidContenido = this.value.tiene_contenido.trim() !== "";
            const isValidTitulo = this.value.tiene_titulo.trim() !== "";
            if (!isValidTitulo) {
              window.alert("Necesita un título la nota.");
              return this.$refs.titulo.focus();
            }
            if (!isValidContenido) {
              window.alert("Necesita un contenido la nota.");
              return this.$refs.contenido.focus();
            }
            if (!isValidFecha) {
              window.alert("Necesita una fecha válida la nota.");
              return this.$refs.fecha.focus();
            }
            return this.accept();
          }
        },
        data: {
          value: {
            tiene_fecha: LswTimer.utils.formatDatestringFromDate(new Date(), false, false, true),
            tiene_titulo: "",
            tiene_categorias: "",
            tiene_contenido: "",
            tiene_estado: "creada", // "procesada"
          }
        }
      }
    });
    return response;
  };

  LswUtils.createAsyncFunction = function (code, parameters = []) {
    const AsyncFunction = (async function () { }).constructor;
    const asyncFunction = new AsyncFunction(...parameters, code);
    return asyncFunction;
  };

  LswUtils.createSyncFunction = function (code, parameters = []) {
    const syncFunction = new Function(...parameters, code);
    return syncFunction;
  };

  LswUtils.callSyncFunction = function (code, parameters = {}, scope = globalThis) {
    const parameterKeys = Object.keys(parameters);
    const parameterValues = Object.values(parameters);
    const syncFunction = new Function(...parameterKeys, code);
    return syncFunction.call(scope, ...parameterValues);
  };

  LswUtils.arrays = {};

  LswUtils.extractFirstStringOr = function (txt, defaultValue = "") {
    if (!txt.startsWith('"')) return defaultValue;
    const pos1 = txt.substr(1).indexOf('"');
    if (pos1 === -1) return defaultValue;
    const pos = pos1 - 1;
    const extractedSubstr = txt.substr(0, pos);
    // // @OK: No escapamos, porque se entiende que no se va a usar ese string en el concepto nunca.
    return JSON.parse(extractedSubstr);
  };

  LswUtils.uniquizeArray = function (list) {
    const appeared = [];
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      const pos = appeared.indexOf(item);
      if (pos === -1) {
        appeared.push(item);
      }
    }
    return appeared;
  };

  LswUtils.arrays.uniquizeArray = LswUtils.uniquizeArray;

  LswUtils.arrays.getMissingInFirst = function (a, b) {
    const excludeds = [];
    for (let index = 0; index < b.length; index++) {
      const b_item = b[index];
      const pos = a.indexOf(b_item);
      if (pos === -1) {
        excludeds.push(b_item);
      }
    }
    return excludeds;
  };

  LswUtils.fromJsonToNatural = function (json, nivel = 0) {
    // @CHATGPT:
    const indent = '  '.repeat(nivel);
    let texto = '';
    if (Array.isArray(json)) {
      texto += `${indent}Esta es una lista con ${json.length} elemento(s):\n`;
      json.forEach((item, index) => {
        texto += `${indent}- Elemento ${index + 1}: `;
        if (typeof item === 'object' && item !== null) {
          texto += '\n' + LswUtils.fromJsonToNatural(item, nivel + 1);
        } else {
          texto += `${LswUtils.naturalizeValue(item)}\n`;
        }
      });
    } else if (typeof json === 'object' && json !== null) {
      const keys = Object.keys(json);
      texto += `${indent}Este objeto tiene ${keys.length} propiedad(es):\n`;
      for (const key of keys) {
        const valor = json[key];
        texto += `${indent}- La propiedad "${key}" `;
        if (typeof valor === 'object' && valor !== null) {
          texto += `contiene:\n` + LswUtils.fromJsonToNatural(valor, nivel + 1);
        } else {
          texto += `tiene ${LswUtils.naturalizeValue(valor)}.\n`;
        }
      }
    } else {
      texto += `${indent}${LswUtils.naturalizeValue(json)}\n`;
    }
    return texto;
  };

  LswUtils.naturalizeValue = function (valor) {
    switch (typeof valor) {
      case 'string':
        return `un texto que dice "${valor}"`;
      case 'number':
        return `un número con valor ${valor}`;
      case 'boolean':
        return valor ? 'el valor verdadero' : 'el valor falso';
      case 'object':
        return valor === null ? 'un valor nulo' : 'un objeto';
      default:
        return 'un valor desconocido';
    }
  };

  LswUtils.subtextualize = function(text, maxLength = 30) {
    if(text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  LswUtils.downloadFile = function (filename, filecontent) {
    if (typeof window.cordova !== "undefined") {
      LswUtils.debug(`Descargando fichero ${filename} (${filecontent.length}B) en entorno de Cordova app`);
      const rutaFinal = cordova.file.externalRootDirectory + 'Download/';
      LswUtils.debug(`Descargando en ruta final: ${rutaFinal}${filename}`);
      window.resolveLocalFileSystemURL(rutaFinal, function (dir) {
        dir.getFile(filename, { create: true }, function (file) {
          file.createWriter(function (fileWriter) {
            const blob = new Blob([filecontent], { type: "text/plain" });
            fileWriter.write(blob);
            LswUtils.debug(`Descarga efectuada con éxito en la carpeta convencional de descargas: ${rutaFinal}${filename}`);
          }, LswUtils.debug);
        });
      }, LswUtils.debug);
    } else {
      LswUtils.debug(`Descargando fichero ${filename} (${filecontent.length}B) en entorno web`);
      const blob = new Blob([filecontent], { type: "text/plain" });
      const enlace = document.createElement("a");
      enlace.href = URL.createObjectURL(blob);
      enlace.download = filename;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
    }
  };

  LswUtils.extractPropertiesFrom = function (base, props = [], voidedProps = [], overridings = {}) {
    const out = {};
    for (let index = 0; index < props.length; index++) {
      const propId = props[index];
      if (propId in base) {
        out[propId] = base[propId];
      }
    }
    for (let index = 0; index < voidedProps.length; index++) {
      const propId = voidedProps[index];
      delete out[propId];
    }
    return Object.assign(out, overridings);
  };

  LswUtils.getUniqueItemsFromLists = function (...lists) {
    const uniqueKeys = [];
    for (let index = 0; index < lists.length; index++) {
      const keys = lists[index];
      for (let indexKey = 0; indexKey < keys.length; indexKey++) {
        const key = keys[indexKey];
        if (uniqueKeys.indexOf(key) === -1) {
          uniqueKeys.push(key);
        }
      }
    }
    return uniqueKeys;
  };

  LswUtils.sortListByProperties = function (lista, props) {
    return lista.sort((a, b) => {
      for (let prop of props) {
        let orden = 1;

        if (prop.startsWith("!")) {
          orden = -1;
          prop = prop.slice(1);
        }

        const valA = a[prop];
        const valB = b[prop];

        if (valA < valB) return -1 * orden;
        if (valA > valB) return 1 * orden;
      }
      return 0;
    });
  };

  LswUtils.parseAsJsonOrReturn = function (data, defaultValue = undefined) {
    try {
      return JSON.parse(data);
    } catch (error) {
      return defaultValue;
    }
  };

  LswUtils.dehydrateFunction = function (f) {
    return f.toString();
  };

  LswUtils.hydrateFunction = function (fSource) {
    return new Function(fSource);
  };

  LswUtils.zeroIfNegative = function (numero) {
    if (numero < 0) {
      return 0;
    }
    return numero;
  };

  LswUtils.filterObject = function (obj, filterer) {
    return Object.keys(obj).reduce((output, key, index) => {
      const val = obj[key];
      console.log(key, val, index, output);
      const result = filterer(key, val, index, output);
      if (result) {
        output[key] = val;
      }
      return output;
    }, {});
  };

  LswUtils.mapObject = function (obj, mapper, deleterValue = undefined) {
    return Object.keys(obj).reduce((output, key, index) => {
      const val = obj[key];
      const result = mapper(key, val, index, output);
      if (result !== deleterValue) {
        output[key] = result;
      }
      return output;
    }, {});
  };

  LswUtils.reduceObject = function (obj, reducer) {
    return Object.keys(obj).reduce((output, key, index) => {
      const val = obj[key];
      return reducer(key, val, index, output);
    }, {});
  };

  LswUtils.askForFileText = async function () {
    return new Promise((resolve, reject) => {
      const inputHtml = document.createElement("input");
      inputHtml.type = "file";
      inputHtml.style.display = "none";
      inputHtml.onchange = function () {
        const file = event.target.files[0];
        if (file) {
          resolve(file);
        } else {
          reject(new Error("No file selected finally"));
        }
        document.body.removeChild(inputHtml);
      };
      document.body.appendChild(inputHtml);
      inputHtml.click();
    }).then(file => {
      return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => {
          resolve(lector.result);
        };
        lector.readAsText(file);
      });
    });
  };

  LswUtils.padStart = function (txt, ...args) {
    return ("" + txt).padStart(...args);
  };

  LswUtils.flattenObjects = function (list, options = {}) {
    const {
      keyMapper = false, // can be function or false
      valueMapper = false, // can be function or false
      duplicatedsStrategy = 'override', // can be "override" | "error"
      nonFlattenablesStrategy = 'ignore', // can be "ignore" | "error"
    } = options;
    const output = {};
    let totalKeys = 0;
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      const isFlattenable = (typeof item === "object") && (item !== null);
      if (isFlattenable) {
        const allKeys = Object.keys(item);
        for (let indexKey = 0; indexKey < allKeys.length; indexKey++) {
          const key = allKeys[indexKey];
          const isDuplicated = key in output;
          if ((!isDuplicated) || (duplicatedsStrategy === 'override')) {
            const finalKey = typeof keyMapper === 'function' ? keyMapper(key, totalKeys, indexKey, item, index, list) : key;
            const finalValue = typeof valueMapper === 'function' ? valueMapper(item[key], totalKeys, indexKey, item, index, list) : item[key];
            totalKeys++;
            output[finalKey] = finalValue;
          } else if (duplicatedsStrategy === 'error') {
            throw new Error(`Required item on index «${index}» key «${key}» to not be duplicated on «LswUtils.flattenObjects»`);
          } else {
            throw new Error(`Unknown strategy for duplicateds «${duplicatedsStrategy}» on «LswUtils.flattenObjects»`);
          }
        }
      } else if (nonFlattenablesStrategy === 'ignore') {
        // @OK.
      } else if (nonFlattenablesStrategy === 'error') {
        throw new Error(`Required item on index «${index}=${typeof item}» to be flattenable on «LswUtils.flattenObjects»`);
      } else {
        throw new Error(`Unknown strategy for non-flattenables «${nonFlattenablesStrategy}» on «LswUtils.flattenObjects»`);
      }
    }
    return output;
  };

  LswUtils.splitByUnicode = function (texto) {
    const segmenter = new Intl.Segmenter('es', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(texto), s => s.segment);
  };

  LswUtils.copyToClipboard = function (texto) {
    window.navigator.clipboard.writeText(texto);
    Vue.prototype.$lsw.toasts.send({
      title: "Texto copiado",
      text: "Un texto de " + texto.length + " caracteres fue copiado al portapapeles"
    });
  };

  LswUtils.debug = (...args) => LswDebugger.global.debug(...args);

  Global_injection: {
    window.kk = (...args) => Object.keys(...args);
    window.dd = (...args) => LswDebugger.global.debug(...args);
    window.ddd = (...args) => LswDebugger.global.debug(...args);
  }

  // @code.end: LswUtils

  return LswUtils;

});