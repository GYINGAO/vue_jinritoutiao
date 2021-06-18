import Vue from 'vue';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
Vue.prototype.moment = moment;

Vue.filter('relativeTime', value => moment(value).fromNow());
Vue.filter('formatDate', value => moment(value).format('YYYY-MM-DD'));
