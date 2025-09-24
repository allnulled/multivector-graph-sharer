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