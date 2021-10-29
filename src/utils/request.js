import axios from 'axios';
import store from '@/store';
import router from '@/router';
import { Toast, Dialog } from 'vant';
import JSONbig from 'json-bigint';

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn',
  timeout: 10 * 1000,
  transformResponse: [
    function(data) {
      try {
        return JSONbig.parse(data);
      } catch (err) {
        console.log(err);
      }
      return data;
    }
  ]
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
  async error => {
    // 对响应错误做点什么
    const status = error?.response?.status;
    if (status >= 500) {
      Toast.fail({
        message: '服务器开小差了',
        position: 'bottom'
      });
    } else if (status === 401) {
      const user = store.state.user;
      if (!user || !user.refresh_token) {
        Dialog.confirm({
          title: '未授权的访问',
          message: '登录状态过期，请重新登录'
        }).then(() => {
          redirectLogin();
        });
      } else {
        try {
          const res = await axios({
            method: 'PUT',
            url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
            headers: {
              Authorization: `Bearer ${user.refresh_token}`
            }
          });

          // 如果获取成功，则把新的 token 更新到容器中
          console.log('刷新 token  成功', res);
          store.commit('setUser', {
            token: res.data.data.token, // 最新获取的可用 token
            refresh_token: user.refresh_token // 还是原来的 refresh_token
          });
          // 把之前失败的用户请求继续发出去
          // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
          // return 把 request 的请求结果继续返回给发请求的具体位置
          return request(error.config);
        } catch (err) {
          // 如果获取失败，直接跳转 登录页
          console.log('请求刷线 token 失败', err);
          Dialog.confirm({
            title: '未授权的访问',
            message: '登录状态过期，请重新登录'
          }).then(() => {
            redirectLogin();
          });
        }
      }
    } else if (status === 403) {
      Toast.fail({
        message: '禁止访问',
        forbidClick: true
      });
    } else if (status === 404) {
      Toast.fail({
        message: '请求资源不存在',
        forbidClick: true
      });
    }
    return Promise.reject(error);
  }
);
function redirectLogin() {
  // router.currentRoute 当前路由对象，和你在组件中访问的 this.$route 是同一个东西
  // query 参数的数据格式就是：?key=value&key=value
  router.replace({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
}
export default request;
