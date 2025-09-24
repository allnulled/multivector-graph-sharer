Vue.component("LswToasts", {
  template: <div class="lsw_toasts">
    <div class="toasts_box">
        <div class="toast_list">
            <template v-for="toast, toastIndex in sent">
                <div class="toast_box">
                    <div class="toast_item">
                        <div class="toast"
                            v-bind:key="'toast-number-' + toast.id"
                            :style="{ color: toast.foreground, backgroundColor: toast.background }"
                            v-on:click="() => close(toast.id)">
                            <div class="toast_title"
                                style="font-size: 13px;" v-if="toast.title">
                                {{ toast.title }}
                            </div>
                            <div class="toast_text"
                                style="font-size: 10px;">
                                {{ toast.text }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</div>,
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
      while(out.length < len) {
        out += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      return out;
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
      if(typeof toastData.timeout !== "number") {
        throw new Error("Required parameter «timeout» to be a number or empty on «LswToasts.methods.send»");
      }
      if(isNaN(toastData.timeout)) {
        throw new Error("Required parameter «timeout» to be a (non-NaN) number or empty on «LswToasts.methods.send»");
      }
      if(["top", "bottom", "center"].indexOf(toastData.orientation) === -1) {
        throw new Error("Required parameter «orientation» to be a string (top, center, bottom) or empty on «LswToasts.methods.send»");
      }
      if(toastData.id in this.sent) {
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
    }
  },
  watch: {},
  mounted() {
    this.$toasts = this;
    this.$window.LswToasts = this;
    if(this.$lsw) {
      this.$lsw.toasts = this;
    }
  }
});