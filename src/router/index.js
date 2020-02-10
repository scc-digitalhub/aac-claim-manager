import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Callback from '../views/Callback.vue'
import auth from '../auth.js'
import Users from '../views/Users.vue'
import User from '../views/User.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/users/:serviceId',
    name: 'users',
    component: Users,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:serviceId/new',
    name: 'newuser',
    component: User,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:serviceId/:user',
    name: 'user',
    component: User,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  { path: '/logout', redirect: '/'},
  {
    path: '/callback',
    name: 'callback',
    component: Callback
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    auth.loggedIn().then(loggedIn => {
      if (!loggedIn) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    });
  } else {
    next()
  }
})
export default router
