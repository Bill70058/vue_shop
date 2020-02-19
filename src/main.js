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

// 配置请求拦截
axios.interceptors.request.use(config => {
  // 将token与需求字段添加到请求头中
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须将请求的资源返回，返回config
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
