(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswConductometria'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswConductometria'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  // @code.start: LswConductometria API | @$section: Vue.js (v2) Components » LswAgenda API » LswConductometria API » LswConductometria class
  const LswConductometria = class {

    static create(...args) {
      Vue.prototype.$trace("LswConductometria.create");
      return new this(...args);
    }

    constructor(component = false) {
      Vue.prototype.$trace("lswConductometria.constructor");
      this.$component = component;
    }

    async reload() {
      Vue.prototype.$trace("lswConductometria.reload");
      const virtualization = LswConductometriaVirtualization.create(this.$component);
      await virtualization.$resetVirtualTables();
      await virtualization.$reloadProtolangScriptBoot();
      await virtualization.$virtualizePropagations();
    }

  }

  const LswConductometriaVirtualization = class {

    static create(...args) {
      Vue.prototype.$trace("LswConductometriaVirtualization.create");
      return new this(...args);
    }

    constructor(component) {
      this.$component = component;
    }

    reportErrorFromComponent(error) {
      Vue.prototype.$trace("lswConductometriaVirtualization.reportErrorFromComponent");
      this.DEBUG("Lsw-cond-virt.reportErrorFromComponent");
      console.log(error);
      if (this.$component && (typeof this.$component.addError === "function")) {
        this.$component.addError(error);
      }
    }

    async $resetVirtualTables() {
      Vue.prototype.$trace("lswConductometriaVirtualization.$resetVirtualTables");
      this.DEBUG("Lsw-cond-virt.$resetVirtualTables");
      await Vue.prototype.$lsw.database.deleteMany("Accion_virtual", it => true);
      await Vue.prototype.$lsw.database.deleteMany("Propagador_prototipo", it => true);
      await Vue.prototype.$lsw.database.deleteMany("Propagador_de_concepto", it => true);
    }

    async $reloadProtolangScriptBoot() {
      Vue.prototype.$trace("lswConductometriaVirtualization.$reloadProtolangScriptBoot");
      this.DEBUG("Lsw-cond-virt.$reloadProtolangScriptBoot");
      const protoSource = await Vue.prototype.$lsw.fs.read_file("/kernel/agenda/proto/boot.proto");
      return await this.$evaluateProtolangScript(protoSource, {
        sourcePath: "/kernel/agenda/script/boot.proto"
      });
    }

    async $evaluateProtolangScript(source, parameters) {
      Vue.prototype.$trace("lswConductometriaVirtualization.$evaluateProtolangScript");
      this.DEBUG("Lsw-cond-virt.$evaluateProtolangScript");
      const ast = Vue.prototype.$lsw.parsers.proto.parse(source, {
        options: parameters
      });
      for (let index = 0; index < ast.length; index++) {
        const sentence = ast[index];
        if (sentence.type === "inc") {
          await this.$evaluateInclude(sentence);
        } else if (sentence.type === "def") {
          await this.$evaluateDefine(sentence);
        } else if (sentence.type === "fun") {
          await this.$evaluateFunction(sentence);
        } else if (sentence.type === "rel") {
          await this.$evaluateRelation(sentence);
        }
      }
    }

    async $evaluateInclude(sentence) {
      Vue.prototype.$trace("lswConductometriaVirtualization.$evaluateInclude");
      this.DEBUG("Lsw-cond-virt.$evaluateInclude");
      this.DEBUG(sentence);
      let isFile = undefined;
      let isDirectory = undefined;
      const allFiles = [];
      const filepath = sentence.path;
      Read_node: {
        this.DEBUG("read node");
        isFile = await Vue.prototype.$lsw.fs.is_file(filepath);
        isDirectory = await Vue.prototype.$lsw.fs.is_directory(filepath);;
        if (isFile) {
          Vue.prototype.$trace("[*] Reading file: ", filepath);
          this.DEBUG("[*] Reading file: ", filepath);
          const contents = await Vue.prototype.$lsw.fs.read_file(filepath);
          allFiles.push({
            incBy: sentence,
            file: filepath,
            contents: contents
          });
        } else if (isDirectory) {
          Vue.prototype.$trace("[*] Reading directory: ", filepath);
          this.DEBUG("[*] Reading directory: ", filepath);
          const subfilesMap = await Vue.prototype.$lsw.fs.read_directory(filepath);
          const subfiles = Object.keys(subfilesMap);
          Iterating_subfiles:
          for (let indexSubfile = 0; indexSubfile < subfiles.length; indexSubfile++) {
            const subfile = subfiles[indexSubfile];
            this.DEBUG("iterating subfile:", subfile);
            const subfilepath = Vue.prototype.$lsw.fs.resolve_path(filepath, subfile);
            const is_file = await Vue.prototype.$lsw.fs.is_file(subfilepath);
            if (!is_file) {
              continue Iterating_subfiles;
            }
            Vue.prototype.$trace("[*] Reading subfile: ", subfilepath);
            this.DEBUG("[*] Reading subfile: ", subfilepath);
            const filecontents = await Vue.prototype.$lsw.fs.read_file(subfilepath);
            allFiles.push({
              incBy: sentence,
              file: subfilepath,
              contents: filecontents
            });
          }
        } else {
          throw new Error(`File does not exits «${filepath}» on «lswConductometriaVirtualization.$evaluateInclude»`);
        }
      }
      Vue.prototype.$trace("[*] Evaluating all subfiles:", allFiles);
      this.DEBUG("[*] Evaluating all subfiles:", allFiles);
      Evaluate_subnodes: {
        for (let indexFile = 0; indexFile < allFiles.length; indexFile++) {
          const metafile = allFiles[indexFile];
          const file = metafile.file;
          const contents = metafile.contents;
          await this.$evaluateProtolangScript(contents, {
            sourcePath: file
          });
        }
      }
    }

    async $evaluateDefine(sentence) {
      Vue.prototype.$trace("lswConductometriaVirtualization.$evaluateDefine");
      this.DEBUG("Lsw-cond-virt.$evaluateDefine");
      const { names } = sentence;
      // @DONE: insertar names en Concepto
      Iterating_names:
      for (let index = 0; index < names.length; index++) {
        const name = names[index];
        this.DEBUG("in name:", name);
        try {
          await Vue.prototype.$lsw.database.insert("Concepto", {
            tiene_nombre: name,
          });
        } catch (error) {
          if (error.message === "Error on «browsie.insert» operation over store «Concepto»: A mutation operation in the transaction failed because a constraint was not satisfied.") {
            continue Iterating_names;
          }
          await this.reportErrorFromComponent(error);
        }
      }
    }

    async $evaluateFunction(sentence) {
      Vue.prototype.$trace("lswConductometriaVirtualization.$evaluateFunction");
      this.DEBUG("Lsw-cond-virt.$evaluateFunction");
      const { name, params, code } = sentence;
      // @DONE: insertar name+params+code en Propagador_prototipo
      try {
        this.DEBUG("inserting prototipo:", name);
        await Vue.prototype.$lsw.database.insert("Propagador_prototipo", {
          tiene_nombre: name,
          tiene_parametros: JSON.stringify(params),
          tiene_funcion: code,
        });
      } catch (error) {
        await this.reportErrorFromComponent(error);
      }
    }

    async $evaluateRelation(sentence) {
      Vue.prototype.$trace("lswConductometriaVirtualization.$evaluateRelation");
      this.DEBUG("Lsw-cond-virt.$evaluateRelation");
      const { name, effects, triggers } = sentence;
      Iterating_effects:
      for (let indexEffect = 0; indexEffect < effects.length; indexEffect++) {
        const effect = effects[indexEffect];
        const { consecuencia, ratio, argumentos } = effect;
        this.DEBUG("inserting propagador:", name);
        await Vue.prototype.$lsw.database.insert("Propagador_de_concepto", {
          tiene_propagador_prototipo: "multiplicador",
          tiene_concepto_disparador: name,
          tiene_concepto_destino: consecuencia,
          tiene_parametros_extra: ratio + (argumentos ? (", " + argumentos) : ''),
          tiene_codigo: null,
        });
      }
      Iterating_triggers:
      for (let indexTrigger = 0; indexTrigger < triggers.length; indexTrigger++) {
        const trigger = triggers[indexTrigger];
        if (trigger.type === "trigger by prototype") {
          const { prototipo, conceptos, argumentos } = trigger;
          if (conceptos) {
            for (let index = 0; index < conceptos.length; index++) {
              const concepto = conceptos[index];
              Insertar_propagador_con_consecuencia: {
                await Vue.prototype.$lsw.database.insert("Propagador_de_concepto", {
                  tiene_propagador_prototipo: prototipo,
                  tiene_concepto_disparador: name,
                  tiene_concepto_destino: concepto,
                  tiene_parametros_extra: argumentos,
                  tiene_codigo: null,
                });
              }
            }
          } else {
            Insertar_propagador_por_llamada: {
              await Vue.prototype.$lsw.database.insert("Propagador_de_concepto", {
                tiene_propagador_prototipo: prototipo,
                tiene_concepto_disparador: name,
                tiene_concepto_destino: null,
                tiene_parametros_extra: argumentos,
                tiene_codigo: null,
              });
            }
          }
        } else if (trigger.type === "trigger by code") {
          Insertar_propagador_por_codigo_directo: {
            await Vue.prototype.$lsw.database.insert("Propagador_de_concepto", {
              tiene_propagador_prototipo: null,
              tiene_concepto_disparador: name,
              tiene_concepto_destino: null,
              tiene_parametros_extra: null,
              tiene_codigo: trigger.code
            });
          }
        }
      }
    }

    $toJsExtension(txt) {
      return txt.replace(/\.js$/g, "") + ".js";
    }

    async $virtualizePropagations() {
      Vue.prototype.$trace("lswConductometriaVirtualization.$virtualizePropagations");
      this.DEBUG("Lsw-cond-virt.$virtualizePropagations");
      const accionesReales = await Vue.prototype.$lsw.database.selectMany("Accion", accion => true);
      // console.log("Acciones reales", accionesReales);
      const errorOptions = {
        timeout: 1000 * 10
      };
      Iterando_acciones_reales:
      for (let indexAccionReal = 0; indexAccionReal < accionesReales.length; indexAccionReal++) {
        const accionReal = accionesReales[indexAccionReal];
        Virtualizar_accion_real: {
          await this.addVirtualAction(accionReal);
        }
      }
    }

    $showError(error, options = {}, propagate = false, log = true) {
      Vue.prototype.$trace("lswConductometriaVirtualization.$showError");
      this.DEBUG("Lsw-cond-virt.$showError");
      try {
        this.$component.showError(error, options, propagate, log);
      } catch (error) {
        console.log("[!] Could not notify to vue component about this previous error");
      }
      if (propagate) {
        throw error;
      }
    }

    async addVirtualAction(accion_inicial) {
      Vue.prototype.$trace("lswConductometriaVirtualization.addVirtualAction");
      this.DEBUG("Lsw-cond-virt.addVirtualAction");
      Validaciones_minimas: {
        break Validaciones_minimas;
        const ensure1 = $ensure({ accion_inicial }, 1).type("object").to.have.keys(["en_concepto", "tiene_inicio", "tiene_duracion"]);
        ensure1.its("en_concepto").type("string");
        ensure1.its("tiene_inicio").type("string").its("length").to.be.greaterThan(0);
        ensure1.its("tiene_duracion").type("string").its("length").to.be.greaterThan(0);
      }
      Filtramos_los_estados_no_completados: {
        if (accion_inicial.tiene_estado === 'pendiente') {
          return "IGNORED BECAUSE OF STATE PENDING";
        }
        if (accion_inicial.tiene_estado === 'fallida') {
          return "IGNORED BECAUSE OF STATE FAILED";
        }
      }
      let conc_inicial = accion_inicial.en_concepto;
      let asoc_propags = false;
      let asoc_proto_ids = false;
      let asoc_protos_found = false;
      let asoc_proto_ids_found = false;
      let asoc_proto_ids_missing = false;
      let asoc_protos_as_map = false;
      Insertar_accion_virtual: {
        await Vue.prototype.$lsw.database.insert("Accion_virtual", accion_inicial);
      }
      Extraer_propags: {
        asoc_propags = await Vue.prototype.$lsw.database.selectMany("Propagador_de_concepto", propag => {
          return propag.tiene_concepto_disparador === conc_inicial;
        });
        if (!asoc_propags) {
          return "NO ASSOCIATED PROPAGATORS FOUND";
        }
      }
      Extraer_protos: {
        asoc_proto_ids = LswUtils.uniquizeArray(asoc_propags.map(propag => {
          return propag.tiene_propagador_prototipo;
        }));
        asoc_protos_found = await Vue.prototype.$lsw.database.selectMany("Propagador_prototipo", proto_it => {
          return asoc_proto_ids.indexOf(proto_it.tiene_nombre) !== -1;
        });
        asoc_proto_ids_found = LswUtils.arrays.uniquizeArray(asoc_protos_found.map(proto_it => proto_it.tiene_nombre));
        asoc_proto_ids_missing = LswUtils.arrays.getMissingInFirst(asoc_proto_ids_found, asoc_proto_ids);
        asoc_protos_as_map = asoc_protos_found.reduce((out, proto_it) => {
          const nombre = proto_it.tiene_nombre;
          out[nombre] = proto_it;
          return out;
        }, {});
        if (asoc_proto_ids_missing.length) {
          this.$showError(new Error("[!] Cuidado: no se encontraron los siguientes «Propagador_prototipo»: " + asoc_proto_ids_missing.join(", ")));
        }
      }
      let propagation_molecule = {};
      Resolver_propags_con_protos_y_propagar: {
        for (let index_propag = 0; index_propag < asoc_propags.length; index_propag++) {
          const propag = asoc_propags[index_propag];
          const proto_id = propag.tiene_propagador_prototipo;
          const proto_it = asoc_protos_as_map[proto_id];
          try {
            await this.$propagateVirtualAction(accion_inicial, propag, proto_it);
          } catch (error) {
            this.$showError(error);
          }
        }
      }
    }

    async $propagateVirtualAction(accion, propagador_de_concepto, propagador_prototipo = false) {
      Vue.prototype.$trace("lswConductometriaVirtualization.$propagateVirtualAction");
      this.DEBUG("Lsw-cond-virt.$propagateVirtualAction");
      try {
        let concepto_origen = undefined;
        let concepto_destino = undefined;
        let funcion_propagadora = undefined;
        let funcion_propagadora_parametros = [];
        let funcion_propagadora_ambito = this;
        Validaciones_minimas: {
          this.DEBUG("Lsw-cond-virt.$propagateVirtualAction::Validaciones_minimas");
          const ensure1 = $ensure({ accion }, 1).type("object")
          ensure1.its("en_concepto").type("string");
          ensure1.its("tiene_inicio").type("string").its("length").to.be.greaterThan(0);
          ensure1.its("tiene_duracion").type("string").its("length").to.be.greaterThan(0);
          const ensure2 = $ensure({ propagador_de_concepto }, 1).type("object");
          const ensure3 = $ensure({ propagador_prototipo }, 1).type(["object", "boolean"]);
          // console.log("propagador_prototipo", propagador_prototipo);
        }
        const {
          tiene_nombre,     // un texto
          tiene_funcion,    // un JavaScript (cuerpo de función)
          tiene_parametros: tiene_parametros_prototipo, // un JSON bi-array
        } = propagador_prototipo;
        const {
          tiene_propagador_prototipo,  // un Propagador_prototipo.tiene_nombre
          tiene_concepto_disparador,       // un Concepto.tiene_nombre
          tiene_concepto_destino,      // un Concepto.tiene_nombre
          tiene_parametros: tiene_parametros_asociado, // un JSON bi-array
          tiene_parametros_extra,      // un JavaScript (solo parámetros)
          tiene_codigo,                // un JavaScript (cuerpo de función)
        } = propagador_de_concepto;
        Extraemos_conceptos: {
          this.DEBUG("Lsw-cond-virt.$propagateVirtualAction::Extraemos_conceptos");
          const conceptos_origen_matched = await Vue.prototype.$lsw.database.selectMany("Concepto", conc => conc.tiene_nombre === tiene_concepto_disparador);
          concepto_origen = conceptos_origen_matched[0] || undefined;
          const conceptos_destino_matched = await Vue.prototype.$lsw.database.selectMany("Concepto", conc => conc.tiene_nombre === tiene_concepto_destino);
          concepto_destino = conceptos_destino_matched[0] || undefined;
        }
        Check_point: {
          // console.log("accion", accion);
          // console.log("concepto_origen", concepto_origen);
          // console.log("concepto_destino", concepto_destino);
          // console.log("funcion_propagadora", funcion_propagadora);
          // console.log("funcion_propagadora_parametros", funcion_propagadora_parametros);
          // console.log("funcion_propagadora_ambito", funcion_propagadora_ambito);
          // console.log("CHECKPOINT!");
        }
        let propagacion_resultado = {};
        Fabricamos_la_funcion_propagadora_y_la_llamamos: {
          this.DEBUG("Lsw-cond-virt.$propagateVirtualAction::Fabricamos_la_funcion_propagadora_y_la_llamamos");
          const propagacion_params = (() => {
            try {
              return JSON.parse(tiene_parametros_prototipo);
            } catch (error) {
              return [];
            }
          })();
          const propagacion_source = tiene_funcion;
          if (!propagacion_source) {
            break Fabricamos_la_funcion_propagadora_y_la_llamamos;
          }
          const propagacion_callback = LswUtils.createAsyncFunction(propagacion_source, propagacion_params);
          if (!propagacion_callback) {
            break Fabricamos_la_funcion_propagadora_y_la_llamamos;
          }
          this.$debugEvaluation(propagacion_callback.toString(), "$propagateVirtualAction")
          try {
            const propagacion_context = {
              accion,
              propagador_de_concepto,
              propagador_prototipo
            };
            const propagacion_callback_wrapper = LswUtils.createSyncFunction(`return propagacion_callback(propagacion_context, ${tiene_parametros_asociado || "{}"}, ${tiene_parametros_extra || "undefined"})`, [
              "propagacion_context",
              "propagacion_callback",
            ]);
            this.$debugEvaluation(propagacion_callback_wrapper.toString(), "$propagateVirtualAction")
            propagacion_resultado = await propagacion_callback_wrapper.call(this, propagacion_context, propagacion_callback);
          } catch (error) {
            this.$showError(error);
          }
        }
        let accionVirtual = undefined;
        Fabricamos_nueva_accion: {
          this.DEBUG("Lsw-cond-virt.$propagateVirtualAction::Fabricamos_nueva_accion");
          if (!concepto_destino?.tiene_nombre) {
            return "NO TIENE CONCEPTO DESTINO";
          }
          if (!concepto_origen?.tiene_nombre) {
            return "NO TIENE CONCEPTO ORIGEN";
          }
          accionVirtual = this.createDefaultAction({
            en_concepto: concepto_destino.tiene_nombre,
            desde_concepto: concepto_origen.tiene_nombre,
            tiene_estado: "propagada",
            tiene_inicio: accion.tiene_inicio,
            tiene_duracion: accion.tiene_duracion,
            tiene_accion_anterior: accion.id,
            tiene_accion_origen: undefined,
            viene_de_propagador_de_concepto: propagador_de_concepto.id,
            viene_de_propagador_prototipo: propagador_prototipo.tiene_nombre,
            ...propagacion_resultado
          });
        }
        Insertamos_accion_en_virtuales: {
          this.DEBUG("Lsw-cond-virt.$propagateVirtualAction::Insertamos_accion_en_virtuales");
          this.DEBUG(accionVirtual);
          await this.addVirtualAction(accionVirtual);
        }
        // @TODO: fabricar la función propagadora y enchufarla.
        // @TODO: fabricar la función propagadora y enchufarla.
        // @TODO: fabricar la función propagadora y enchufarla.
        // @TODO: fabricar la función propagadora y enchufarla.
        // @TODO: fabricar la función propagadora y enchufarla.
      } catch (error) {
        this.$showError(error);
      }
    }

    $debugEvaluation(jsCode, traceId) {
      Vue.prototype.$trace("lswConductometriaVirtualization.$debugEvaluation");
      this.DEBUG("Lsw-cond-virt.$debugEvaluation");
      console.log("[*] Evaluating js from: " + traceId);
      console.log(jsCode);
    }

    createDefaultAction(overwrites = {}) {
      Vue.prototype.$trace("lswConductometriaVirtualization.createDefaultAction");
      this.DEBUG("Lsw-cond-virt.createDefaultAction");
      return Object.assign({
        en_concepto: "?",
        tiene_inicio: LswTimer.utils.fromDateToDatestring(new Date()),
        tiene_duracion: "1min",
      }, overwrites);
    }

    DEBUG(...args) {
      console.log(...args);
    }

  }

  return LswConductometria;
  // @code.end: LswConductometria API

});