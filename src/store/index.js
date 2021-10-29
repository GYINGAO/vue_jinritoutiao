import Vue from 'vue';
import Vuex from 'vuex';
import { getItem, setItem } from 'utils/storage';

Vue.use(Vuex);

const USER_KEY = 'TOUTIAO_USER';

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY),
    cachePages: ['Layout']
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
      setItem(USER_KEY, data);
    },
    addCachePage(state, pageName) {
      if (!state.cachePages.includes(pageName)) state.cachePages.push(pageName);
    },
    removeCachePage(state, pageNmae) {
      const index = state.cachePages.indexOf(pageNmae);
      if (index > -1) {
        state.cachePages.splice(index, 1);
      }
    }
  },
  actions: {},
  modules: {},
  getters: {
    token: state => state?.user?.token ?? '',
    refreshToken: state => state?.user?.refresh_token ?? ''
  }
});
