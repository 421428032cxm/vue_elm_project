import Vue from 'vue'
import Router from 'vue-router'
import Seller from '../components/seller/seller'
import Goods from '../components/goods/goods'
import Ratings from '../components/ratings/ratings'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active', //当切换到某个路由时，该路由的router-link会被赋予router-link-active（默认值）的class名，这里手动将其改为active（方便书写）
  routes: [
    {
      path: '/',
      redirect: 'goods'    //路由重定向，让页面一开始加载进来时就显示seller中的内容
    },
    {
      path: '/seller',
      name: 'Seller',
      component: Seller
    },
    {
      path: '/goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/ratings',
      name: 'Ratings',
      component: Ratings
    }
  ]
})

