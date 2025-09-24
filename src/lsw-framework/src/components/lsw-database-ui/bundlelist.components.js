const { resolve } = require(__dirname + "/bundler.utils.js");

module.exports = [
  __dirname + "/database-explorer/database-explorer",
  __dirname + "/database-breadcrumb/database-breadcrumb",
  __dirname + "/page-databases/page-databases",
  __dirname + "/page-row/page-row",
  __dirname + "/page-rows/page-rows",
  __dirname + "/page-schema/page-schema",
  __dirname + "/page-tables/page-tables",
  // __dirname + "/lsw-table-transformers/lsw-table-transformers",
];