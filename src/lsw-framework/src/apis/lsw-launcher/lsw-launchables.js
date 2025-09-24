// @code.start: LswLauncher global registry | @section: Lsw Launcher API » LswLauncher global registry

LswLauncher.global.register("dia", "🕓 Ahora", (launchable) => LswLauncher.openDialog('<lsw-agenda context="calendario" />', launchable.name));
LswLauncher.global.register("base-de-datos", "📦 Base de datos", (launchable) => LswLauncher.openDialog('<lsw-database-explorer/>', launchable.name));
LswLauncher.global.register("sistema-de-ficheros", "📂 Sistema de ficheros", (launchable) => LswLauncher.openDialog('<lsw-filesystem-explorer />', launchable.name));
LswLauncher.global.register("binarios", "💣 Binarios", (launchable) => LswLauncher.openDialog('<lsw-bin-directory />', launchable.name));
LswLauncher.global.register("calendario", "📆 Calendario", (launchable) => LswLauncher.openDialog('<lsw-agenda />', launchable.name));
LswLauncher.global.register("notas", "💬 Notas", (launchable) => LswLauncher.openDialog('<lsw-spontaneous-table-nota />', launchable.name));
LswLauncher.global.register("nueva-nota", "💬➕ Nueva nota", (launchable) => LswLauncher.openDialog('<lsw-spontaneous-form-nota />', launchable.name));
LswLauncher.global.register("enciclopedia", "🔬 Enciclopedia", (launchable) => LswLauncher.openDialog('<lsw-wiki />', launchable.name));
LswLauncher.global.register("nuevo-artículo", "🔬➕ Nuevo artículo", (launchable) => LswLauncher.openDialog('<lsw-spontaneous-form-articulo />', launchable.name));
LswLauncher.global.register("inspector-de-js", "🪲 Inspector de JS", (launchable) => LswLauncher.openDialog('<lsw-js-inspector />', launchable.name));
LswLauncher.global.register("consola-de-js", "💻 Consola de JS", () => LswConsoleHooker.toggleConsole());
LswLauncher.global.register("datos-volátiles", "♨️ Datos volátiles", (launchable) => LswLauncher.openDialog('<lsw-volatile-ui />', launchable.name));
LswLauncher.global.register("tests-de-aplicación", "✅ Tests de aplicación", (launchable) => LswLauncher.openDialog('<lsw-tests-page />', launchable.name));
LswLauncher.global.register("emojis-picker", "🐱 Emojis", (launchable) => LswLauncher.openDialog('<lsw-emojis-picker />', launchable.name));
LswLauncher.global.register("trackeables", "📹 Trackeables", (launchable) => LswLauncher.openDialog('<lsw-event-tracker />', launchable.name));
LswLauncher.global.register("diario", "📖 Diario", (launchable) => LswLauncher.openDialog('<lsw-diario />', launchable.name));
LswLauncher.global.register("ecuaciones", "√ Ecuaciones", (launchable) => LswLauncher.openDialog('<lsw-equation-solver />', launchable.name));
LswLauncher.global.register("moléculas", "⚛️ Moléculas", (launchable) => LswLauncher.openDialog('<lsw-molecules-renderer />', launchable.name));
LswLauncher.global.register("diagramas", "↔️ Diagramas", (launchable) => LswLauncher.openDialog('<lsw-mermaid-viewer />', launchable.name));
LswLauncher.global.register("sintaxis", "🔠 Sintaxis", (launchable) => LswLauncher.openDialog('<lsw-syntax-builder />', launchable.name));
LswLauncher.global.register("pinturas", "🎨 Pinturas", (launchable) => LswLauncher.openDialog('<lsw-painter />', launchable.name));
LswLauncher.global.register("graficas", "📈 Constructor de gráficas", (launchable) => LswLauncher.openDialog('<lsw-chart-builder />', launchable.name));
LswLauncher.global.register("nueva-feature", "✨ Nueva feature", (launchable) => LswLauncher.openDialog('<lsw-nueva-feature />', launchable.name));
LswLauncher.global.register("configuraciones", "🔧 Configuraciones", (launchable) => LswLauncher.openDialog('<lsw-configurations-page />', launchable.name));
// Últimos - vinculados al DGN-CMS y no apps independientes:
LswLauncher.global.register("rest-homepage", "📦 Datos en línea", (launchable) => LswLauncher.openDialog('<dgn-rest-homepage />', launchable.name));
LswLauncher.global.register("filesystem-homepage", "📂 Ficheros en línea", (launchable) => LswLauncher.openDialog('<dgn-filesystem-homepage />', launchable.name));
LswLauncher.global.register("chat", "💬 Chat en línea", (launchable) => LswLauncher.openDialog('<dgn-chat-homepage />', launchable.name));
LswLauncher.global.register("login-homepage", "🔑 Identificación en línea", (launchable) => DgnLoginManager.global.askForToken());

// @code.end: LswLauncher global registry