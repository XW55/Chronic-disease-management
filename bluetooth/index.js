import store from '@/store_new'
import deviceConfig from './device.json'
import { deepGetValues } from './utils'
import { checkBluetoothPermission, dataToHexString } from './common'
import { get, map } from 'lodash-es'

const devices = new Map() // 存储设备状态

export async function handleDeviceReconnection() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  await openBluetoothAdapter()
  await new Promise((resolve) => setTimeout(resolve, 100))
  const services = deepGetValues(deviceConfig, 'serviceId')
  const connected = await getConnectedBluetoothDevices(services)
  for (const deviceId of devices.keys()) {
    const find = connected.find((i) => i.deviceId === deviceId)
    if (find) {
      const { name, type } = devices.get(deviceId)
      store.commit('bluetooth/SET_CONNECTED_DEVICE', { type, status: 1, deviceId, name })
    } else {
      maxExecutionCount(devices.get(deviceId), 5)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
}

/**
 * 扫描附近的蓝牙设备
 * @param {Object} options - 扫描选项
 * @param {Array|String} options.services - 服务ID
 * @param {boolean} options.allowDuplicates - 是否允许重复设备
 * @param {number} options.interval - 扫描间隔时间（毫秒）
 * @param {string} options.powerLevel - 扫描功率级别
 * @param {function} options.foundFilter - 设备过滤函数
 * @param {number} options.autoCloseTime - 自动停止扫描时间（秒）
 * @param {function} options.logger - 日志记录
 * @param {function} options.foundCallback - 发现设备回调函数
 * @returns {Promise<Object>} 扫描结果
 */

export async function scanBluetoothDevices({ services, allowDuplicates = false, interval, powerLevel, foundFilter, autoCloseTime = 30, logger, foundCallback } = {}) {
  await stopBluetoothDevicesDiscovery(logger)
  store.commit('bluetooth/SET_DEVICES_REFRESH') // 清空设备列表
  const check = await checkBluetoothPermission(logger)
  if (!check) return { success: false, errCode: 1, errMsg: '蓝牙权限未授权' }

  await openBluetoothAdapter() // 打开蓝牙适配器
  const start = await startBluetoothDevicesDiscovery({ services, allowDuplicates, interval, powerLevel, foundFilter, logger, foundCallback }) // 开始扫描设备

  if (autoCloseTime) {
    setTimeout(() => {
      stopBluetoothDevicesDiscovery(logger)
    }, autoCloseTime * 1000)
  }
  return start
}

export async function connectToDevice({ deviceId, name, serviceId, characteristicId, type, state, timeout, result, logger } = {}) {
  await openBluetoothAdapter() // 打开蓝牙适配器
  createOnStateChange({ logger }) // 创建连接状态变化监听器

  const connectId = store.state.bluetooth[type]?.deviceId
  if (connectId) await disconnectBLEDevice({ deviceId: connectId, logger })

  devices.set(deviceId, { deviceId, name, serviceId, characteristicId, type, state, timeout, logger })
  if (logger) console.log('----------------开始连接蓝牙设备----------------', deviceId)

  wx.createBLEConnection({
    deviceId,
    success() {
      if (logger) console.log('----------------连接蓝牙设备成功----------------', deviceId)
      setTimeout(() => {
        messageSubscription({ deviceId, name, serviceId, characteristicId, state, type, result, logger })
      }, 800)
    },
    fail(res) {
      if (logger) console.error('----------------连接蓝牙设备失败----------------', deviceId, res)
      result?.(false)
    },
    computed() {
      wx.stopBluetoothDevicesDiscovery()
    },
  })
}

let reconnecting = false

function createOnStateChange({ logger }) {
  if (reconnecting) return

  // TODO
  // 临时处理，避免和其他页面冲突

  uni.$on('bluetooth_new_state_change', async ({ connected, deviceId }) => {
    const device = devices.get(deviceId)
    if (!device) return
    console.warn('----------------蓝牙设备连接状态----------------', connected, device)
    if (!connected) {
      if (store.state.app.isHide) return
      store.commit('bluetooth/SET_CONNECTED_DEVICE', { type: device.type, status: 0 })
      maxExecutionCount(device, 5)
    }
    if (connected) {
      const { name, type } = device
      store.commit('bluetooth/SET_CONNECTED_DEVICE', { type, status: 1, deviceId, name })
    }
  })
  reconnecting = true
}

// 消息订阅
export async function messageSubscription({ deviceId, name, serviceId, characteristicId, state = true, type, result, logger }) {
  deviceId = deviceId || store.state.bluetooth[type]?.deviceId
  name = name || store.state.bluetooth[type]?.name
  if (!deviceId) return false

  const { serviceId: defaultServiceId, characteristicId: defaultCharacteristicId } = deviceConfig[type] || {}
  serviceId = serviceId || defaultServiceId
  characteristicId = characteristicId || defaultCharacteristicId?.['notify']
  if (serviceId && characteristicId) {
    notifyBLECharacteristicValueChange({ deviceId, name, serviceId, characteristicId, state, type, result, logger })
  } else {
    const services = map(deviceConfig[type], ({ serviceId, characteristicId }) => ({ serviceId, characteristicId }))
    for (const service of services) {
      const { serviceId, characteristicId } = service
      notifyBLECharacteristicValueChange({ deviceId, name, serviceId, characteristicId: characteristicId['notify'], state, type, result, logger })
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
}

function notifyBLECharacteristicValueChange({ deviceId, name, serviceId, characteristicId, state = true, type, result, logger }) {
  wx.getBLEDeviceServices({
    deviceId,
    success: () => {
      wx.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: () => {
          wx.notifyBLECharacteristicValueChange({
            deviceId,
            serviceId,
            characteristicId,
            state,
            success: () => {
              result?.(true)
              store.commit('bluetooth/SET_CONNECTED_DEVICE', { type, status: 1, deviceId, name })
              if (logger) console.log('----------------订阅特征值成功----------------', { deviceId, serviceId, characteristicId })
              wx.onBLECharacteristicValueChange(({ value, ...result }) => {
                uni.$emit('onBLECharacteristicValueChange', { ...result, value: new Uint8Array(value) })
              })
            },
            fail: (err) => {
              store.commit('bluetooth/SET_CONNECTED_DEVICE', { type, status: 0 })
              if (logger) console.warn('----------------订阅特征值失败----------------', err, { deviceId, serviceId, characteristicId })
              result?.(false)
            },
          })
        },
        fail: (err) => {
          if (logger) console.warn('----------------获取蓝牙设备特征值失败----------------', err, { deviceId, serviceId, characteristicId, state, type })
          result?.(false)
        },
      })
    },
    fail: (err) => {
      if (logger) console.warn('----------------获取蓝牙设备服务失败----------------', err, { deviceId, serviceId, characteristicId, state, type })
      result?.(false)
    },
  })
}

/**
 * 写入蓝牙特征值
 * @param {Object} options - 写入选项
 * @param {string} options.deviceId - 设备ID
 * @param {string} options.serviceId - 服务UUID
 * @param {string} options.characteristicId - 特征值UUID
 * @param {Uint8Array} options.value - 要写入的值
 * @param {string} options.writeType - 写入类型（'write' 或 'writeNoResponse'）
 * @param {string} options.type - 设备类型，用于获取默认的 serviceId 和 characteristicId
 * @param {function} options.logger - 日志记录函数
 * @returns {Promise<boolean>} 是否成功写入特征值
 */

export async function writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, value, writeType, type, logger }) {
  deviceId = deviceId || store.state.bluetooth[type?.split('.')?.[0]]?.deviceId
  if (!deviceId) return false
  const { serviceId: defaultServiceId, characteristicId: defaultCharacteristicId } = get(deviceConfig, type, {})
  serviceId = serviceId || defaultServiceId
  characteristicId = characteristicId || defaultCharacteristicId['write']

  return new Promise((resolve) => {
    wx.writeBLECharacteristicValue({
      deviceId,
      serviceId,
      characteristicId,
      writeType,
      value,
      success: (res) => {
        if (logger) console.log('----------------写入特征值成功----------------', res, deviceId, dataToHexString(value))
        resolve(true)
      },
      fail: (err) => {
        if (logger) console.warn('----------------写入特征值失败----------------', err, deviceId, dataToHexString(value))
        resolve(false)
      },
    })
  })
}

// 断开蓝牙设备连接
export async function disconnectBLEDevice({ deviceId, logger }) {
  const { type } = devices.get(deviceId)
  devices.delete(deviceId)
  return new Promise((resolve) => {
    uni.closeBLEConnection({
      deviceId,
      success: (res) => {
        if (logger) console.log('----------------断开蓝牙设备连接成功----------------', res)
        resolve(true)
      },
      fail: (err) => {
        if (logger) console.warn('----------------断开蓝牙设备连接失败----------------', err)
        resolve(false)
      },
      complete: () => {
        // TODO
        // uni.$off('bluetooth_new_state_change');
        store.commit('bluetooth/SET_CONNECTED_DEVICE', { type, status: 0 })
      },
    })
  })
}

// 停止扫描附近的蓝牙设备
export function stopBluetoothDevicesDiscovery(logger) {
  return new Promise((resolve) => {
    wx.stopBluetoothDevicesDiscovery({
      success: (res) => {
        if (logger) console.log('----------------停止扫描附近的蓝牙设备----------------', res)
        resolve(true)
      },
      fail: (err) => {
        stopBluetoothDevicesDiscovery() // 如果停止扫描失败，尝试再次停止
        resolve(false)
      },
    })
  })
}

// 扫描附近的蓝牙设备
export function startBluetoothDevicesDiscovery({ services, allowDuplicatesKey = true, interval, powerLevel = 'high', foundFilter, logger, foundCallback } = {}) {
  return new Promise((resolve) => {
    wx.startBluetoothDevicesDiscovery({
      services,
      allowDuplicatesKey,
      interval,
      powerLevel,
      success: ({ isDiscovering, errCode, errMsg }) => {
        if (logger) console.log('----------------开始扫描附近的蓝牙设备----------------', { isDiscovering, errCode, errMsg })
        onBluetoothDeviceFound({ foundFilter, foundCallback, logger })
        resolve({ success: true, isDiscovering, errCode, errMsg })
      },
      fail: (err) => {
        if (logger) console.warn('----------------开始扫描附近的蓝牙设备失败----------------', err)
        resolve({ success: false, ...err })
      },
    })
  })
}

// 监听蓝牙设备发现事件
export function onBluetoothDeviceFound({ foundFilter, foundCallback, logger } = {}) {
  return new Promise((resolve) => {
    wx.onBluetoothDeviceFound(({ devices }) => {
      if (foundFilter) devices = devices.filter(foundFilter) // 根据过滤条件筛选设备
      if (!devices?.length) return
      // if (logger) console.log('----------------发现蓝牙设备----------------', devices);
      store.commit('bluetooth/SET_DEVICES', devices) // 更新设备列表
      foundCallback?.(devices) // 调用回调函数
      resolve(devices)
    })
  })
}

// 初始化蓝牙模块
export function openBluetoothAdapter(logger) {
  return new Promise((resolve) => {
    wx.openBluetoothAdapter({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      },
    })
  })
}

async function getConnectedBluetoothDevices(services) {
  return new Promise((resolve) => {
    wx.getConnectedBluetoothDevices({
      services,
      success({ devices }) {
        resolve(devices)
      },
      fail() {
        resolve([])
      },
    })
  })
}

function maxExecutionCount(params, count) {
  if (count <= 0) return
  connectToDevice({
    ...params,
    result: (s) => {
      console.warn('maxExecutionCount', `第${count}次执行：${s}`)
      if (!s) {
        setTimeout(() => {
          maxExecutionCount(params, count - 1)
        }, 2000)
      }
    },
  })
}
