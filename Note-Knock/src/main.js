import Vue from "vue";
import moment from "moment";
import VueMomentJS from "vue-momentjs";
Vue.use(VueMomentJS, moment);
import App from "./App.vue";
//import PythonShell from "python-shell";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount("#app");
