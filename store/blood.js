export default {
  namespaced: true,
  state: () => ({
    deviceId: '',
    deviceName: '',
    serviceId: '',
    BPMCharacteristicId: '',
    RACPCharacteristicId: '',
  }),
  mutations: {
    changeDeviceId(state, deviceId) {
      state.deviceId = deviceId;
    },
    changeDeviceName(state, deviceName) {
      state.deviceName = deviceName;
    },
    changeServiceId(state, serviceId) {
      state.serviceId = serviceId;
    },
    changeBPMCharacteristicId(state, characteristicId) {
      state.BPMCharacteristicId = characteristicId;
    },
    changeRACPCharacteristicId(state, characteristicId) {
      state.RACPCharacteristicId = characteristicId;
    },
    resetData(state) {
      state.deviceId = '';
      state.deviceName = '';
      state.serviceId = '';
      state.BPMCharacteristicId = '';
      state.RACPCharacteristicId = '';
    },
  },
};
