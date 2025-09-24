// @code.start: LswDiario API | @$section: Vue.js (v2) Components » Lsw Diario » LswDiario component
Vue.component("LswDiario", {
  template: $template,
  props: {

  },
  data() {
    return {
      selectedDate: new Date(),
      selectedMode: "edit", // also: "view"
      selectedText: "",
      isSelectedCalendar: false,
      fontSize: 12,
      fontFamily: 'inherit',
      diarioButtons: [{
        text: "📆",
        event: () => this.toggleCalendar(),
      }, {
        text: "◀️",
        event: () => this.moveToPrevious(),
      }, {
        text: "▶️",
        event: () => this.moveToNext(),
      }]
    };
  },
  methods: {
    initialize() {
      this.$trace("lsw-tests-page.methods.initialize");
      this.loadText();
    },
    toggleCalendar() {
      this.$trace("lsw-tests-page.methods.toggleCalendar");
      this.isSelectedCalendar = !this.isSelectedCalendar;
    },
    increaseFontSize() {
      this.$trace("lsw-tests-page.methods.increaseFontSize");
      this.fontSize++;
    },
    decreaseFontSize() {
      this.$trace("lsw-tests-page.methods.decreaseFontSize");
      this.fontSize--;
    },
    toggleMonospaced() {
      this.$trace("lsw-tests-page.methods.decreaseFontSize");
      if(this.fontFamily === "monospace") {
        this.fontFamily = "inherit";
      } else {
        this.fontFamily = "monospace";
      }
    },
    async saveText() {
      this.$trace("lsw-tests-page.methods.saveText");
      const currentDay = LswTimer.utils.fromDateToDatestring(this.selectedDate, true);
      const entradasDelDia = await this.$lsw.database.select("Entrada_de_diario", function(it) {
        return it.tiene_fecha.startsWith(currentDay);
      });
      if(entradasDelDia.length) {
        const id = entradasDelDia[0].id;
        await this.$lsw.database.update("Entrada_de_diario", id, {
          tiene_fecha: currentDay,
          tiene_contenido: this.selectedText
        });
        this.$lsw.toasts.send({
          title: "Entrada actualizada",
          text: "La entrada de diario ha sido actualizada"
        });
      } else {
        await this.$lsw.database.insert("Entrada_de_diario", {
          tiene_fecha: currentDay,
          tiene_contenido: this.selectedText
        });
        this.$lsw.toasts.send({
          title: "Entrada creada",
          text: "La entrada de diario ha sido añadida"
        });
      }
    },
    async loadText() {
      this.$trace("lsw-tests-page.methods.loadText");
      const currentDay = LswTimer.utils.fromDateToDatestring(this.selectedDate, true);
      const entradasDelDia = await this.$lsw.database.select("Entrada_de_diario", it => {
        return it.tiene_fecha.startsWith(currentDay);
      });
      if(entradasDelDia.length) {
        this.selectedText = entradasDelDia[0].tiene_contenido;
      } else {
        this.selectedText = "";
      }
    },
    toggleMode() {
      this.$trace("lsw-tests-page.methods.toggleMode");
      if(this.selectedMode === "edit") {
        this.selectedMode = "view";
      } else {
        this.selectedMode = "edit";
      }
    },
    moveToPrevious() {
      this.$trace("lsw-tests-page.methods.moveToPrevious");
      const newDate = new Date(this.selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      this.selectedDate = newDate;
      this.selectedMode = "edit";
      if(this.$refs.calendario) {
        this.$refs.calendario.fecha_seleccionada = this.selectedDate;
      }
    },
    moveToNext() {
      this.$trace("lsw-tests-page.methods.moveToNext");
      const newDate = new Date(this.selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      this.selectedDate = newDate;
      this.selectedMode = "edit";
      if(this.$refs.calendario) {
        this.$refs.calendario.fecha_seleccionada = this.selectedDate;
      }
    }
  },
  watch: {
    selectedDate() {
      this.loadText();
    }
  },
  async mounted() {
    this.$trace("lsw-tests-page.mounted");
    await this.initialize();
  }
});
// @code.end: LswDiario API