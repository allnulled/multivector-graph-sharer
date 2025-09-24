// @code.start: LswKeyboard1 API | @$section: Vue.js (v2) Components » LswKeyboard1 component
Vue.component("LswKeyboard1", {
  template: $template,
  props: {
    initialText: {
      type: String,
      required: true,
    },
  },
  data() {
    this.$trace("lsw-keyboard-1.data");
    return {
      hasFocus: false,
      isShowingText: true,
      teclasPresionadas: [],
      teclado: [
        [
          {keys:['\\','ª','º'],text:'\\',topLeftText:'ª',bottomLeftText:'º'},
          {keys:['1','!','|'],text:'1',topLeftText:'!',bottomLeftText:'|'},
          {keys:['2','"','@'],text:'2',topLeftText:'"',bottomLeftText:'@'},
          {keys:['3','·','#'],text:'3',topLeftText:'·',bottomLeftText:'#'},
          {keys:['4','$','~'],text:'4',topLeftText:'$',bottomLeftText:'~'},
          {keys:['5','%','½'],text:'5',topLeftText:'%',bottomLeftText:'½'},
          {keys:['6','&','¬'],text:'6',topLeftText:'&',bottomLeftText:'¬'},
          {keys:['7','/','{'],text:'7',topLeftText:'/',bottomLeftText:'{'},
          {keys:['8','(','['],text:'8',topLeftText:'(',bottomLeftText:'['},
          {keys:['9',')'],text:'9',topLeftText:')',bottomLeftText:''},
          {keys:['0','=','}'],text:'0',topLeftText:'=',bottomLeftText:''},
          {keys:["'",'\\','?'],text:"'",topLeftText:'?',bottomLeftText:'\\'},
          {keys:['¡','¿','~'],text:"¡",topLeftText:'¿',bottomLeftText:'~'},
        ],[
          {keys:['⇒'],text:'⇒',topLeftText:'',bottomLeftText:'',style:'flex:1.25'},
          {keys:['Q','q'],text:'Q',topLeftText:'',bottomLeftText:''},
          {keys:['W','w'],text:'W',topLeftText:'',bottomLeftText:''},
          {keys:['E','e'],text:'E',topLeftText:'',bottomLeftText:''},
          {keys:['R','r'],text:'R',topLeftText:'',bottomLeftText:''},
          {keys:['T','t'],text:'T',topLeftText:'',bottomLeftText:''},
          {keys:['Y','y'],text:'Y',topLeftText:'',bottomLeftText:''},
          {keys:['U','u'],text:'U',topLeftText:'',bottomLeftText:''},
          {keys:['I','i'],text:'I',topLeftText:'',bottomLeftText:''},
          {keys:['O','o'],text:'O',topLeftText:'',bottomLeftText:''},
          {keys:['P','p'],text:'P',topLeftText:'',bottomLeftText:''},
          {keys:['^','`','['],text:'^',topLeftText:'`',bottomLeftText:'['},
          {keys:['*','+',']'],text:'*',topLeftText:'+',bottomLeftText:']'},
        ],[
          {keys:['♦️'],text:'♦️',topLeftText:'',bottomLeftText:'',style:'flex:1.5'},
          {keys:['A','a'],text:'A',topLeftText:'',bottomLeftText:''},
          {keys:['S','s'],text:'S',topLeftText:'',bottomLeftText:''},
          {keys:['D','d'],text:'D',topLeftText:'',bottomLeftText:''},
          {keys:['F','f'],text:'F',topLeftText:'',bottomLeftText:''},
          {keys:['G','g'],text:'G',topLeftText:'',bottomLeftText:''},
          {keys:['H','h'],text:'H',topLeftText:'',bottomLeftText:''},
          {keys:['J','j'],text:'J',topLeftText:'',bottomLeftText:''},
          {keys:['K','k'],text:'K',topLeftText:'',bottomLeftText:''},
          {keys:['L','l'],text:'L',topLeftText:'',bottomLeftText:''},
          {keys:['Ñ','ñ'],text:'Ñ',topLeftText:'',bottomLeftText:''},
          {keys:['¨'],text:'¨',topLeftText:'´',bottomLeftText:'{'},
          {keys:['ç','Ç'],text:'ç',topLeftText:'',bottomLeftText:'}'},
        ],[
          {keys:['🔺'],text:'🔺',topLeftText:'',bottomLeftText:''},
          {keys:['>'],text:'>',topLeftText:'<',bottomLeftText:''},
          {keys:['Z','z'],text:'Z',topLeftText:'',bottomLeftText:''},
          {keys:['X','x'],text:'X',topLeftText:'',bottomLeftText:''},
          {keys:['C','c'],text:'C',topLeftText:'',bottomLeftText:''},
          {keys:['V','v'],text:'V',topLeftText:'',bottomLeftText:''},
          {keys:['B','b'],text:'B',topLeftText:'',bottomLeftText:''},
          {keys:['N','n'],text:'N',topLeftText:'',bottomLeftText:''},
          {keys:['M','m'],text:'M',topLeftText:'',bottomLeftText:''},
          {keys:[','],text:',',topLeftText:';',bottomLeftText:''},
          {keys:['.'],text:'.',topLeftText:':',bottomLeftText:''},
          {keys:['-'],text:'-',topLeftText:'_',bottomLeftText:''},
          {keys:['🔺'],text:'🔺',topLeftText:'',bottomLeftText:'',style:'flex:2', fontSize:'8px'},
        ],[
          {keys:['Control'],text:'Ctrl',topLeftText:'',bottomLeftText:'',fontSize:'8px'},
          {keys:['Alt'],text:'Alt',topLeftText:'',bottomLeftText:'',fontSize:'8px'},
          {keys:['Space'],text:'Space',topLeftText:'',bottomLeftText:'',style:'flex:6',fontSize:'8px'},
          {keys:['AltGraph'],text:'Alt Gr',topLeftText:'',bottomLeftText:'',fontSize:'8px'},
          {keys:['Fn'],text:'Fn',topLeftText:'',bottomLeftText:'',fontSize:'8px'},
        ],
      ],
      botonesTop: [{
        text: "*",
        click: ()=>{},
      }, {
        text: "*",
        click: ()=>{},
      }, {
        text: "*",
        click: ()=>{},
      }],
      botonesLeft: [{
        text: "*",
        click: ()=>{},
      }, {
        text: "*",
        click: ()=>{},
      }, {
        text: "*",
        click: ()=>{},
      }],
      botonesRight: [{
        text: "*",
        click: ()=>{},
      }, {
        text: "*",
        click: ()=>{},
      }, {
        text: "*",
        click: ()=>{},
      }],
      botonesBottom: [{
        text: "*",
        click: ()=>{},
      }, {
        text: "*",
        click: ()=>{},
      }, {
        text: "*",
        click: ()=>{},
      }],
    };
  },
  methods: {
    async load() {
      
    },
    hasPressedKey(keys) {
      this.$trace("lsw-keyboard-1.methods.hasPressedKey");
      for(let index=0; index<keys.length; index++) {
        const key = keys[index];
        const isPressed = this.teclasPresionadas.indexOf(key) !== -1;
        if(isPressed) {
          return true;
        }
      }
      return false;
    },
    pressKey(event) {
      this.$trace("lsw-keyboard-1.methods.pressKey");
      this.teclasPresionadas.push(event.key);
      this.dispatchKeyPress(event.key, event);
    },
    releaseKey(event) {
      this.$trace("lsw-keyboard-1.methods.releaseKey");
      console.log(event.key);
      const pos = this.teclasPresionadas.indexOf(event.key);
      if(pos !== -1) {
        this.teclasPresionadas.splice(pos, 1);
      }
    },
    notifyFocus() {
      this.$trace("lsw-keyboard-1.methods.notifyFocus");
      this.hasFocus = true;
    },
    notifyBlur() {
      this.$trace("lsw-keyboard-1.methods.notifyBlur");
      this.hasFocus = false;
    },
    dispatchKeyPress(keyId, event) {
      this.$trace("lsw-keyboard-1.methods.dispatchKeyPress");
      console.log(keyId);
      this.$refs.keyboardText.dispatchKeyPress(keyId, event);
    },
    gainFocus() {
      this.$trace("lsw-keyboard-1.methods.gainFocus");
      this.$refs.keyboardMainElement.focus();
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-keyboard-1.mounted");
      this.load();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswKeyboard1 API