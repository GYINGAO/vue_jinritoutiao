import Vue from 'vue';
import Vuex from 'vuex';
import { getItem, setItem } from 'utils/storage';

Vue.use(Vuex);

const USER_KEY = 'TOUTIAO_USER';

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY)
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
      setItem(USER_KEY, data);
    }
  },
  actions: {},
  modules: {},
  getters: {
    token: state => state?.user?.token ?? '',
    refreshToken: state => state?.user?.refresh_token ?? ''
  }
});
