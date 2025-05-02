// ================ style 開始 ================
import '@/assets/css/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
// ================ style 結束 ================


// ================ 匯入套件 開始 ================
import { createApp } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import router from '@/router/router.js'

// ---------------- daniel ----------------
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add( far)
// ---------------- daniel ----------------

// ---------------- yuuhou ----------------
import { useAuth } from '@/stores/useAuth'
// ---------------- yuuhou ----------------

import App from '@/App.vue'
// ================ 匯入套件 結束 ================


// ================ app 開始 ================
const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// ---------------- daniel ----------------
app.component('font-awesome-icon', FontAwesomeIcon)
// ---------------- daniel ----------------

// ---------------- yuuhou ----------------
const authStore = useAuth()
authStore.restoreLogin()
// ---------------- yuuhou ----------------

app.mount('#app')
// ================ app 結束 ================
