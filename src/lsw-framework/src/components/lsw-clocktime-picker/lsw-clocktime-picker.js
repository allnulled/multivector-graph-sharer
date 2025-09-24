// @code.start: LswClocktimePicker API | @$section: Vue.js (v2) Components » Lsw Clocktime Picker API » LswClocktimePicker component
// Change this component at your convenience:
Vue.component("LswClocktimePicker", {
  template: $template,
  props: {
    onChange: {
      type: Function,
      default: () => { },
    },
    initialHour: {
      type: [String, Number],
      default: () => "00"
    },
    initialMinute: {
      type: [String, Number],
      default: () => "00"
    }
  },
  data() {
    this.$trace("lsw-clocktime-picker.data");
    return {
      isSelected: 'none',
      hour_picked: this.initialHour,
      minute_picked: this.initialMinute,
    };
  },
  methods: {
    toggleSelection(part) {
      this.$trace("lsw-clocktime-picker.methods.toggleSelection");
      if (this.isSelected === part) {
        this.isSelected = "none";
      } else {
        this.isSelected = part;
      }
    },
    selectHour(hour) {
      this.$trace("lsw-clocktime-picker.methods.selectHour");
      this.hour_picked = hour;
    },
    selectMinute(minute) {
      this.$trace("lsw-clocktime-picker.methods.selectMinute");
      this.minute_picked = minute;
    },
    increaseHour(increment = 1) {
      this.$trace("lsw-clocktime-picker.methods.increaseHour");
      if(increment < 0) {
        if(parseInt("" + this.hour_picked) === 0) {
          return;
        }
      } else if(increment > 0) {
        if(parseInt("" + this.hour_picked) === 23) {
          return;
        }
      }
      this.hour_picked = ("" + (parseInt(this.hour_picked) + increment)).padStart(2, "0");
    },
    async specifyHour() {
      this.$trace("lsw-clocktime-picker.methods.specifyHour");
      const hours = await this.$lsw.dialogs.open({
        title: "Selecciona la hora exacta",
        template: `
          <div class="pad_1">
            <input class="supermini width_100" type="text" placeholder="Pon la hora exacta aquí" v-model="value" />
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1">
                <button class="supermini" v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `
      });
      if(hours === -1) return;
      this.hour_picked = hours;
    },
    increaseMinute(increment = 1) {
      this.$trace("lsw-clocktime-picker.methods.increaseMinute");
      if(increment < 0) {
        if(parseInt("" + this.minute_picked) === 0) {
          return;
        }
      } else if(increment > 0) {
        if(parseInt("" + this.minute_picked) === 59) {
          return;
        }
      }
      this.minute_picked = ("" + (parseInt(this.minute_picked) + increment)).padStart(2, "0");
    },
    async specifyMinute() {
      this.$trace("lsw-clocktime-picker.methods.specifyMinute");
      const minutes = await this.$lsw.dialogs.open({
        title: "Selecciona el minuto exacto",
        template: `
          <div class="pad_1">
            <input class="supermini width_100" type="text" placeholder="Pon el minuto exacto aquí" v-model="value" />
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1">
                <button class="supermini" v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `
      });
      if(minutes === -1) return;
      this.minute_picked = minutes;
    },
    triggerChange() {
      this.onChange({
        hour: parseInt(this.hour_picked),
        minute: parseInt(this.minute_picked)
      });
    }
  },
  watch: {
    hour_picked() {
      this.triggerChange();
    },
    minute_picked() {
      this.triggerChange();
    },
  },
  mounted() {
    this.$trace("lsw-clocktime-picker.mounted");
  },
  unmount() {
    this.$trace("lsw-clocktime-picker.unmounted");
  }
});
// @code.end: LswClocktimePicker API