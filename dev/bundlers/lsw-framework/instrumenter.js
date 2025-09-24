const fs = require("fs");
const path = require("path");
const projectDir = path.resolve(__dirname + "/../../..");
const basepath = path.resolve(projectDir + "/src");
const baseDir = path.resolve(__dirname + "/../../../src");
const beautifier = require(`${projectDir}/src/assets/lib/beautifier/beautifier.js`);
const baseDirD = baseDir + "/";
// const instrumentedDir = path.resolve(__dirname + "/../../../src-instrumented");
const instrumentedDir = path.resolve(__dirname + "/../../../src-instrumented");
const instrumenter = require("istanbul-lib-instrument").createInstrumenter();
const TARGET_FILES = [
  `${basepath}/lsw-framework/src/apis/lsw-dom/lsw-vue2.js`,
];

fs.writeFileSync(projectDir + "/devinstrumented.txt", "", "utf8");

const Instrumenter = class {

  static $acceptAllFiles() {
    return true;
  }

  static $debug(...msg) {
    console.log(...msg);
  }

  static $regexForjsFiles = /\.js$/g;

  static instrumentalizeFile(fileBrute, deactivate = false) {
    console.log("[instrumenter][trace] Instrumenter.instrumentalizeFile");
    if(deactivate) {
      return fileBrute;
    }
    const originalFile = path.resolve(fileBrute);
    if (!originalFile.endsWith(".js")) {
      return false;
    }
    const [fileInstr, fileClone] = this.getInstrumentedPathsFrom(originalFile);
    const file = fileClone;
    require("fs-extra").ensureFileSync(fileClone);
    this.$debug(`COPIANDO ${originalFile} A ${fileClone}`);
    fs.copyFileSync(originalFile, fileClone);
    Securizadores: {
      // Si la entrada no empieza por baseDir:
      if (!originalFile.startsWith(baseDirD)) {
        throw new Error(`Method «instrumentalizeFile» cannot accept input paths «${originalFile}» not starting with «${baseDirD}»`);
      }
      // Si la salida no empieza por instrumentedDir:
      if (!fileInstr.startsWith(instrumentedDir)) {
        throw new Error(`Method «instrumentalizeFile» cannot accept output paths «${fileInstr}» not starting with «${instrumentedDir}»`);
      }
      // Si la salida empieza por baseDir:
      if (fileInstr.startsWith(baseDirD)) {
        throw new Error(`Method «instrumentalizeFile» cannot accept output paths «${fileInstr}» starting with «${baseDirD}»`);
      }
      // Si la entrada y la salida son iguales:
      if (file === fileInstr) {
        throw new Error(`I dont care if this method is logically unreachable, they wont get dropped them (1)`);
      }
    }
    this.$debug(`INSTRUMENTANDO ${originalFile} EN ${fileInstr}`);
    const msg = `npx nyc instrument --compact false\n  '${originalFile}'\n  '${fileInstr}'`;
    fs.appendFileSync(projectDir + "/devinstrumented.txt", originalFile + "\n--> " + fileInstr + "\n", "utf8");
    console.log(`[cmd] ${msg}`);
    const originalSource = fs.readFileSync(fileClone).toString();
    const instrumentedSource = instrumenter.instrumentSync(originalSource, originalFile);
    const instrumentedSourceBeautified = beautifier.js(instrumentedSource);
    fs.writeFileSync(fileInstr, instrumentedSourceBeautified, "utf8");
    return fileInstr;
  }

  static instrumentSet(allFiles, options = {}) {
    console.log("[instrumenter][trace] Instrumenter.instrumentSet");
    const finalFiles = [];
    const fileFilter = options.fileFilter || this.$acceptAllFiles;
    Iterate_files:
    for (let indexFile = 0; indexFile < allFiles.length; indexFile++) {
      const relativeFile = allFiles[indexFile];
      const file = path.resolve(relativeFile);
      Securizadores: {
        // Si pasa el filtro paramétrico:
        const isAccepted = fileFilter(file);
        // Si es un fichero objetivo de la instrumentalización de código:
        const isTarget = options.instrumentedFiles.indexOf(file) !== -1;
        // Si se cumplen las 2 anteriores:
        if (isAccepted && isTarget) {
          // Instruméntalo y apendiza el instrumentado:
          console.log(1, 1, file);
          const instrumentedFile = this.instrumentalizeFile(file);
          finalFiles.push(instrumentedFile);
        } else {
          // Si no: apendiza normal
          console.log(isAccepted ? 1 : 0, isTarget ? 1 : 0, file);
          finalFiles.push(file);
        }
      }
    }
    return finalFiles;
  }

  static getInstrumentedPathsFrom(filepath) {
    console.log("[instrumenter][trace] Instrumenter.getInstrumentedPathsFrom");
    const ficheroOriginal = path.resolve(filepath);
    if (!ficheroOriginal.startsWith(baseDirD)) {
      throw new Error(`Method «getInstrumentedPathsFrom» only accepts paths starting with «${baseDirD}»`);
    }
    const ficheroClon = path.resolve(ficheroOriginal.replace(baseDir, baseDir + "-instrumented"));
    const ficheroInstrumentado = ficheroClon.replace(/\.js$/g, ".instr.js");
    const areSame = ficheroOriginal === ficheroClon;
    Securizadores: {
      // Si son el mismo fichero: lanza error
      if (areSame) {
        throw new Error("Danger because this operation could damage your sources! Source and destination paths are the same on «getInstrumentedPathsFrom»");
      }
      // Si la salida no empieza por instrumentedDir: lanza error
      if (!ficheroClon.startsWith(instrumentedDir)) {
        throw new Error(`I dont care if this method is logically unreachable, they wont get dropped them (2)`);
      }
      if (!ficheroInstrumentado.startsWith(instrumentedDir)) {
        throw new Error(`I dont care if this method is logically unreachable, they wont get dropped them (3)`);
      }
      if (!ficheroInstrumentado.endsWith(".instr.js")) {
        throw new Error(`I dont care if this method is logically unreachable, they wont get dropped them (4)`);
      }
    }
    return [ficheroInstrumentado, ficheroClon];
  }

}

module.exports = Instrumenter;