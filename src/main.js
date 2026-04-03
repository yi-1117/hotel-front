import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import Router from "./router/router";
import "bootstrap/dist/css/bootstrap.min.css"; // CSS
import "bootstrap"; // JS
import "bootstrap-vue-3/dist/bootstrap-vue-3.css"; // BootstrapVue3 CSS
import BootstrapVue3 from "bootstrap-vue-3"; // 引入 BootstrapVue3
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "swiper/swiper-bundle.css";
import { useHomeStore } from "./stores/home.js"; //不能刪 他會跑到pinia 尤其是EY
import { Swiper, SwiperSlide } from "swiper/vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"; // 引入 far 類型的 envelope 圖標
import { faKey } from "@fortawesome/free-solid-svg-icons"; // 引入 fas 類型的 key 圖標
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCartShopping,
  faUserPlus,
  faSignInAlt,
  faUser,
  faVenusMars,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faLine } from "@fortawesome/free-brands-svg-icons";
import '@fortawesome/fontawesome-free/css/all.css'; //WY加的 很好用
import { useEAuthStore } from "@/stores/e_auth.js";

// 判斷當前路徑
const currentPath = window.location.pathname;

const pinia = createPinia();
const router = Router;
const app = createApp(App);
pinia.use(piniaPluginPersistedState);
app.use(pinia);

app.use(Swiper);
app.use(BootstrapVue3);
// app.use(SwiperSlide);
app.use(router);
library.add(
  faCartShopping,
  faEnvelope,
  faKey,
  faUserPlus,
  faSignInAlt,
  faUser,
  faVenusMars,
  faPhone,
  faLine
);
app.component("font-awesome-icon", FontAwesomeIcon);

const authStore = useEAuthStore()
authStore.loadAuth();
app.component("Swiper", Swiper);
app.component("SwiperSlide", SwiperSlide);
app.mount("#app");
