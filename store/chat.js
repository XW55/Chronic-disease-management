export default {
  namespaced: true,
  state: () => ({
    SocketState: {},
    SocketStateErr: {},
  }),
  mutations: {
    SET_SOCKET_STATE(state, info) {
      state.SocketState = info;
    },
    setSOCKET_STATEErr(state, info) {
      state.SocketStateErr = info;
    },
  },
};
