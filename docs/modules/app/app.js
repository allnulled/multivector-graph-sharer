(() => {
  let isFirstTime = true;
  // Change this component at your convenience:
  Vue.component("App", {
    template: $template,
    props: {
      uuid: {
        type: String,
        default: () => {
          return Vue.prototype.$lsw.utils.getRandomString(10);
        }
      }
    },
    data() {
      return {
        isMounted: false,
        isShowingAvanzados: false,
        selectedPanel: "edicion", // also: "edicion", "visualizacion"
        entrada_datos: "",
        entrada_formato_datos: "csv", // also: "json", "csv"
        entrada_cabeceras_csv: "nombre, cantidad",
        entrada_separador_columnas_csv: ",",
        entrada_eje_x: "cantidad",
        entrada_eje_y: "nombre",
        error: false,
        source: `// Pasamos a formato largo usando los atributos seleccionados
const datosLargos = this.getDatos().flatMap(dato => {
  return this.entrada_eje_x
    .split(this.entrada_separador_columnas_csv)
    .map(atributo => atributo.trim()).map(atributo => {
      return {
        nombre: dato.nombre,
        atributo: atributo,
        valor: +dato[atributo],
        index: dato.index
      }
    });
});

return Plot.plot({
  x: {
    axis: "top",
    grid: true,
  },
  y: {label: null},
  color: {legend: true},
  marginTop: 40,
  marginRight: 20,
  marginBottom: 0,
  marginLeft: 100,
  marks: [
    Plot.ruleX([0]),
    Plot.barX(datosLargos, {
      x: "valor",
      y: d => d.nombre + " – " + d.atributo,
      fill: "atributo",
      tip: true,
      // sort: {y: "index"}
    })
  ]
});`,
        placeholder: ``,
        compilated: "",
      };
    },
    methods: {
      getDatos() {
        this.$trace("App.methods.selectPanel");
        if(this.entrada_formato_datos === 'json') {
          const lista = this.$window.eval(this.entrada_datos);
          return lista.map((fila, indice) => {
            fila.index = indice;
            return fila;
          });
        } else if(this.entrada_formato_datos === 'csv') {
          const lineas = this.entrada_datos.split("\n");
          const columnas = this.entrada_cabeceras_csv.split(this.entrada_separador_columnas_csv).map(t => t.trim());
          const lineasAdaptadas = lineas.map((fila, indiceDeFila) => {
            const campos = fila.split(this.entrada_separador_columnas_csv).map(t => t.trim());
            const lineaAdaptada = {};
            for(let indexColumna=0; indexColumna<campos.length; indexColumna++) {
              const campo = campos[indexColumna];
              const columna = columnas[indexColumna];
              lineaAdaptada[columna] = campo;
            }
            lineaAdaptada.index = indiceDeFila;
            return lineaAdaptada;
          });
          console.log(lineasAdaptadas);
          return lineasAdaptadas;
        }
        return [];
      },
      async selectPanel(panel) {
        this.$trace("App.methods.selectPanel");
        if(panel === "visualizacion") {
          await this.compile();
        }
        this.selectedPanel = panel;
      },
      async compile() {
        this.$trace("App.methods.compile");
        try {
          const chartElement = await LswUtils.createAsyncFunction(this.source).call(this);
          this.$refs.graphRenderer.innerHTML = "";
          this.$refs.graphRenderer.appendChild(chartElement);
          this.error = false;
        } catch (error) {
          console.log(error);
          this.error = error;
          throw error;
        }
      },
      async visualize() {
        this.$trace("App.methods.visualize");
        return await this.selectPanel("visualizacion");
      },
      exportAsLink() {
        this.$trace("App.methods.exportAsLink");
        console.log("exporting as link");
        const parameters = new URLSearchParams({
          source: this.source,
          entrada_datos: this.entrada_datos,
          entrada_formato_datos: this.entrada_formato_datos,
          entrada_cabeceras_csv: this.entrada_cabeceras_csv,
          entrada_separador_columnas_csv: this.entrada_separador_columnas_csv,
          entrada_eje_x: this.entrada_eje_x,
          entrada_eje_y: this.entrada_eje_y,
        });
        const url = new URL(window.location.href);
        const productLink = `${url.protocol}//${url.hostname}:${url.port}${url.pathname}?${parameters.toString()}`;
        LswUtils.copyToClipboard(productLink);
        this.$lsw.toasts.send({
          title: "Link exportado al portapapeles",
          text: productLink,
        });
      }
    },
    async mounted() {
      console.log("[💛] Application mounted.");
      await LswLazyLoads.loadD3js();
      await LswLazyLoads.loadObservablePlot();
      this.isMounted = true;
      if (isFirstTime) {
        Vue.prototype.$app = this;
        isFirstTime = false;
        window.dispatchEvent(new CustomEvent("lsw_app_mounted", {
          applicationUuid: this.uuid,
          $lsw: this.$lsw,
          appComponent: this,
        }));
        await LswLifecycle.onApplicationMounted();
        Load_link: {
          const parameters = new URLSearchParams(window.location.search);
          let hasAnyParameter = false;
          const getAndApplyParameter = (paramId) => {
            const param = parameters.get(paramId);
            if(param) {
              this[paramId] = param;
              hasAnyParameter = true;
            }
          };
          getAndApplyParameter("source");
          getAndApplyParameter("entrada_datos");
          getAndApplyParameter("entrada_formato_datos");
          getAndApplyParameter("entrada_cabeceras_csv");
          getAndApplyParameter("entrada_separador_columnas_csv");
          getAndApplyParameter("entrada_eje_x");
          getAndApplyParameter("entrada_eje_y");
          if(!hasAnyParameter) {
            break Load_link;
          }
          this.visualize();
        }
      }
    }
  });
})(); 