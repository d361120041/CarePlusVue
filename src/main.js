import '@/assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { far } from '@fortawesome/free-regular-svg-icons'

//allen 新增: npm install @fortawesome/fontawesome-free 
import { fas } from '@fortawesome/free-solid-svg-icons' // allen 新增
library.add(far, fas) //allen 新增  

//allen 新增
import '@fortawesome/fontawesome-free/css/all.min.css';

import router from '@/router/router.js'
import App from '@/App.vue'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .use(pinia)
    .mount('#app')