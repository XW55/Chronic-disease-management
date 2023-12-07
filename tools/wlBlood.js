import vueStore from '@/store/index.js';

module.exports = {
  initialize,
  linkBle,
  closeBluetooth,
  getLastData,
};

function swap(data) {
  const a = data[0];
  const b = data[1];
  const c = data[2];
  const d = data[3];
  return [c, d, a, b].join('');
}

/**
 * 数据处理
 * @param data
 * @returns {{systolic: string, diastolic: string, mean: string, measurementStatus: string, flags: string, userId: number}}
 */
function dataProcessing(data) {
  // 取消data的空格
  data = data.replace(/\s+/g, '');
  // 分割data
  const flagsData = data.substring(0, 1);
  const systolicData = data.substring(2, 5);
  const diastolicData = data.substring(6, 9);
  const meanData = data.substring(10, 13);
  const yearData = swap(data.substring(14, 17));
  const monthData = data.substring(18, 19);
  const dayData = data.substring(20, 21);
  const hourData = data.substring(22, 23);
  const minData = data.substring(24, 25);
  const secData = data.substring(26, 27);
  const pulseData = swap(data.substring(28, 31));
  const userIdData = data.substring(32, 33);
  const measurementStatusData = swap(data.substring(34, 37));

  // 数据处理
  const flags = parseInt(flagsData, 16).toString(2);
  const systolic = `${parseInt(systolicData.slice(0, 2), 16)}.${parseInt(systolicData.slice(2, 4), 16)}`;
  const diastolic = `${parseInt(diastolicData.slice(0, 2), 16)}.${parseInt(diastolicData.slice(2, 4), 16)}`;
  const mean = `${parseInt(meanData.slice(0, 2), 16)}.${parseInt(meanData.slice(2, 4), 16)}`;
  const year = parseInt(yearData, 16);
  const month = parseInt(monthData, 16);
  const day = parseInt(dayData, 16);
  const hour = parseInt(hourData, 16);
  const min = parseInt(minData, 16);
  const sec = parseInt(secData, 16);
  const pulse = parseInt(pulseData, 16);
  const userId = parseInt(userIdData, 16);
  // 十六进制转二进制，保留所有的0
  const measurementStatus = parseInt(measurementStatusData, 16).toString(2).padStart(16, '0');
  return {
    systolic, // 收缩压
    diastolic, // 舒张压
    mean, // 平均动脉压
    pulse, // 脉搏
  };
}

function wlConnectBle(deviceId) {

}

function onlyConnect(deviceId, callback) {
  uni.createBLEConnection({
    deviceId,
    success(res) {
      console.log('连接成功');
      callback({
        errCode: 0,
        errMsg: '连接成功',
      });
    },
    fail(res) {
      console.log('连接失败');
      callback({
        errCode: 10000,
        errMsg: '连接失败',
      });
    },
  });
}

/**
 * 获取蓝牙设备所有服务(service)
 * @param callback
 */
function openBluetoothAdapter(callback) {
  uni.openBluetoothAdapter({
    success(res) {
      uni.onBLEConnectionStateChange((res) => {
        console.log('监听蓝牙连接情况正常', res);
        // 监听蓝牙连接情况
        // store.commit('changeBleConnectStatus', res.connected)
      });
      callback({
        errCode: 0,
      });
    },
    fail(res1) {
      console.log('监听蓝牙连接情况,fail', res1);
      callback({
        errCode: res1.errCode,
      });
    },
  });
}

// 判断蓝牙连接状态
function judgeLocaltion(noLinkCallback) {
  const sysInfo = uni.getSystemInfoSync();
  // #ifdef MP-WEIXIN
  if (!sysInfo.bluetoothEnabled) {
    if (sysInfo.platform === 'ios') {
      const AppAuth = uni.getAppAuthorizeSetting();
      if (AppAuth.bluetoothAuthorized == 'denied') {
        uni.showToast({
          title: '请设置微信使用蓝牙权限，用于设备的连接',
          icon: 'none',
          duration: 3000,
        });
        noLinkCallback(0x02);
        return false;
      }
    }
    uni.showToast({
      title: '请打开蓝牙，用于设备的连接',
      icon: 'none',
      duration: 3000,
    });
    noLinkCallback(0x02);
    return false;
  }
  // #endif
  if (sysInfo.platform == 'ios') {
    return true;
  }
  // #ifdef MP-WEIXIN
  if (sysInfo.locationAuthorized) {
    if (sysInfo.locationEnabled) {
      return true;
    } else {
      uni.showToast({
        title: '请开启定位功能，用于设备的连接',
        icon: 'none',
        duration: 3000,
      });
      noLinkCallback(0x02);
      return false;
    }
  } else {
    uni.showToast({
      title: '请设置微信使用定位权限，用于设备的连接',
      icon: 'none',
      duration: 3000,
    });
    noLinkCallback(0x02);
    return false;
  }
  // #endif
}

function closeBluetooth(callback) {
  uni.stopBluetoothDevicesDiscovery({
    success(res) {
      console.log('关闭蓝牙搜索成功', res);
      uni.closeBluetoothAdapter({
        success(res) {
          console.log('关闭蓝牙模块成功');
          console.log('销毁蓝牙结束');
          if (callback) {
            callback();
          }
        },
        fail(res1) {
          console.log('关闭蓝牙模块失败', res1);
        },
      });
    },
    fail(res1) {
      console.log('关闭蓝牙搜索失败', res1);
    },
  });
}

function initialize(callback) {
  if (judgeLocaltion(callback)) {
    link(callback);
  }
}

function link(callback) {
  openBluetoothAdapter((res) => {
    if (res.errCode === 0) {
      callback(0x06);
      getBleList(callback);
    } else {
      callback(0x02, res);
    }
  });
}

function judgementBle(callback) {
  uni.getBluetoothAdapterState({
    success: (res) => {
      console.log('蓝牙状态', res);
    },
    fail: (res1) => {
      console.log('蓝牙状态错误', res1);
    },
  });
}

function getBleList(callback) {
  console.log('开始获取蓝牙列表');
  uni.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true,
    success(res) {
      console.log('开始获取蓝牙列表成功，开始监听蓝牙设备');
      uni.onBluetoothDeviceFound((res) => {
        if (res.devices[0].name) {
          console.log(res.devices[0].name);
        }
        if (res.devices[0].name.indexOf('Yuwell') !== -1) {
          // 获取蓝牙列表成功
          console.log('获取鱼跃蓝牙设备成功');
          linkBle(res.devices[0].deviceId, callback);
        }
      });
    },
    fail(res1) {
      console.log('获取蓝牙设备失败', res1);
      // 获取蓝牙列表失败
      // store.commit('changeBleList', [])
    },
  });
}

function linkBle(deviceId, callback) {
  uni.stopBluetoothDevicesDiscovery({
    success: (res) => {
      console.log('关闭蓝牙搜索');
      console.log('开始连接设备');
      const time = new Date();
      uni.createBLEConnection({
        deviceId,
        timeout: 10000,
        success: (res) => {
          const time2 = new Date();
          const time3 = time2 - time;
          console.log('连接设备成功,耗时', time3);
          vueStore.commit('blood/changeDeviceId', deviceId);
          callback(0x03);
          // 关闭蓝牙搜索
          // uni.stopBluetoothDevicesDiscovery({
          //   success: (res2) => {
          getfeatures(deviceId, callback);
          // },
          // });
        },
        fail: (err) => {},
      });
    },
  });
}

const bloodUuid = [];
const batteryUuid = [];
const characterId = [];

function getfeatures(deviceId, callback) {
  console.log('开始获取蓝牙特征值');
  uni.getBLEDeviceServices({
    deviceId,
    success: (res) => {
      console.log('获取蓝牙特征值成功');
      res.services.forEach((item, index) => {
        if (item.uuid.indexOf('1810') === 4) {
          bloodUuid.push(item.uuid);
          vueStore.commit('blood/changeServiceId', item.uuid);
          getChartId(deviceId, item.uuid, callback);
        }
        if (item.uuid.indexOf('180f') === 4) {
          batteryUuid.push(item.uuid);
        }
      });
    },
  });
}

function getChartId(deviceId, serviceId, callback) {
  console.log('开始获取蓝牙服务码');
  uni.getBLEDeviceCharacteristics({
    deviceId,
    serviceId,
    success: (res) => {
      console.log('获取蓝牙服务码成功');
      res.characteristics.forEach((item, index) => {
        if (item.uuid.indexOf('2A52') !== -1) {
          vueStore.commit('blood/changeRACPCharacteristicId', item.uuid);
        }
        if (item.uuid.indexOf('2A35')) {
          characterId.push(item.uuid);
          vueStore.commit('blood/changeBPMCharacteristicId', item.uuid);
          getBloodData(deviceId, serviceId, item.uuid, callback);
        }
      });
    },
  });
}

function getBloodData(deviceId, serviceId, characterId, callback) {
  uni.notifyBLECharacteristicValueChange({
    deviceId,
    serviceId,
    characteristicId: characterId,
    state: true,
    success: (res) => {
      listenBle(callback, deviceId);
      uni.onBLECharacteristicValueChange((res) => {
        console.log('监听蓝牙数据');
        console.log(res);
        if (res.characteristicId.indexOf('2A35') !== -1) {
          const hex = arrayBuffer2Hex(res.value);
          console.log('hex');
          console.log(hex);
          const time = new Date();
          callback(0x01, {
            data: dataProcessing(hex),
            callback: getBleList,
            time,
          });
        }
      });
    },
  });
}

function listenBle(callback, deviceId) {
  // 监听蓝牙连接状态
  uni.onBLEConnectionStateChange((res) => {
    console.log('蓝牙状态发生改变');
    console.log(res);
    if (!res.connected) {
      vueStore.commit('blood/resetData');
      callback(0x04);
      console.log('重新获取蓝牙列表');
      uni.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: true,
        success(res) {
          console.log('开始获取蓝牙列表成功，开始监听蓝牙设备');
          uni.onBluetoothDeviceFound((res) => {
            if (res.devices[0].name) {
              console.log(res.devices[0].name);
            }
            if (res.devices[0].deviceId === deviceId) {
              // 获取蓝牙列表成功
              console.log('获取蓝牙设备成功');
              linkBleToo(res.devices[0].deviceId, callback);
            }
          });
        },
        fail(res1) {
          console.log('获取蓝牙设备失败2', res1);
          // 获取蓝牙列表失败
          // store.commit('changeBleList', [])
        },
      });
    }
  });
}

function linkBleToo(deviceId, callback) {
  uni.stopBluetoothDevicesDiscovery({
    success: (res) => {
      console.log('关闭蓝牙搜索');
      console.log('开始连接设备');
      const time = new Date();
      uni.createBLEConnection({
        deviceId,
        timeout: 10000,
        success: (res) => {
          const time2 = new Date();
          const time3 = time2 - time;
          console.log('连接设备成功,耗时', time3);
          vueStore.commit('blood/changeDeviceId', deviceId);
          callback(0x05);
          // 关闭蓝牙搜索
          // uni.stopBluetoothDevicesDiscovery({
          //   success: (res2) => {
          getfeatures(deviceId, callback);
          // },
          // });
        },
        fail: (err) => {},
      });
    },
  });
}

function arrayBuffer2Hex(buffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    (bit) => {
      return (`00${bit.toString(16)}`).slice(-2);
    }
  );
  return hexArr.join('');
}

function getLastData(str) {
  console.log('开始发送数据');
  uni.writeBLECharacteristicValue({
    deviceId: vueStore.state.blood.deviceId,
    serviceId: vueStore.state.blood.serviceId,
    characteristicId: vueStore.state.blood.RACPCharacteristicId,
    value: string2buffer('0106'),
    success: (res) => {
      console.log('发送成功');
      uni.$showMsg('数据获取成功', 'success');
      console.log(res);
    },
    fail: (err) => {
      console.log('发送失败');
      // uni.$showMsg('数据获取失败', 'error');
      console.log(err);
    },
  });
}

function string2buffer(str) {
  const typedArray = new Uint8Array(str.match(/[\da-f]{2}/gi).map((h) => {
    return parseInt(h, 16);
  }));
  return typedArray.buffer;
}
