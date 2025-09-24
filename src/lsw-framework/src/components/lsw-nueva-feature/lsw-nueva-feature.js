// @code.start: LswNuevaFeature API | @$section: Vue.js (v2) Components » LswNuevaFeature component
Vue.component("LswNuevaFeature", {
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-nueva-feature.data");
    return {

    };
  },
  methods: {
    getRandomList1() {
      const randomList = [];
      for(let index=0; index<50; index++) {
        randomList.push({
          name: LswRandomizer.getRandomWord([2,5]),
          surname: LswRandomizer.getRandomWord([2,5]),
          city: LswRandomizer.getRandomWord([2,5]),
          country: LswRandomizer.getRandomWord([2,5]),
          altura: LswRandomizer.getRandomIntegerBetween(30, 50)
        });
      }
      return randomList;
    }
  },
  computed: {
    
  },
  watch: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-nueva-feature.mounted");
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswNuevaFeature API