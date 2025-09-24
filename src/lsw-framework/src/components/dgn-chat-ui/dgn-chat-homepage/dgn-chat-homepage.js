// @code.start: DgnChatHomepage API | @$section: Vue.js (v2) Components » Lsw Chat UI API » DgnChatHomepage component
Vue.component("DgnChatHomepage", {
  template: $template,
  props: {},
  data() {
    this.$trace("dgn-chat-homepage.data");
    return {
      chatButtons: [],
      connectedSocket: false,
      listedSockets: false,
    };
  },
  methods: {
    async connectSocket() {
      this.connectedSocket = io();
    },
    async listSockets() {
      const response = await DgnFetch.fetch("http://127.0.0.1:9090/api/v1/sockets/listSockets");
      this.listedSockets = response.data.output.uids;
    }
  },
  watch: {},
  async mounted() {
    this.$trace("dgn-chat-homepage.mounted");
    await this.connectSocket();
    await this.listSockets();
  },
});
// @code.end: DgnChatHomepage API