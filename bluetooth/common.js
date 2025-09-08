/**
 * 检查当前平台蓝牙权限是否开启，支持微信小程序、H5、原生安卓、iOS
 */
export async function checkBluetoothPermission() {
  const sysInfo = uni.getSystemInfoSync()

  // 检查定位服务（所有平台）
  if (typeof sysInfo.locationEnabled !== 'undefined' && !sysInfo.locationEnabled) {
    uni.showToast({ title: '请开启定位服务，否则可能无法正常连接蓝牙设备', icon: 'none', duration: 3000 })
    return false
  }

  if (!sysInfo.bluetoothEnabled) {
    if (sysInfo.platform === 'ios') {
      const AppAuth = uni.getAppAuthorizeSetting()
      if (AppAuth.bluetoothAuthorized === 'denied') {
        uni.showToast({ title: '请设置微信使用蓝牙权限，用于设备的连接', icon: 'none', duration: 3000 })
        return false
      }
    }
    uni.showToast({ title: '请打开蓝牙，用于设备的连接', icon: 'none', duration: 3000 })
    return false
  }
  return true
}

export function dataToHexString(data, separator = ' ', prefix = true) {
  if (!data) return ''

  let uint8Array

  if (data instanceof ArrayBuffer) {
    uint8Array = new Uint8Array(data)
  } else if (data instanceof Uint8Array) {
    uint8Array = data
  } else if (Array.isArray(data)) {
    uint8Array = new Uint8Array(data)
  } else {
    return ''
  }

  const hexArray = Array.from(uint8Array, (byte) => {
    const hex = byte.toString(16).padStart(2, '0').toUpperCase()
    return prefix ? `0x${hex}` : hex
  })

  return hexArray.join(separator)
}
