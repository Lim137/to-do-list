import { createApp } from "vue";
import { GesturePlugin } from "@vueuse/gesture";
import App from "./App.vue";
import "./defaultstyle.css";
const app = createApp(App);

app.use(GesturePlugin);

app.mount("#app");
