import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import router from './router'

import './axios.js';
//import './echo.js';



AOS.init()
const pinia = createPinia();
const app = createApp(App)
app.use(pinia);
app.use(router)

import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()
authStore.initializeFromLocalStorage()

app.mount('#app')
