import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Forbidden from '@/views/Forbidden.vue'
import Social from '@/Daniel/views/Social.vue'

const routes = [
    { path: "/", component: Home, name: "home" },
    { path: "/:pathMatch(.*)", component: NotFound, name: "notfound" },
    { path: "/403", component: Forbidden, name: "forbidden" },
    { path: "/social", component: Social, name: "social" },
];

const router = createRouter({
    routes: routes,
    history: createWebHistory(),
    linkActiveClass: 'active',
    linkExactActiveClass: 'active--exact'
})

export default router

