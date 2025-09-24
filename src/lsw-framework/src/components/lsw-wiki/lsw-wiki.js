/*
  @artifact:  Lite Starter Web Dependency
  @url:       https://github.com/allnulled/lsw-wiki.git
  @name:      @allnulled/lsw-wiki
  @version:   1.0.0
*/(function(factory) {
  const mod = factory();
  if(typeof window !== 'undefined') {
    window["Lsw_wiki_components"] = mod;
  }
  if(typeof global !== 'undefined') {
    global["Lsw_wiki_components"] = mod;
  }
  if(typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function() {
Vue.component("LswWiki", {
  name: "LswWiki",
  template: `<div class="lsw_wiki">
    <h4>Welcome to wiki</h4>
    <div class="wiki_searcher_1_box">
        <div class="wiki_searcher_1_input_cell">
            <input class="wiki_searcher_1_input" v-model="search_text_1" type="text" placeholder="Fast search" v-on:key-down.enter="search" />
        </div>
        <div class="wiki_searcher_1_button_cell">
            <button class="wiki_searcher_1_button" v-on:click="search">🔎</button>
        </div>
    </div>
</div>`,
  props: {},
  data() {
    this.$trace("lsw-wiki.data");
    return {
      search_text_1: "",
    };
  },
  methods: {
    search() {
      this.$trace("lsw-wiki.methods.search");
      console.log("Search");
    }
  },
  watch: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-wiki.mounted");
    } catch (error) {
      console.log(error);
    }
  }
});
});

