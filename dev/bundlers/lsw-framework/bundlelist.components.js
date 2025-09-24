// 0. Settings section:
const settings = require(__dirname + "/bundlesettings.js");

// 1. Includes:
const path = require("path");
const basepath = path.resolve(__dirname + "/../../../src");
const Instrumenter = require(__dirname + "/instrumenter.js");
const ignoredFiles = [];
const instrumentedFiles = [
  `${basepath}/lsw-framework/src/apis/lsw-dom/lsw-vue2.js`,
  `${basepath}/lsw-framework/src/apis/lsw-ensurer/ensure.js`,
];

// 2. Files to bundle:
module.exports = Instrumenter.instrumentSet([
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // FRAMEWORK:
  `${basepath}/lsw-framework/src/styles/lsw-styling-structure.css`,
  `${basepath}/lsw-framework/src/styles/lsw-styling-theme.css`,
  `${basepath}/lsw-framework/src/styles/lsw-styling-framework.css`,
  // VUE2:
  `${basepath}/lsw-framework/src/others/vue/vue2.min.js`,
  // VUE2 SORTABLE & DRAGGABLE:
  `${basepath}/lsw-framework/src/others/vue.draggable/sortable.js`,
  `${basepath}/lsw-framework/src/others/vue.draggable/vue.draggable.js`,
  // SOCKET.IO:
  `${basepath}/lsw-framework/src/others/socket.io-client/socket.io-client.js`,
  // MARKED.JS:
  `${basepath}/assets/lib/marked/marked.js`,
  // KATEX:
  `${basepath}/assets/lib/katex/katex.js`,
  `${basepath}/assets/lib/katex/katex.css`,
  `${basepath}/assets/lib/katex/marked-katex-extension.js`,
  // MERMAID:
  `${basepath}/assets/lib/mermaid/mermaid.js`,
  // `${basepath}/assets/lib/mermaid/mermaid.min.js`,
  `${basepath}/assets/lib/mermaid/mermaid.initializer.js`,
  // LSW INITIALIZATION
  `${basepath}/bootloader/initialization.js`,
  // IMPORTER:
  `${basepath}/lsw-framework/src/apis/lsw-importer/importer.js`,
  // LSW ERROR MANAGER:
  `${basepath}/lsw-framework/src/apis/lsw-error-manager/lsw-error-manager.js`,
  // LSW RELOADER:
  `${basepath}/lsw-framework/src/apis/lsw-reloader/reloadable.js`,
  // LSW ENSURER:
  `${basepath}/lsw-framework/src/apis/lsw-ensurer/ensure.js`,
  // LSW ASSERTER:
  `${basepath}/lsw-framework/src/apis/lsw-asserter/lsw-asserter.js`,
  // LSW TEST CONTEXT:
  `${basepath}/lsw-framework/src/apis/lsw-test-context/lsw-test-context.js`,
  // LSW CONSTANTS:
  `${basepath}/lsw-framework/src/apis/lsw-constants/lsw-constants.js`,
  `${basepath}/lsw-framework/src/apis/lsw-constants/global-constants.js`,
  // LSW LAZY LOADER:
  `${basepath}/lsw-framework/src/apis/lsw-lazy-loader/lsw-lazy-loader.js`,
  `${basepath}/lsw-framework/src/apis/lsw-lazy-loader/lazy-loads.js`,
  // LSW TREE PARSER:
  `${basepath}/lsw-framework/src/apis/lsw-tree-parser/tripilang.parser.js`,
  `${basepath}/lsw-framework/src/apis/lsw-tree-parser/lsw-tree-parser.js`,
  // LSW TESTER:
  `${basepath}/lsw-framework/src/apis/lsw-tester/lsw-tester.js`,
  // `${basepath}/lsw-framework/src/apis/lsw-tester/lsw-test-registry.js`,
  // `${basepath}/lsw-framework/src/apis/lsw-tester/lsw-tests.js`,
  `${basepath}/lsw-framework/src/components/new-canvas-experiment-1/new-canvas-experiment-1`,
  // LSW DOM:
  `${basepath}/lsw-framework/src/apis/lsw-dom/lsw-dom.js`,
  `${basepath}/lsw-framework/src/apis/lsw-dom/lsw-dom-irruptor.js`,
  // LSW VUE2:
  `${basepath}/lsw-framework/src/apis/lsw-dom/lsw-vue2.js`,
  // LSW PROXIFIER:
  `${basepath}/lsw-framework/src/apis/lsw-proxifier/proxifier.unbundled.js`,
  // LSW RANDOMIZER:
  `${basepath}/lsw-framework/src/apis/lsw-randomizer/lsw-randomizer.js`,
  // LSW AGENDA RANDOMIZER:
  `${basepath}/lsw-framework/src/apis/lsw-agenda-randomizer/lsw-agenda-randomizer.js`,
  `${basepath}/lsw-framework/src/apis/lsw-agenda-randomizer/lsw-agenda-randomizer-reglas.js`,
  // LSW ASYNCIRCUIT:
  `${basepath}/lsw-framework/src/apis/lsw-circuiter/async-circuit.js`,
  // LSW COMMANDER:
  `${basepath}/lsw-framework/src/apis/lsw-commander/url-command.js`,
  // LSW TRIGGER:
  `${basepath}/lsw-framework/src/apis/lsw-trigger/triggers-class.js`,
  // LSW DATABASE:
  `${basepath}/lsw-framework/src/apis/lsw-database/browsie.unbundled.js`,
  `${basepath}/lsw-framework/src/apis/lsw-database-query-language/browsie-script.js`,
  `${basepath}/lsw-framework/src/apis/lsw-database-query-language/lsw-database-query-language.js`,
  // LSW LOGGER:
  `${basepath}/lsw-framework/src/apis/lsw-logger/superlogger.unbundled.js`,
  // LSW RETURNER:
  `${basepath}/lsw-framework/src/apis/lsw-returner/controlled-function.js`,
  // LSW STORE:
  `${basepath}/lsw-framework/src/apis/lsw-store/dist/store.unbundled.js`,
  // LSW TIMER:
  `${basepath}/lsw-framework/src/apis/lsw-timer/lsw-timer.bundled.js`,
  // LSW TEMPORIZER:
  `${basepath}/lsw-framework/src/apis/lsw-temporizer/lsw-temporizer.js`,
  // LSW INTRUDER:
  `${basepath}/lsw-framework/src/apis/lsw-intruder/lsw-intruder.js`,
  // LSW CYCLER:
  `${basepath}/lsw-framework/src/apis/lsw-cycler/lsw-cycler.js`,
  // LSW LIFECYCLE:
  `${basepath}/lsw-framework/src/apis/lsw-lifecycle/lsw-lifecycle.js`,
  // LSW COMPROMISER:
  `${basepath}/lsw-framework/src/apis/lsw-compromiser/lsw-compromiser.js`,
  // LSW UTILS:
  `${basepath}/lsw-framework/src/apis/lsw-utils/lsw-utils.js`,
  // LSW FILESYSTEM:
  `${basepath}/lsw-framework/src/apis/lsw-filesystem/ufs-v1.0.2.js`,
  `${basepath}/lsw-framework/src/apis/lsw-filesystem/lsw-filesystem.unbundled.js`,
  // LSW SCHEMA:
  `${basepath}/lsw-framework/src/apis/lsw-schema/lsw-schema.js`,
  // LSW CLASS REGISTER:
  `${basepath}/lsw-framework/src/apis/lsw-class-register/lsw-class-register.js`,
  // LSW DATABASE VIRTUALIZER:
  `${basepath}/lsw-framework/src/apis/lsw-database-virtualizer/lsw-database-virtualizer.js`,
  // `${basepath}/lsw-framework/src/apis/lsw-database-adapter/LswDatabaseAdapter.js`, // Por si se requiere pero en principio no y debe eliminarse
  // LSW DEPENDER:
  `${basepath}/lsw-framework/src/apis/lsw-depender/lsw-depender.js`,
  // LSW ERROR HANDLER:
  `${basepath}/lsw-framework/src/apis/lsw-error-handler/lsw-error-handler.js`,
  // LSW BACKUPER:
  `${basepath}/lsw-framework/src/apis/lsw-backuper/lsw-backuper.js`,
  // LSW TYPER:
  `${basepath}/lsw-framework/src/apis/lsw-typer/lsw-typer.js`,
  // LSW BOOKS:
  `${basepath}/lsw-framework/src/apis/lsw-books/lsw-books.js`,
  // LSW MARKDOWN:
  `${basepath}/lsw-framework/src/apis/lsw-markdown/lsw-markdown.js`,
  // LSW DATABASE-UI:
  `${basepath}/lsw-framework/src/components/lsw-database-ui/database-adapter/LswDatabaseAdapter.js`,
  // LAUNCHER:
  `${basepath}/lsw-framework/src/apis/lsw-launcher/lsw-launcher.js`,
  `${basepath}/lsw-framework/src/apis/lsw-launcher/lsw-launchables.js`,
  // DIRECTIVE V-DESCRIPTOR:
  `${basepath}/lsw-framework/src/directives/v-descriptor/v-descriptor.js`,
  // DIRECTIVE V-FOCUS:
  `${basepath}/lsw-framework/src/directives/v-focus/v-focus.js`,
  // DIRECTIVE V-XFORM:
  `${basepath}/lsw-framework/src/directives/v-xform/v-xform.js`,
  // `${basepath}/lsw-framework/src/directives/v-form/v-form.js`, // Por si se requiere pero en principio no y debe eliminarse
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // HOMEPAGE:
  `${basepath}/lsw-framework/src/components/lsw-homepage/lsw-homepage`,
  // SOURCEABLE:
  `${basepath}/lsw-framework/src/components/lsw-sourceable/lsw-sourceable`,
  // TYPICAL TITLE:
  `${basepath}/lsw-framework/src/components/lsw-typical-title/lsw-typical-title`,
  // KEYBOARDS:
  `${basepath}/lsw-framework/src/components/lsw-keyboard-1/lsw-keyboard-1`,
  `${basepath}/lsw-framework/src/components/lsw-keyboard-1/lsw-keyboard-1-text/lsw-keyboard-1-text`,
  // LSW DEBUGGER:
  `${basepath}/lsw-framework/src/components/lsw-debugger/lsw-debugger.api.js`,
  `${basepath}/lsw-framework/src/components/lsw-debugger/lsw-debugger`,
  // LSW SQLITE CONSOLE:
  `${basepath}/lsw-framework/src/components/lsw-sqlite-console/lsw-sqlite-console`,
  `${basepath}/lsw-framework/src/components/lsw-sqlite-explorer/lsw-sqlite-explorer`,
  // COVERAGE:
  `${basepath}/lsw-framework/src/components/lsw-coverage-viewer/lsw-coverage-viewer`,
  `${basepath}/lsw-framework/src/components/lsw-js-file-coverage-viewer/lsw-js-file-coverage-viewer`,
  // EMOJIS PICKER:
  `${basepath}/lsw-framework/src/components/lsw-emojis-picker/lsw-emojis-picker`,
  // CLOCKTIME PICKER:
  `${basepath}/lsw-framework/src/components/lsw-clocktime-picker/lsw-clocktime-picker`,
  // CALENDARIO:
  `${basepath}/lsw-framework/src/components/lsw-calendario/lsw-calendario`,
  // TABLE:
  `${basepath}/lsw-framework/src/components/lsw-table/lsw-table/lsw-table`,
  `${basepath}/lsw-framework/src/components/lsw-table/lsw-table-transformers/lsw-table-transformers`,
  // CODE VIEWER:
  `${basepath}/lsw-framework/src/components/lsw-code-viewer/lsw-code-viewer`,
  // DATA EXPLORER:
  `${basepath}/lsw-framework/src/components/lsw-data-explorer/lsw-data-explorer/lsw-data-explorer`,
  `${basepath}/lsw-framework/src/components/lsw-data-explorer/lsw-data-implorer/lsw-data-implorer`,
  // DATA PRINTER:
  `${basepath}/lsw-framework/src/components/lsw-data-printer-button/lsw-data-printer-button`,
  `${basepath}/lsw-framework/src/components/lsw-data-printer-report/lsw-data-printer-report`,
  // DIALOGS:
  `${basepath}/lsw-framework/src/components/lsw-dialogs/lsw-dialogs`,
  // LOADING BAR:
  `${basepath}/lsw-framework/src/components/lsw-loading-bar/lsw-loading-bar`,
  // VOLATILE DATABASE:
  `${basepath}/lsw-framework/src/components/lsw-volatile-db/lsw-volatile-db.js`,
  `${basepath}/lsw-framework/src/components/lsw-volatile-db/components/lsw-volatile-ui/lsw-volatile-ui`,
  // WINDOWS AND PROCESSES:
  `${basepath}/lsw-framework/src/components/lsw-windows/lsw-windows-main-tab/lsw-windows-main-tab`,
  `${basepath}/lsw-framework/src/components/lsw-windows/lsw-windows-viewer/lsw-windows-viewer`,
  `${basepath}/lsw-framework/src/components/lsw-windows/lsw-windows-pivot-button/lsw-windows-pivot-button`,
  // TOASTS:
  `${basepath}/lsw-framework/src/components/lsw-toasts/lsw-toasts`,
  // NATY-SCRIPT:
  `${basepath}/lsw-framework/src/components/lsw-naty-script/naty-script.api.js`,
  `${basepath}/lsw-framework/src/components/lsw-naty-script/naty-script-parser.js`,
  // CONSOLE HOOKER:
  `${basepath}/lsw-framework/src/components/lsw-console-hooker/console-hooker-api.js`,
  `${basepath}/lsw-framework/src/components/lsw-console-hooker/console-hooker`,
  // DATABASE:
  `${basepath}/lsw-framework/src/components/lsw-database-ui/database-explorer/database-explorer`,
  `${basepath}/lsw-framework/src/components/lsw-database-ui/database-breadcrumb/database-breadcrumb`,
  `${basepath}/lsw-framework/src/components/lsw-database-ui/page-databases/page-databases`,
  `${basepath}/lsw-framework/src/components/lsw-database-ui/page-rows/page-rows`,
  `${basepath}/lsw-framework/src/components/lsw-database-ui/page-row/page-row`,
  `${basepath}/lsw-framework/src/components/lsw-database-ui/page-schema/page-schema`,
  `${basepath}/lsw-framework/src/components/lsw-database-ui/page-tables/page-tables`,
  // FILESYSTEM:
  `${basepath}/lsw-framework/src/components/lsw-filesystem-explorer/lsw-filesystem-explorer/lsw-filesystem-explorer`,
  `${basepath}/lsw-framework/src/components/lsw-filesystem-explorer/lsw-filesystem-buttons-panel/lsw-filesystem-buttons-panel`,
  `${basepath}/lsw-framework/src/components/lsw-filesystem-explorer/lsw-filesystem-editor/lsw-filesystem-editor`,
  `${basepath}/lsw-framework/src/components/lsw-filesystem-explorer/lsw-filesystem-treeviewer/lsw-filesystem-treeviewer`,
  // WIKI:
  `${basepath}/lsw-framework/src/components/lsw-wiki/lsw-wiki-libros/lsw-wiki-libros`,
  `${basepath}/lsw-framework/src/components/lsw-wiki/lsw-wiki-libro-viewer/lsw-wiki-libro-viewer`,
  `${basepath}/lsw-framework/src/components/lsw-wiki/lsw-wiki-articulos/lsw-wiki-articulos`,
  `${basepath}/lsw-framework/src/components/lsw-wiki/lsw-wiki-categorias/lsw-wiki-categorias`,
  `${basepath}/lsw-framework/src/components/lsw-wiki/lsw-wiki-articulo-viewer/lsw-wiki-articulo-viewer`,
  `${basepath}/lsw-framework/src/components/lsw-wiki/lsw-wiki-revistas/lsw-wiki-revistas`,
  `${basepath}/lsw-framework/src/components/lsw-wiki/lsw-wiki-tree/lsw-wiki-tree`,
  `${basepath}/lsw-framework/src/components/lsw-wiki/lsw-wiki-treenode/lsw-wiki-treenode`,
  `${basepath}/lsw-framework/src/components/lsw-wiki/lsw-wiki/lsw-wiki`,
  `${basepath}/lsw-framework/src/components/lsw-wiki/lsw-wiki-utils/lsw-wiki-utils.js`,
  `${basepath}/lsw-framework/src/components/lsw-book-factory/lsw-book-factory`,
  `${basepath}/lsw-framework/src/components/lsw-book-library/lsw-book-library`,
  // MARKDOWN VIEWER:
  `${basepath}/lsw-framework/src/components/lsw-markdown-viewer/lsw-markdown-viewer`,
  // CLOCKWATCHER:
  `${basepath}/lsw-framework/src/components/lsw-clockwatcher/lsw-clockwatcher`,
  // GOALS VIEWER:
  `${basepath}/lsw-framework/src/components/lsw-goals-viewer/lsw-goals-api.js`,
  `${basepath}/lsw-framework/src/components/lsw-goals-viewer/lsw-goals-viewer`,
  `${basepath}/lsw-framework/src/components/lsw-goals-records-viewer/lsw-goals-records-viewer`,
  // BIN DIRECTORY:
  `${basepath}/lsw-framework/src/components/lsw-bin-directory/lsw-bin-directory`,
  // EVENT TRACKER:
  `${basepath}/lsw-framework/src/components/lsw-event-tracker/lsw-event-tracker`,
  // SEARCH REPLACER:
  `${basepath}/lsw-framework/src/components/lsw-search-replacer/lsw-search-replacer`,
  // AGENDA:
  `${basepath}/lsw-framework/src/components/lsw-agenda/lsw-agenda/lsw-agenda`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-accion-add/lsw-agenda-accion-add`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-accion-search/lsw-agenda-accion-search`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-acciones-viewer/lsw-agenda-acciones-viewer`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-breadcrumb/lsw-agenda-breadcrumb`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-concepto-add/lsw-agenda-concepto-add`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-concepto-search/lsw-agenda-concepto-search`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-evento-search/lsw-agenda-evento-search`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-form/lsw-agenda-form`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-impresion-add/lsw-agenda-impresion-add`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-impresion-search/lsw-agenda-impresion-search`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-infraccion-search/lsw-agenda-infraccion-search`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-limitador-add/lsw-agenda-limitador-add`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-limitador-search/lsw-agenda-limitador-search`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-limitador-viewer/lsw-agenda-limitador-viewer`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-postimpresion-search/lsw-agenda-postimpresion-search`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-propagacion-search/lsw-agenda-propagacion-search`,
  `${basepath}/lsw-framework/src/components/lsw-agenda/components/lsw-agenda-propagador-search/lsw-agenda-propagador-search`,
  `${basepath}/lsw-framework/src/components/lsw-conductometria/lsw-conductometria`,
  `${basepath}/lsw-framework/src/components/lsw-conductometria/lsw-conductometria.api.js`,
  `${basepath}/lsw-framework/src/components/lsw-conductometria-report/lsw-conductometria-report`,
  `${basepath}/lsw-framework/src/components/lsw-conductometria-report/lsw-conductometria-report.api.js`,
  // FORMTYPES:
  `${basepath}/lsw-framework/src/components/lsw-formtypes/api/api.js`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-form-builder/lsw-form-builder`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/lsw-formtype`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/partials/lsw-control-label/lsw-control-label`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/partials/lsw-control-error/lsw-control-error`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/type/lsw-text-control/lsw-text-control`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/type/lsw-long-text-control/lsw-long-text-control`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/type/lsw-date-control/lsw-date-control`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/type/lsw-duration-control/lsw-duration-control`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/type/lsw-number-control/lsw-number-control`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/type/lsw-options-control/lsw-options-control`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/type/lsw-source-code-control/lsw-source-code-control`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/type/lsw-ref-object-control/lsw-ref-object-control`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/type/lsw-ref-object-by-label-control/lsw-ref-object-by-label-control`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/type/lsw-ref-list-control/lsw-ref-list-control`,
  `${basepath}/lsw-framework/src/components/lsw-formtypes/components/lsw-formtype/type/lsw-ref-relation-control/lsw-ref-relation-control`,
  // SCHEMA-BASED FORMS:
  `${basepath}/lsw-framework/src/components/lsw-schema-based-form/lsw-schema-based-form`,
  // BARS GRAPH:
  `${basepath}/lsw-framework/src/components/lsw-bars-graph/components/lsw-bars-graph-bar/lsw-bars-graph-bar`,
  `${basepath}/lsw-framework/src/components/lsw-bars-graph/lsw-bars-graph`,
  `${basepath}/lsw-framework/src/components/lsw-bars-graph/lsw-bars-graph.api.js`,
  // NOTAS:
  `${basepath}/lsw-framework/src/components/lsw-notes/lsw-notes`,
  `${basepath}/lsw-framework/src/components/lsw-configurations-page/lsw-configurations-page`,
  // BASIC DESKTOP COMPONENTS:
  `${basepath}/lsw-framework/src/components/lsw-home-top-panel/lsw-home-top-panel`,
  `${basepath}/lsw-framework/src/components/lsw-home-bottom-panel/lsw-home-bottom-panel`,
  `${basepath}/lsw-framework/src/components/lsw-desktop-bottom-panel/lsw-desktop-bottom-panel`,
  `${basepath}/lsw-framework/src/components/lsw-apps-viewer-button/lsw-apps-viewer-button`,
  `${basepath}/lsw-framework/src/components/lsw-apps-viewer-panel/lsw-apps-viewer-panel`,
  // PROTOLANG:
  `${basepath}/lsw-framework/src/apis/lsw-languages/protolang/protolang.js`,
  `${basepath}/lsw-framework/src/components/lsw-protolang-editor/lsw-protolang-editor`,
  // SPONTANEOUS FORMS & TABLES & CONTROLS:
  `${basepath}/lsw-framework/src/components/lsw-spontaneous-form-accion/lsw-spontaneous-form-accion`,
  `${basepath}/lsw-framework/src/components/lsw-spontaneous-form-articulo/lsw-spontaneous-form-articulo`,
  `${basepath}/lsw-framework/src/components/lsw-spontaneous-form-lista/lsw-spontaneous-form-lista`,
  `${basepath}/lsw-framework/src/components/lsw-spontaneous-form-nota/lsw-spontaneous-form-nota`,
  `${basepath}/lsw-framework/src/components/lsw-spontaneous-form-recordatorio/lsw-spontaneous-form-recordatorio`,
  `${basepath}/lsw-framework/src/components/lsw-spontaneous-table-accion/lsw-spontaneous-table-accion`,
  `${basepath}/lsw-framework/src/components/lsw-spontaneous-table-articulo/lsw-spontaneous-table-articulo`,
  `${basepath}/lsw-framework/src/components/lsw-spontaneous-table-lista/lsw-spontaneous-table-lista`,
  `${basepath}/lsw-framework/src/components/lsw-spontaneous-table-nota/lsw-spontaneous-table-nota`,
  `${basepath}/lsw-framework/src/components/lsw-spontaneous-table-recordatorio/lsw-spontaneous-table-recordatorio`,
  `${basepath}/lsw-framework/src/components/lsw-fast-datetime-control/lsw-fast-datetime-control`,
  // INLINE TAGS PICKER:
  `${basepath}/lsw-framework/src/components/lsw-inline-tags-picker/lsw-inline-tags-picker`,
  // JS INSPECTOR:
  `${basepath}/lsw-framework/src/components/lsw-js-inspector/lsw-js-inspector.api.js`,
  `${basepath}/lsw-framework/src/components/lsw-js-inspector/lsw-js-inspector`,
  // WEEK PLANNER:
  `${basepath}/lsw-framework/src/apis/lsw-languages/weeklang/weeklang.bundled.js`,
  `${basepath}/lsw-framework/src/components/lsw-week-planner/lsw-week-planner`,
  // MERMAID COMPONENT:
  `${basepath}/lsw-framework/src/components/lsw-mermaid-viewer/lsw-mermaid-viewer`,
  // PEGJS TESTER:
  `${basepath}/lsw-framework/src/components/lsw-pegjs-tester/lsw-pegjs-tester`,
  // NUEVA FEATURE:
  `${basepath}/lsw-framework/src/components/lsw-nueva-feature/lsw-nueva-feature`,
  // ERROR VIEWER:
  `${basepath}/lsw-framework/src/components/lsw-error-box/lsw-error-box`,
  `${basepath}/lsw-framework/src/components/lsw-syntax-error-viewer/lsw-syntax-error-viewer`,
  // TESTS PAGE:
  `${basepath}/lsw-framework/src/components/lsw-tests-page/lsw-tests-page`,
  `${basepath}/lsw-framework/src/components/lsw-tester-viewer/lsw-tester-viewer`,
  `${basepath}/lsw-framework/src/components/lsw-tester-module-viewer/lsw-tester-module-viewer`,
  `${basepath}/lsw-framework/src/components/lsw-test-context-viewer/lsw-test-context-viewer`,
  // DIARIO:
  `${basepath}/lsw-framework/src/components/lsw-diario/lsw-diario`,
  // JS VIEWER:
  `${basepath}/lsw-framework/src/components/lsw-js-viewer/lsw-js-viewer`,
  // ANDROID API:
  `${basepath}/lsw-framework/src/apis/lsw-android/lsw-android.js`,
  // EQUATION-SOLVER:
  `${basepath}/lsw-framework/src/components/lsw-equation-solver/lsw-equation-solver`,
  // MOLECULES-RENDERER:
  `${basepath}/lsw-framework/src/components/lsw-molecules-renderer/lsw-molecules-renderer`,
  // PAINTER:
  `${basepath}/lsw-framework/src/components/lsw-painter/lsw-painter`,
  // SIMPLE CHART:
  `${basepath}/lsw-framework/src/components/lsw-simple-chart/lsw-simple-chart`,
  // CHART-BUILDER:
  `${basepath}/lsw-framework/src/components/lsw-chart-builder/lsw-chart-builder`,
  // SYNTAX-BUILDER:
  `${basepath}/lsw-framework/src/components/lsw-syntax-builder/lsw-syntax-builder`,
  // NATYSCRIPT-EDITOR:
  `${basepath}/lsw-framework/src/components/lsw-naty-script/editor/lsw-naty-script-editor`,
  // DATABASE PROXIES:
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Accion.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Banco_de_datos_principal.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Accion_virtual.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Concepto.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Categoria_de_concepto.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Propagador_prototipo.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Propagador_de_concepto.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Limitador.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Impresion.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Nota.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Entrada_de_diario.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Automensaje.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Lista.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Recordatorio.js`,
  `${basepath}/lsw-framework/src/apis/lsw-proxies/Articulo.js`,
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // DGN FETCH
  `${basepath}/lsw-framework/src/apis/dgn-fetch/dgn-fetch.js`,
  // DGN LOGIN MANAGER
  `${basepath}/lsw-framework/src/apis/dgn-login-manager/dgn-login-manager.js`,
  // DGN CHAT UI
  `${basepath}/lsw-framework/src/components/dgn-chat-ui/dgn-chat-homepage/dgn-chat-homepage`,
  // DGN REST UI
  `${basepath}/lsw-framework/src/components/dgn-rest-ui/dgn-rest-homepage/dgn-rest-homepage`,
  `${basepath}/lsw-framework/src/components/dgn-rest-ui/dgn-rest-schema/dgn-rest-schema`,
  `${basepath}/lsw-framework/src/components/dgn-rest-ui/dgn-rest-table/dgn-rest-table`,
  `${basepath}/lsw-framework/src/components/dgn-rest-ui/dgn-rest-row/dgn-rest-row`,
  // DGN FILESYSTEM UI
  `${basepath}/lsw-framework/src/components/dgn-filesystem-ui/dgn-filesystem-homepage/dgn-filesystem-homepage`,
  `${basepath}/lsw-framework/src/components/dgn-filesystem-ui/dgn-filesystem-explorer/dgn-filesystem-explorer`,
  `${basepath}/lsw-framework/src/components/dgn-filesystem-ui/dgn-filesystem-editor/dgn-filesystem-editor`,
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // APIs Componente:
  `${basepath}/lsw-framework/src/lsw-api.js`,
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // APPLICATION:
  `${basepath}/modules/app/app`,
  // El boot:
  `${basepath}/bootloader/boot.js`,
  // El payload:
  `${basepath}/bootloader/framework-payload.js`,
], {
  instrumentedFiles,
  fileFilter: function (file) {
    const filepath = require("path").resolve(file);
    const isJs = file.endsWith(".js");
    if(!isJs) return false;
    let isAccepted = instrumentedFiles.indexOf(file) !== -1;
    let isIgnored = true;
    if(ignoredFiles.indexOf(filepath) === -1) {
      isIgnored = false;
    }
    return isAccepted && (!isIgnored);
  }
}, !settings.isInstrumenting);