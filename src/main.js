import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueBasicAlert from "vue-basic-alert";
//import "nprogress/nprogress.css";

const app = createApp(App);
app.use(VueBasicAlert);
app.use(router);
app.mount("#app");
