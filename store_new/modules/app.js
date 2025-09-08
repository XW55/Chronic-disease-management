export default {
  namespaced: true,
  state: {
    isHide: false,
  },
  mutations: {
    SET_APP_HIDE(state, isHide) {
      state.isHide = isHide;
    },
  },
};
