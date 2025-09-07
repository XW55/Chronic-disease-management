// 导入 Vue 和 vuex 模块
import Vue from 'vue';
import Vuex from 'vuex';
// 血压蓝牙
import blood from './blood.js';
import chatStore from './chat.js';
import user from './user.js';
// 将 vuex 安装为 Vue 的插件
Vue.use(Vuex);

// const modulesFiles = require.context('./modules', true, /\.js$/);

// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
//   const value = modulesFiles(modulePath);
//   modules[moduleName] = value.default;
//   return modules;
// }, {});

// const store = new Vuex.Store({
//   modules,
// });

// 创建 store 的实例对象并向外共享
export default new Vuex.Store({
  // 挂载 store 模块
  modules: {
    blood,
    chatStore,
    user
  },
  state: {
    deviceName: '',
    deviceSN: '',
    deviceVersion: '',
    bleConnectState: false,

    // 
    // 文字大小
    page_font_size: uni.getStorageSync('page_font_size') || 'page_font_size',
    // 导航栏高度
    StatusBar: {
      statusBar: 0,
      customBar: 0,
    },
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


    // 设置导航栏高度
    SET_STATUSBAR(state, value) {
      state.StatusBar = value
    },
    SET_page_font_size(state, value) {
      state.page_font_size = value
      uni.setStorage({
        key: 'page_font_size',
        data: value,
        success: function() {}
      });
    }
  },
});