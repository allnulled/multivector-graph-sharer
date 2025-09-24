const basepath = require("path").resolve(__dirname + "/../../../src");

module.exports = [
  // 1. El preboot:
  `${basepath}/bootloader/preboot.js`,
  // 2. El framework:
  `${basepath}/lsw-framework/lsw-framework.css`,
  `${basepath}/lsw-framework/lsw-framework.js`,
  // 3. Las librerías de terceros imprescindibles solamente:
  // 4. El payload de la app:
  `${basepath}/modules/app/load.js`,
  // 5. El payload personalizado:
  `${basepath}/modules/org.dgn.app/load.js`,
  // 7. El runner:
  `${basepath}/bootloader/runner.js`,
];