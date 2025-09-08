import { uniq, orderBy } from 'lodash-es';

export default {
  namespaced: true,
  state: {
    devices: [], // 设备列表
    ecg_card: {}, // 心电卡
    ecg_belt: {}, // 心电带
    smart_watch: {}, // 智能手表
    other_connect: {}, // 其他设备
  },
  mutations: {
    SET_DEVICES(state, devices) {
      if (!devices?.length) return;
      const ids = new Set(devices.map((device) => device.deviceId));
      const newDevices = state.devices.filter((device) => !ids.has(device.deviceId));
      state.devices = orderBy(uniq([...newDevices, ...devices]), ['name'], ['asc']);
    },
    SET_DEVICES_REFRESH(state) {
      state.devices = [];
    },
    SET_CONNECTED_DEVICE(state, { deviceId, name, type, status }) {
      if (status === 3) {
        state.ecg_card = {};
        state.ecg_belt = {};
        state.smart_watch = {};
        state.other_connect = {};
      } else {
        const map = { 0: {}, 1: { deviceId, name } };
        state[type || 'other_connect'] = map[status];
      }
    },
  },
};
