Vue.component("LswCoverageViewer", {
  template: $template,
  data() {
    return {
      COVERAGE_TARGET_DIR: "/home/carlos/Escritorio/lsw-one/src/",
      coverageData: null,
      sourceCodeOf: {},
      selectedFiles: [],
    };
  },
  methods: {
    async selectFile(fileBrute) {
      const pos = this.selectedFiles.indexOf(fileBrute);
      const fileRelative = this.getPathRelativeToProject(fileBrute);
      if(pos === -1) {
        const contenido = await importer.text("assets/coverage/" + fileRelative);
        this.selectedFiles.push(fileBrute);
        this.sourceCodeOf[fileBrute] = contenido;
      } else {
        this.selectedFiles.splice(pos, 1);
      }
    },
    calcPercent(counts, map) {
      this.$trace("lsw-coverage-viewer.methods.calcPercent");
      const total = Object.keys(map).length;
      const covered = Object.values(counts).filter(c => {
        if (Array.isArray(c)) return c.every(x => x > 0); // for branches
        return c > 0;
      }).length;
      return this.cleanDecimals(total > 0 ? ((covered / total) * 100).toFixed(1) : '0.0');
    },
    calcLineCoverage(data) {
      this.$trace("lsw-coverage-viewer.methods.calcLineCoverage");
      // basic estimation using statementMap line numbers
      const lines = new Set();
      for (let key in data.statementMap) {
        lines.add(data.statementMap[key].start.line);
      }
      const covered = new Set();
      for (let key in data.s) {
        if (data.s[key] > 0) {
          covered.add(data.statementMap[key].start.line);
        }
      }
      return this.cleanDecimals(lines.size > 0 ? ((covered.size / lines.size) * 100).toFixed(1) : '0.0');
    },
    cleanDecimals(input) {
      this.$trace("lsw-coverage-viewer.methods.cleanDecimals");
      return (input + "").replace(/0+$/g, "").replace(/\.$/g, "");
    },
    coverageClass(percentStr) {
      this.$trace("lsw-coverage-viewer.methods.coverageClass");
      const percent = parseFloat(percentStr);
      if (percent >= 85) return 'high';
      if (percent >= 40) return 'medium';
      return 'low';
    },
    getPathRelativeToProject(file) {
      this.$trace("lsw-coverage-viewer.methods.getPathRelativeToProject");
      return file.replace(this.COVERAGE_TARGET_DIR, "");
    },
    async openFile(file) {
      this.$trace("lsw-coverage-viewer.methods.openFile");
      const relativeFile = this.getPathRelativeToProject(file);
      console.log(relativeFile);
      
    }
  },
  mounted() {
    this.$trace("lsw-coverage-viewer.mounted");
    if (typeof window.__coverage__ !== 'undefined') {
      this.coverageData = window.__coverage__;
    }
    window.$cov = this;
  },
});