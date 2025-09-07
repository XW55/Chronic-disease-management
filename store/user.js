export default {
  namespaced: true,
  state: () => ({
    userInfo: {}
  }),
  mutations: {
    SET_USERINFO(state, info) {
      state.userInfo = info;
      console.log('vuex中的', state.userInfo);
    },
  },
};