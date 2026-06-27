import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import About from '../views/About.vue'
import HelpCenter from '../views/HelpCenter.vue'
import { supabase } from '../lib/supabase.js'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/products', name: 'Products', component: Products },
  { path: '/login', name: 'Login', component: Login },
  { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAuth: true } },
  { path: '/about', name: 'About', component: About },
  { path: '/help', name: 'HelpCenter', component: HelpCenter },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫：检查 Supabase session（真实验证）
router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) return next()
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    next()
  } else {
    next('/login')
  }
})

export default router
