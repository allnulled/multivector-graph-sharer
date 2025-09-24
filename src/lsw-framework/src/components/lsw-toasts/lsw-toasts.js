// @code.start: LswToasts API | @$section: Vue.js (v2) Components » Lsw Toasts API » LswToasts component
Vue.component("LswToasts", {
  template: $template,
  props: {},
  data() {
    return {
      sent: {}
    };
  },
  methods: {
    getRandomString(len = 10) {
      const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      let out = "";
      while (out.length < len) {
        out += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      return out;
    },
    showError(error, args = {}, propagate = false, log = true) {
      this.$trace("lsw-toasts.methods.showError");
      let parameters = {};
      const isSyntaxError = typeof error.location === "object";
      if (isSyntaxError) {
        parameters = {
          title: `Error sintáctico en ${error.location.start.line}:${error.location.start.column} (${error.found})`,
          text: error.expected,
        }
      } else {
        parameters = {
          title: "Un error ocurrió",
          text: error.name + ": " + error.message,
          ...args,
        }
      }
      const output = this.send(parameters);
      if (log) {
        console.log(error);
      }
      if (propagate) {
        throw error;
      }
      return output;
    },
    send(toastsInput = {}) {
      const toastData = Object.assign({
        id: this.getRandomString(),
        title: "",
        text: "",
        timeout: 3000,
        orientation: "bottom",
        background: "rgba(255,255,255,0.5)",
        foreground: "#000",
        started_at: new Date()
      }, toastsInput);
      if (typeof toastData.timeout !== "number") {
        throw new Error("Required parameter «timeout» to be a number or empty on «LswToasts.methods.send»");
      }
      if (isNaN(toastData.timeout)) {
        throw new Error("Required parameter «timeout» to be a (non-NaN) number or empty on «LswToasts.methods.send»");
      }
      if (["top", "bottom", "center"].indexOf(toastData.orientation) === -1) {
        throw new Error("Required parameter «orientation» to be a string (top, center, bottom) or empty on «LswToasts.methods.send»");
      }
      if (toastData.id in this.sent) {
        throw new Error("Required parameter «id» to not be repeated on «LswToasts.methods.send»");
      }
      this.sent = Object.assign({}, this.sent, {
        [toastData.id]: toastData
      });
      setTimeout(() => {
        this.close(toastData.id);
      }, toastData.timeout);
    },
    close(id) {
      delete this.sent[id];
      this.$forceUpdate(true);
    },
    debug(anyzing) {
      this.send({
        title: typeof anyzing,
        text: LswUtils.stringify(anyzing),
      });
    },
    collapse(anyzing, timeout = 3000) {
      this.$lsw.dialogs.open({
        title: "Debugging: type " + typeof anyzing,
        template: `
          <div class="pad_1">
            <div>Moment: {{ moment }}</div>
            <pre class="codeblock" style="font-size: 10px;">{{ code }}</pre>
          </div>
        `,
        factory: function() {
          return {
            data() {
              return {
                moment: LswTimer.utils.fromDateToDatestring(new Date(), true),
                code: typeof anyzing === "string" ? anyzing : JSON.stringify(anyzing, null, 2),
              };
            },
            mounted() {
              setTimeout(() => this.cancel(), timeout);
            },
          };
        }
      });
    }
  },
  watch: {},
  mounted() {
    this.$toasts = this;
    this.$window.LswToasts = this;
    if (this.$lsw) {
      this.$lsw.toasts = this;
    }
    this.$window.dd = (...args) => {
      return this.debug(...args);
    };
  }
});
// @code.end: LswToasts API