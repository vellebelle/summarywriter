import Vue from 'vue'
import VueRouter from 'vue-router'
import AddSummary from '../views/AddSummary.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/add',
    name: 'AddSummary',
    component: AddSummary
  }
]

const router = new VueRouter({
  routes
})

export default router
