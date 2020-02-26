import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/css/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

// 进度条导入
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 富文本编辑器依赖导入
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// eslint-disable-next-line no-unused-vars
import axios from 'axios'
// 全局挂载axios
Vue.prototype.$http = axios
// 配置请求跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 配置请求拦截
axios.interceptors.request.use(config => {
  NProgress.start()
  // 将token与需求字段添加到请求头中
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须将请求的资源返回，返回config
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}-${mm}-${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
