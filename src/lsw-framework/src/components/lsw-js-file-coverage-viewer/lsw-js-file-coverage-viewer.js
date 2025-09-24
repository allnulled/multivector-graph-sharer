/*
// @code.start: LswJsFileCoverageViewer API | @$section: Vue.js (v2) Components » Lsw SchemaBasedForm API » LswJsFileCoverageViewer component
Vue.component("LswJsFileCoverageViewer", {
  template: $ template,
  props: {
    source: {
      type: String,
      required: true,
    },
    coverage: {
      type: [Object, Boolean],
      default: () => false,
    },
  },
  data() {
    this.$trace("lsw-js-file-coverage-viewer.data");
    return {
      isLoaded: false,
      isExpanded: false,
      beautifiedSource: false,
    };
  },
  methods: {
    toggleExpansion() {
      this.$trace("lsw-js-file-coverage-viewer.methods.toggleExpansion");
      this.isExpanded = !this.isExpanded;
    },
    async load() {
      this.$trace("lsw-js-file-coverage-viewer.methods.load");
      await LswLazyLoads.loadHighlightJs();
      await LswLazyLoads.loadBeautifier();
      try {
        this.beautifiedSource = beautifier.js(this.source);
      } catch (error) {
        // @BADLUCK!
        this.beautifiedSource = this.source;
      } finally {
        this.isLoaded = true;
      }
      this.$nextTick(() => {
        hljs.highlightElement(this.$refs.sourceTag);
      });
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-js-file-coverage-viewer.mounted");
      await this.load();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswJsFileCoverageViewer API
//*/

Vue.component("LswJsFileCoverageViewer", {
  template: $template,
  props: {
    source: String,
    coverage: Object,
  },
  data() {
    return {
      ast: this.coverage,
      lines: this.source.split("\n"),
    };
  },
  computed: {
    statementHits() {
      const hits = {};
      for (const [id, stmt] of Object.entries(this.ast.statementMap)) {
        const line = stmt.start.line;
        hits[line] = hits[line] || [];
        hits[line].push({
          type: "statement",
          hit: this.ast.s[id] > 0,
          loc: stmt,
          id,
        });
      }
      return hits;
    },
    functionHits() {
      const hits = {};
      for (const [id, fn] of Object.entries(this.ast.fnMap)) {
        const line = fn.decl.start.line;
        hits[line] = hits[line] || [];
        hits[line].push({
          type: "function",
          hit: this.ast.f[id] > 0,
          name: fn.name,
          id,
        });
      }
      return hits;
    },
    branchHits() {
      const hits = {};
      for (const [id, branch] of Object.entries(this.ast.branchMap)) {
        branch.locations.forEach((loc, i) => {
          const line = loc.start.line;
          hits[line] = hits[line] || [];
          hits[line].push({
            type: "branch",
            hit: this.ast.b[id][i] > 0,
            kind: branch.type,
            id,
            index: i,
          });
        });
      }
      return hits;
    },
  },
  methods: {
    isLineHit(line) {
      // Consideramos línea cubierta si tiene algún statement/function/branch cubierto
      const s = this.statementHits[line] || [];
      const f = this.functionHits[line] || [];
      const b = this.branchHits[line] || [];

      return [...s, ...f, ...b].some(item => item.hit);
    },
    decorateLine(line, content) {
      const hits = [
        ...(this.statementHits[line] || []),
        ...(this.functionHits[line] || []),
        ...(this.branchHits[line] || []),
      ];

      if (hits.length === 0) {
        return this.escapeHtml(content);
      }

      // Para cada tipo, envolvemos el texto con spans con clases específicas y tooltips
      let decorated = this.escapeHtml(content);
      hits.forEach(hit => {
        const className = `${hit.type}-marker ${hit.hit ? 'hit' : 'miss'}`;
        const tooltip = this.getTooltipText(hit);
        // Marcador simple con tooltip - tú luego aplicarás el estilo
        decorated = `<span class="${className}" title="${tooltip}">${decorated}</span>`;
      });

      return decorated;
    },
    getTooltipText(hit) {
      if (hit.type === 'statement') {
        return `Statement ${hit.id}: ${hit.hit ? 'Ejecutado' : 'No ejecutado'}`;
      } else if (hit.type === 'function') {
        return `Función ${hit.name || hit.id}: ${hit.hit ? 'Ejecutada' : 'No ejecutada'}`;
      } else if (hit.type === 'branch') {
        return `Branch ${hit.id}[${hit.index}] (${hit.kind}): ${hit.hit ? 'Tomado' : 'No tomado'}`;
      }
      return '';
    },
    escapeHtml(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    },
    showLineInfo(line) {
      this.$lsw.toasts.send({
        title: `Usos de línea ${line}`,
        text: this.getCoverageByLine(line, this.ast, true),
      });
      this.$lsw.toasts.collapse(this.getCoverageByLine(line, this.ast, false), 5000);
    },
    getCoverageByLine(line, ast, summarized = false) {
      const statements = [];
      const functions = [];
      const branches = [];
      const statementRows = Object.entries(ast.statementMap);
      for(let statementIndex=0; statementIndex<statementRows.length; statementIndex++) {
        const row = statementRows[statementIndex];
        const [id, loc] = row;
        if(loc.start.line === (line + 1)) {
          statements.push({
            id,
            loc,
            hits: ast.s[id],
          });
        }
      }
      const functionRows = Object.entries(ast.fnMap);
      for(let functionIndex=0; functionIndex<functionRows.length; functionIndex++) {
        const row = functionRows[functionIndex];
        const [id, fn] = row;
        if(fn.decl.start.line === (line + 1)) {
          functions.push({
            id,
            name: fn.name,
            hits: ast.f[id],
          });
        }
      }
      const branchRows = Object.entries(ast.branchMap);
      for(let branchIndex=0; branchIndex<branchRows.length; branchIndex++) {
        const row = branchRows[branchIndex];
        const [id, branch] = row;
        branch.locations.forEach((loc, indexLoc) => {
          if(loc.start.line === (line + 1)) {
            branches.push({
              id,
              loc,
              hits: ast.b[id],
              index: indexLoc,
              kind: branch.type,
              loc,
            });
          }
        })
      }
      const stats = { statements, functions, branches };
      if(!summarized) {
        return stats;
      }
      let S = 0, F = 0, B = 0;
      stats.statements.forEach(st => {
        if(typeof st.hits === "number") {
          S += st.hits;
        } else if(Array.isArray(st.hits)) {
          st.hits.forEach(subst => {
            if(typeof subst === "number") {
              S += subst;
            }
          });
        }
      });
      stats.functions.forEach(st => {
        if(typeof st.hits === "number") {
          F += st.hits;
        } else if(Array.isArray(st.hits)) {
          st.hits.forEach(subst => {
            if(typeof subst === "number") {
              F += subst;
            }
          });
        }
      });
      stats.branches.forEach(st => {
        if(typeof st.hits === "number") {
          B += st.hits;
        } else if(Array.isArray(st.hits)) {
          st.hits.forEach(subst => {
            if(typeof subst === "number") {
              B += subst;
            }
          });
        }
      });
      const summary = {
        Sentencias: S,
        Funciones: F,
        Brancas: B
      };
      return summary;
    }
  },
});