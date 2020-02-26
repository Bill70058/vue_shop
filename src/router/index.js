import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/home_welcome'
import User from '../components/user'
import AuthorityList from '../components/authority/authorityList'
import Roles from '../components/authority/roles'
import Cate from '../components/goods/cate'
import Goods from '../components/goods/goods'
import Params from '../components/goods/params'
import Add from '../components/goods/add'
import Orders from '../components/order'
import Reports from '../components/reports'
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  component: Login
},
{
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  }, {
    path: '/users',
    component: User
  }, {
    path: '/roles',
    component: Roles
  }, {
    path: '/rights',
    component: AuthorityList
  }, {
    path: '/categories',
    component: Cate
  }, {
    path: '/goods',
    component: Goods
  }, {
    path: '/params',
    component: Params
  }, {
    path: '/goods/add',
    component: Add
  }, {
    path: '/orders',
    component: Orders
  }, {
    path: '/reports',
    component: Reports
  }]
}
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫，如果访问的页面是登陆页则直接跳转，如果要访问其他页面则判断是否有token，没有就强制跳转到登陆页，有就继续访问
router.beforeEach((to, form, next) => {
  if (to.path === '/login') {
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
export default router
