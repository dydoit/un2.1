import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './route'
Vue.use(VueRouter)
export default new VueRouter({
  base:'/netwDev/',//正式版
  linkExactActiveClass: 'active',
  routes
})
