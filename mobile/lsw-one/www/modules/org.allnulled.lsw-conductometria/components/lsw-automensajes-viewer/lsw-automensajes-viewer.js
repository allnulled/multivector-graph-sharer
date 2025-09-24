// @code.start: LswAutomensajesViewer API | @$section: Módulo org.allnulled.lsw-conductometria » Vue.js (v2) Components » LswAutomensajesViewer API » LswAutomensajesViewer component
Vue.component("LswAutomensajesViewer", {
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-automensajes-viewer.data");
    return {
      isMounted: false,
      automensajes: [],
      selectedAutomensaje: undefined,
      selectedFontsize: 12,
      automessagingId: undefined,
      automessagingSeconds: 0,
      simboloActual: "✴️", // "♠️",
      // simboloActual: LswRandomizer.getRandomItem("🌅🌄🌠🎇🎆🌇🌆🏙🌃🌌🌉🌁".split("")),
      
      // simboloActual: LswRandomizer.getRandomItem("🐶🐱🐵🐗🐴🐌🐜🌋🏭🏢🏬🏣🚀🛸🚁🎲🎯🎳✴️🗽🗼🛟🎱🐞🌝🌛🌜🌚🌕🌖🌗🌘🌑🌒🌓🌔🌙🌎🌍🌏🪐💫⭐️🌟✨⚡️☄️💥🔥🌪🌈🐉🐲🐦‍🔥🌵🎄🌲🌳🌴🪹🪺🪵🌱🌿🍀🍁🍄🍄‍🟫🌾💐🌷🪷🌹🥀🌺🎪🤹🤹‍♂️🤹‍♀️🎭🎨🎼🎹🥁🪘🪇🎷🎺🪗🎸🪕🎻🪈♟🎰🧩🚗🚕🚙🎬🎤🎧💧💦🫧☔️☂️🌊🍏🍎🍐🍊🍋🍋‍🟩🍌🍉🍇🍓🫐🍈🍒🍑🥭🍍🥥🥝🍅🍆🥑🥦🫛".split("")),
    };
  },
  methods: {
    procedureForPicas() {
      this.$trace("LswAutomensajesViewer.methods.procedureForPicas", []);
      this.selectApplication("despues");
    },
    async loadAutomensajes() {
      this.$trace("LswAutomensajesViewer.methods.loadAutomensajes", []);
      const automensajes = await this.$lsw.fs.evaluateAsDotenvFileOrReturn("/kernel/settings/automessages.env", {});
      this.automensajes = Object.keys(automensajes);
    },
    async sendAutomessage() {
      this.$trace("LswAutomensajesViewer.methods.sendAutomessage", []);
      const availableAutomensajes = this.automensajes.filter(a => {
        if(typeof this.selectedAutomensaje !== "string") return true;
        return a !== this.selectedAutomensaje;
      });
      const nextAutomensaje = LswRandomizer.getRandomItem(availableAutomensajes);
      const nextFontsize = this.calculateFontsize(nextAutomensaje);
      this.selectedFontsize = nextFontsize;
      this.selectedAutomensaje = nextAutomensaje;
    },
    calculateFontsize(text) {
      this.$trace("LswAutomensajesViewer.methods.calculateFontsize", []);
      const textLength = text.length;
      if(textLength < 10) {
        return 18;
      } else if(textLength < 20) {
        return 16;
      } else if(textLength < 30) {
        return 14;
      } else {
        return 12;
      }
    },
    async startAutomessaging() {
      this.$trace("LswAutomensajesViewer.methods.startAutomessaging", []);
      await this.loadAutomensajes();
      await this.sendAutomessage();
      await this.continueAutomessaging();
    },
    async continueAutomessaging() {
      this.$trace("LswAutomensajesViewer.methods.continueAutomessaging", []);
      clearTimeout(this.automessagingId);
      this.automessagingSeconds = LswRandomizer.getRandomIntegerBetween(60,120);
      this.automessagingId = setTimeout(() => this.sendAutomessage(), this.automessagingSeconds * 1000);
    },
    stopAutomessaging() {
      this.$trace("LswAutomensajesViewer.methods.stopAutomessaging");
      clearTimeout(this.automessagingId);
    },
    async refreshAutomessaging() {
      this.$trace("LswAutomensajesViewer.methods.refreshAutomessaging", []);
      this.stopAutomessaging();
      this.startAutomessaging();
      this.$window.changeBackgroundImage();
    },
    goToDesktop() {
      this.$trace("LswAutomensajesViewer.methods.goToDesktop", []);
      this.$lsw.windows.hide();
      this.$refs.appPanel.selectApplication("none");
    },
    selectApplication(application) {
      this.$trace("LswAutomensajesViewer.methods.selectApplication", []);
      this.$refs.appPanel.selectApplication(application);
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-automensajes-viewer.mounted");
      this.$window.$automensajesUi = this;
      // this.startAutomessaging();
      this.isMounted = true;
      this.refreshAutomessaging();
    } catch(error) {
      console.log(error);
    }
  },
  unmount() {
    this.$trace("lsw-automensajes-viewer.unmount");
    this.stopAutomessaging();
  }
});
// @code.end: LswAutomensajesViewer API