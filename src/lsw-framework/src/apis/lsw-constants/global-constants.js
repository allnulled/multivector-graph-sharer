LswConstants.global.define("rutiner.md", `

Aprovecha para poner algo guapo aquí.

Y se te irá recordando.

`.trim());

LswConstants.global.define("/kernel/settings/rutiner.config.env", `

timeout=0h 3min
  
`.trim());


LswConstants.global.define("randomizables.env", `

números = 1
conceptos = 1
ideas = 1
interfaces gráficas = 1
patrones = 1
arquitectura de la realidad = 1
arquitectura del yo = 1
lenguajes formales = 1
cocina = 1
nutrición = 1
química = 1
nutrición = 1
química = 1
física = 1
matemáticas = 1
geometría = 1
canvas = 1
perspectiva = 1
medicina = 1
biología = 1
fisiología = 1
musculación = 1
flexibilidad = 1
emociones = 1
actividad física = 1
optimización de ram = 1
autocontrol = 1
autobservación = 1
autoanálisis = 1
meditación = 1
relajación = 1
paisajismo = 1
dibujo 3d = 1
perspectiva = 1
geometría = 1
mates = 1
dibujo artístico = 1
anime = 1
abstracto = 1
esquemista = 1
conceptualista = 1
reflexión = 1
diálogo interno = 1

`.trim());

LswConstants.global.define("backgrounds.env", `

assets/images/montania1.png
assets/images/playa1.png
assets/images/playa2.png

`.trim());

LswConstants.global.define("automessages.env", `

Sé tu propia luz.
Lo conseguiremos.
Todo se andará.
Sigamos adelante.
En algún momento encontraremos la luz.

`.trim());


LswConstants.global.define("categorias.tri", `

Árbol de categorías [] {
  Biología [] {
    Vegetal [] {}
    Animal [] {}
    Social [] {}
  }
  Medicina [] {
    Fisiología [] {}
    Nutrición [] {}
  }
  Química [] {}
  Física [] {}
  Matemáticas [] {
    Programación [] {}
    Lógica abstracta [] {}
  }
  Arte [] {}
}

`.trim());


LswConstants.global.define("report/inicio.js", `

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

`.trim());

LswConstants.global.define("boot.proto", `

inc /kernel/agenda/proto/concepto
inc /kernel/agenda/proto/funcion
inc /kernel/agenda/proto/relacion

def desayunar, comer, cenar

fun unEjemplo: param1, param2 {
  console.log("Solo un ejemplo.");
}

rel desayunar
  > consumir * 1
  > abstenerse * 0
  >> unEjemplo: 500, 1000

`.trim());

LswConstants.global.define("boot.js", `

// Cuidadito con este script que te cargas la app
// y luego tienes que borrar la caché para volver a tenerla.
        
`.trim());

LswConstants.global.define("multiplicador.js", `

fun multiplicador: contexto {
  const {
    accion,
    propagador_de_concepto
  } = contexto;
  return {
    tiene_duracion: LswTimer.utils.multiplyDuration(
      accion.tiene_duracion,
      propagador_de_concepto.tiene_parametros_extra
    )
  };
}
        
`.trim());

LswConstants.global.define("user.env", `

app.username=usuario
app.clock_message=💎
        
`.trim());

/*
LswConstants.global.define("/kernel/settings/goals/factory/fisico-3-veces.js", `

return LswGoals.minTimesToday("actividad física", 3);

`.trim());

LswConstants.global.define("/kernel/settings/goals/factory/fisico-4h.js", `

return LswGoals.minDurationToday("actividad física", "4h");

`.trim());
//*/

LswConstants.global.define("/kernel/settings/goals.env", `

actividad física | > 3 | !1
actividad física | > 4h | !2
programar | > 6h | !3

`.trim());

LswConstants.global.define("/kernel/goals/goals.week", `

*-*:

* {
  req programar >6h !10
  req correr >1h !10
  req bici > 1h !10
  req pesas > 1h !10
  req estiramientos > 30min !10
}

lun {

}

mar {

}

mie {

}

jue {

}

vie {

}

sab {
  set 06:00 = desayunar con ajo
  set 22:00 = ver puesta de sol
}

dom {
  set 10:00 = tiempo de reflexión semanal
}

  
  `.trim());

LswConstants.global.define("/kernel/settings/trackables.env", `

Sky castle

`.trim());

LswConstants.global.define("/kernel/editor/validators/js.js", `

  await LswLazyLoads.loadBeautifier();

  return ;
    
  `.trim());

LswConstants.global.define("/kernel/apps/example/load.js", `

return {
  label: "🏅 Example of app",
  event: () => {
    lsw.toasts.debug({ message: "hi from custom app!" });
  }
};
  
`.trim());

LswConstants.global.define("/kernel/android/boot.js", `

lsw.fs.evaluateAsJavascriptFileOrReturn("/kernel/android/api/load.js");

`.trim());

LswConstants.global.define("/kernel/android/api/load.js", `

await LswAndroid.eval("sys = {}");
await LswAndroid.evalFile("/kernel/android/api/debug.js");
await LswAndroid.evalFile("/kernel/android/api/tts.js");
await LswAndroid.evalFile("/kernel/android/api/reflection.js");
await LswAndroid.evalFile("/kernel/android/api/fs.js");

lsw.fs.evaluateAsJavascriptFile("/kernel/android/api/bindings.js");

LswAndroid.hablar("Hola Carlos, bienvenido a ele ese u güán!");

`.trim());

LswConstants.global.define("/kernel/android/api/tts.js", `

sys.tts = {};
sys.tts.hablar = function(mensaje) {
  try {
    var Locale = Packages.java.util.Locale;
    var TextToSpeech = Packages.android.speech.tts.TextToSpeech;
    var QUEUE_FLUSH = TextToSpeech.QUEUE_FLUSH;
    var tts = undefined;
    var listener = new TextToSpeech.OnInitListener({
        onInit: function(status) {
            if (status == TextToSpeech.SUCCESS) {
                //                tts.language = Locale.US;
                tts.language = new Locale("es", "ES");
                tts.setSpeechRate(1.5);
                tts.speak(mensaje, QUEUE_FLUSH, null, null);
            }
        }
    });
    tts = new TextToSpeech(applicationContext, listener);
  } catch (error) {
    sys.debug.view(error.message);
  }
};

`.trim());

LswConstants.global.define("/kernel/android/api/reflection.js", `

sys.reflection = {};
sys.reflection.instantiate = function (className, paramTypes, args) {
  var Class = abg.getClass("java.lang.Class");
  var ReflectArray = abg.getClass("java.lang.reflect.Array");
  var clazz = abg.getClass(className);
  var typeClasses = java.lang.reflect.Array.newInstance(Class, paramTypes.length);
  for (var i = 0; i < paramTypes.length; i++) {
    typeClasses[i] = Class.forName(paramTypes[i]);
  }
  var ctor = clazz.getConstructor(typeClasses);
  return ctor.newInstance(args);
};

`.trim());

LswConstants.global.define("/kernel/android/api/fs.js", `

try {

  var File = abg.getClass("java.io.File");
  var FileReader = abg.getClass("java.io.FileReader");
  var BufferedReader = abg.getClass("java.io.BufferedReader");
  var FileWriter = abg.getClass("java.io.FileWriter");
  var BufferedWriter = abg.getClass("java.io.BufferedWriter");

  sys.fs = {

    get_current_directory: function () {
      var file = new File(".");
      return file.getAbsolutePath();
    },

    make_directory: function (dirpath) {
      var dir = new File(dirpath);
      return dir.mkdirs(); // también crea padres si no existen
    },

    delete_directory: function (dirpath) {
      var dir = new File(dirpath);
      if (!dir.exists() || !dir.isDirectory()) return false;

      // borrar recursivamente
      var files = dir.listFiles();
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.isDirectory()) {
          sys.fs.delete_directory(file.getAbsolutePath());
        } else {
          file.delete();
        }
      }
      return dir.delete();
    },

    delete_file: function (filepath) {
      var f = new File(filepath);
      if (!f.exists() || !f.isFile()) return false;
      return f.delete();
    },

    read_directory: function (dirpath) {
      var dir = new File(dirpath);
      if (!dir.exists() || !dir.isDirectory()) return null;

      var files = dir.listFiles();
      var names = [];
      for (var i = 0; i < files.length; i++) {
        names.push(files[i].getName());
      }
      return names;
    },

    exist: function (filepath) {
      var f = new File(filepath);
      return f.exists();
    },

    read_file: function (filepath) {
      var f = new File(filepath);
      if (!f.exists()) return null;

      var fr = new FileReader(f);
      var br = new BufferedReader(fr);
      var line, content = "";

      while ((line = br.readLine()) !== null) {
        content += line + "\n";
      }

      br.close();
      fr.close();
      return content;
    },

    write_file: function (filepath, contents) {
      var f = new File(filepath);
      var fw = new FileWriter(f);
      var bw = new BufferedWriter(fw);

      bw.write(contents);
      bw.close();
      fw.close();
    }

  };
  sys.fs.get_current_directory();
} catch (error) {
  sys.debug.view(error);
}

`.trim());

LswConstants.global.define("/kernel/android/api/debug.js", `

try {

  var JavaObject = abg.getClass("java.lang.Object");

  sys.debug = {};

  sys.debug.quotify = function (txt) {
    return '"' + ("" + txt).replace(new RegExp('"', 'gi'), '\\"') + '"';
  };

  sys.debug.stringifyMaxLevel = 2;
  sys.debug.stringify = function (anyzin, levelBrute) {
    var level = levelBrute || 1;
    if (level > sys.debug.stringifyMaxLevel) {
      return '"Too deep"';
    }
    if (typeof anyzin === "undefined") {
      return "undefined";
    }
    if (typeof anyzin === "number") {
      return String(anyzin);
    }
    if (typeof anyzin === "string") {
      return sys.debug.quotify(anyzin);
    }
    if (typeof anyzin === "function") {
      return "Function::" + sys.debug.quotify(anyzin.toString());
    }
    if (Array.isArray(anyzin)) {
      var out = "[";
      for (var i = 0; i < anyzin.length; i++) {
        if (i !== 0) {
          out += ",";
        }
        if (level > 1) {
          out += sys.debug.quotify(typeof anyzin[i]);
        } else {
          out += sys.debug.stringify(anyzin[i], level + 1);
        }
      }
      out += "]";
      return out;
    }
    if (typeof anyzin === "object") {
      var isJava = sys.reflection.isJavaObject(anyzin);
      var out = "{";
      var keys = Object.keys(anyzin);
      for (var i = 0; i < keys.length; i++) {
        if (i !== 0) {
          out += ",";
        }
        out += sys.debug.quotify(keys[i]);
        out += ":";
        if ((level > 1) || isJava) {
          out += sys.debug.quotify(typeof anyzin[keys[i]]);
        } else {
          out += sys.debug.stringify(anyzin[keys[i]], level + 1);
        }
      }
      out += "}";
      return out;
    }
    if (typeof anyzin === "boolean") {
      return String(anyzin);
    }
  };

  sys.debug.view = function (data, number) {
    var msg = '';
    msg += 'LswDebugger.global.debug(';
    msg += sys.debug.stringify(data);
    msg += ')';
    evaluateByBrowser(msg);
  };

  sys.debug.textify = function (data) {
    var msg = '';
    msg += 'LswDebugger.global.debug(';
    msg += sys.debug.quotify(data);
    msg += ')';
    evaluateByBrowser(msg);
  };

} catch (error) {
  evaluateByBrowser("alert('" + error.message.replace(/"/g, "") + '")');
}


try {
  var File = abg.getClass("java.io.File");
  // sys.debug.view(File);
  var file = sys.reflection.instantiate("java.io.File", ["java.lang.String"], ["/path/to"]);
  var path = file.getAbsolutePath();
  sys.debug.view(path);
} catch (error) {
  sys.debug.view(error);
}

`.trim());

LswConstants.global.define("/kernel/android/api/bindings.js", `

LswAndroid.hablar = function(msg) {
    LswAndroid.eval('sys.tts.hablar(' + JSON.stringify(msg) + ')');
};

`.trim());
