import Vue from 'vue'
import VueRouter from 'vue-router'
import AddSummary from '../views/AddSummary.vue'
import Home from '../views/Home.vue'
import Collection from '../views/Collection.vue'
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
  },
  {
    path: '/collection',
    name: 'Collection',
    component: Collection
  }
]

const router = new VueRouter({
  routes
})

export default router
