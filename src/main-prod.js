import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'

// 导入全局样式
import './assets/css/global.css'
// 导入第三方组件vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
// 导入进度条插件
import NProgress from 'nprogress'
// 导入进度条样式
// import 'nprogress/nprogress.css'
// //导入axios
import axios from 'axios'
// //导入vue-quill-editor（富文本编辑器）
import VueQuillEditor from 'vue-quill-editor'
// //导入vue-quill-editor的样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
  // 当进入request拦截器，表示发送了请求，我们就开启进度条
  NProgress.start()
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须返回config
  return config
})
// 在response拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
  // 当进入response拦截器，表示请求已经结束，我们就结束进度条
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 全局注册组件
Vue.component('tree-table', TreeTable)
// 全局注册富文本组件
Vue.use(VueQuillEditor)

// 创建过滤器将秒数过滤为年月日，时分秒
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
