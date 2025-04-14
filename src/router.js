import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import Home from './views/HomeTest.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Laws from "./views/Laws.vue";
import Signature from './views/Signature.vue'
import DocumentView from './views/Documents.vue'
import { useAuthStore } from './stores/auth.js'

const routes = [
    { path: '/chat', component: HomePage, meta: { requiresAuth: true } },
    { path: '/', component: Home },
    { path: '/login', component: Login, meta: { guestOnly: true } },
    { path: '/register', component: Register, meta: { guestOnly: true } },
    {path: '/laws', component: Laws },
    {path: '/signature', component: Signature },
    {path: '/documents', component: DocumentView },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        return next('/login');
    }

    if (to.meta.guestOnly && authStore.isLoggedIn) {
        return next('/');
    }

    next();
});

export default router;
