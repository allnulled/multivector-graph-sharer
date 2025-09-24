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