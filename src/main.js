import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'normalize.css/normalize.css';
import Vant from 'vant';
import 'vant/lib/index.css';
// 用于自动设置 rem 基准值
import 'amfe-flexible';
import '@/styles/index.less';
import 'utils/date';
Vue.use(Vant);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
