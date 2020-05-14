import Vue from 'vue'
import App from './App'
import Axios from './api'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import './styles/global.styl'
import 'element-ui/lib/theme-chalk/index.css';
import {permission} from './utiles/directive'
Vue.directive('permission', permission)
Vue.use(ElementUI);
Vue.prototype.$http = Axios

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
