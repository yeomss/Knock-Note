import Vue from "vue";
import { store } from "./store/index";
import moment from "moment";
import VueMomentJS from "vue-momentjs";
Vue.use(VueMomentJS, moment);
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  store,
}).$mount("#app");
