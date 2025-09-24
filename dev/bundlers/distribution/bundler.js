// 1. Bundle components:
require(__dirname + "/../core/vuebundler.js").bundle({
  list: __dirname + "/bundlelist.components.js",
  module: true,
  id: "Litestarter_app",
  output: __dirname + "/../../../src/assets/distribution.js",
  ignore: [],
  packMode: "async-function",
});

// 2. Export assets, index and dist files to dist folder:
Exportar_carpetas_de_src_a_docs: {
  const utils = require(__dirname + "/../../utils/utils.js");
  utils.copyDirectorySync(__dirname + "/../../../src/assets", __dirname + "/../../../docs/assets");
  utils.copyDirectorySync(__dirname + "/../../../src/modules", __dirname + "/../../../docs/modules");
  // utils.copyDirectorySync(__dirname + "/../../../src/nodejs-assets", __dirname + "/../../../docs/nodejs-assets");
  utils.copyFilesOnlySync(__dirname + "/../../../src", __dirname + "/../../../docs");
}