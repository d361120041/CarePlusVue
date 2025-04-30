import '@/assets/css/main.css'



import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAuth } from '@/stores/useAuth'

import router from '@/router/router.js'
import App from '@/App.vue'

const app = createApp(App)

// ✅ 先 createPinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// ✅ 先 use pinia
app.use(pinia)

// ✅ 再 use router
app.use(router)

// ✅ 現在 pinia 已經掛上了，這時候才可以安全呼叫 store
const authStore = useAuth()
authStore.restoreLogin()

// ✅ 最後 mount
app.mount('#app')
