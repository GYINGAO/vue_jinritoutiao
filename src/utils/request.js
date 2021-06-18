import axios from 'axios';
import store from '@/store';
import router from '@/router';
import { Toast, Dialog } from 'vant';

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn',
  timeout: 10 * 1000
});

// 添加请求拦截器
request.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = 'Bearer ' + store.getters.token;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么

    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data;
  },
  error => {
    // 对响应错误做点什么
    const status = error?.response?.status;
    if (status === 500) {
      Toast({
        message: '服务器开小差了',
        position: 'bottom'
      });
    } else if (status === 401) {
      return Dialog.confirm({
        title: '未授权的访问',
        message: '登录状态过期，请重新登录'
      })
        .then(() => {
          router.push('/login');
        })
        .catch(() => {
          // on cancel
        });
    }
    return Promise.reject(error);
  }
);

export default request;
