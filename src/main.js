import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

import 'common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);
let app = Vue.extend(App);
let router = new VueRouter({
  linkActiveClass: 'active'// 设置被点击tab的类名
});
// 定义路由
router.map({
 '/goods': {
   component: goods
  },
  '/ratings': {
    component: ratings
  },
  '/seller': {
    component: seller
  }
});
// 将app组件挂着‘#app’上面
router.start(app, '#app');
// 默认在goods页面
router.go('/goods');
