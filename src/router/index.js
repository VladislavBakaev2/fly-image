import { createRouter, createWebHistory } from 'vue-router'
import MainPage from "@/views/MainPage.vue"
import SignupPage from "@/views/SignupPage.vue"
import SigninPage from "@/views/SigninPage.vue"
import ProfilePage from "@/views/ProfilePage.vue"


const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/signup',
    name: 'SignupPage',
    component: SignupPage
  },
  {
    path: '/signin',
    name: 'SigninPage',
    component: SigninPage
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
