// ================ style 開始 ================
import "bootstrap/dist/css/bootstrap.min.css";
//allen 新增
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/main.css";
// ================ style 結束 ================

// ================ 匯入套件 開始 ================

import { createApp } from "vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createPinia } from "pinia";
import router from "@/router/router.js";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import "animate.css";
// ---------------- daniel ----------------
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(far);
import clickOutside from "@/daniel/directives/click-outside";
// ---------------- daniel ----------------

// ---------------- allen ----------------
//allen 新增: npm install @fortawesome/fontawesome-free
import { fas } from "@fortawesome/free-solid-svg-icons"; // allen 新增
library.add(far, fas); //allen 新增
// ---------------- allen ----------------

// ---------------- yuuhou ----------------
import { useCaregiverAuth } from "@/stores/useCaregiverAuth";

// ---------------- yuuhou ----------------

import App from "@/App.vue";
// ================ 匯入套件 結束 ================

// ================ app 開始 ================
const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(VueSweetalert2);

// ---------------- daniel ----------------
app.component("font-awesome-icon", FontAwesomeIcon);
app.directive('click-outside', clickOutside)
// ---------------- daniel ----------------

// ---------------- yuuhou ----------------
const authStore = useCaregiverAuth();
authStore.restoreLogin();
// ---------------- yuuhou ----------------

app.mount("#app");
// ================ app 結束 ================
