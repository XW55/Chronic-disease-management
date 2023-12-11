// 导入 Vue 和 vuex 模块
import Vue from 'vue';
import Vuex from 'vuex';
// 血压蓝牙
import blood from './blood.js';
import chatStore from './chat.js';
// 将 vuex 安装为 Vue 的插件
Vue.use(Vuex);
// 创建 store 的实例对象并向外共享
export default new Vuex.Store({
  // 挂载 store 模块
  modules: {
    blood,
    chatStore,
  },
  state: {
    deviceName: '',
    deviceSN: '',
    deviceVersion: '',
    bleConnectState: false,
  },
  // 相当于computed
  getters: {
    bleConnectState(state) {
      return state.bleConnectState;
    },
  },
  // 相当于methods
  mutations: {
    GET_IS_DOCTOR: (state) => {
      state.isDoctor = Boolean(uni.getStorageSync('isDoctor'));
    },
    SET_IS_DOCTOR: (state, isDoctor) => {
      state.isDoctor = isDoctor;
    },
    ADD_LIST_NUM: (state) => {
      state.listNum++;
    },
    CLEAR_DEVICE: (state) => {
      state.deviceName = '';
      state.deviceSN = '';
      state.deviceVersion = '';
      state.bleConnectState = false;
      state.isDoctor = false;
    },
    // 设备名字
    changeDeviceNameStatus: (state, deviceName) => {
      state.deviceName = deviceName;
    },
    // 更改设备
    changeDeviceSNStatus: (state, deviceSN) => {
      state.deviceSN = deviceSN;
    },
    // 更改设备版本状态
    changeDeviceVersionStatus: (state, deviceVersion) => {
      state.deviceVersion = deviceVersion;
    },
    // 更改 BLE 连接
    changeBleConnectStatus: (state, bleConnectState) => {
      state.bleConnectState = bleConnectState;
    },
  },
});
