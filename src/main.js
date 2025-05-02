import '@/assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAuth } from '@/stores/useAuth'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add( far)

import router from '@/router/router.js'
import App from '@/App.vue'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

const authStore = useAuth()
authStore.restoreLogin()

app.mount('#app')
