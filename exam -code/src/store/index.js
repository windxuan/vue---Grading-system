import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters/getters';
import mutations from './mutations/mutations';
import actions from './actions/actions';
import State from './state/index';

Vue.use(Vuex);

// modules

// 定义store
// vuex中的状态是相应的
const store = new Vuex.Store({
  state: State,
  getters,
  mutations,
  actions,
});

export default store;
