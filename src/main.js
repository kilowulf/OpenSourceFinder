import { createApp } from "vue";
// import "./style.css";
import "./assets/main.css";
import router from "./routes/routes";
import App from "./App.vue";
import store from "./store";

createApp(App).use(router).use(store).mount("#app");
