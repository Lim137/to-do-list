import { createApp } from "vue";
import { GesturePlugin } from "@vueuse/gesture";
import App from "./App.vue";
import "./defaultstyle.css";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);
const options = {};

app.use(Toast, options);
app.use(GesturePlugin);
app.use(router);

app.mount("#app");
