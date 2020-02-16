import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/css/iconfont.css'
// eslint-disable-next-line no-unused-vars
import axios from 'axios'
// 全局挂载axios
Vue.prototype.$http = axios
// 配置请求跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
