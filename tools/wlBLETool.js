module.exports = {
	openBluetoothAdapter: openBluetoothAdapter,
	connectBLE: connectBLE,
	setBLEDataCallback: setBLEDataCallback,
	closeBLEConnection: closeBLEConnection,
	startBluetoothDevicesDiscovery: startBluetoothDevicesDiscovery,
	judgeLocaltion: judgeLocaltion,
	getBleErrorMessage: getBleErrorMessage
}


let g_wlBLE_Max_connectTimes = 5
let g_wlBLE_connectTimes = 0
let g_wlBLE_FinshCallback = null
let g_wlBLE_ConnectCallback = null
let g_wlBLE_DataCallback = null

function setBLEDataCallback(wlBLE_DataCallback) {
	g_wlBLE_DataCallback = wlBLE_DataCallback
}

function connectBLE(times, finshCallback, connectCallback) {
	if (times) {
		g_wlBLE_Max_connectTimes = times
	} else {
		g_wlBLE_Max_connectTimes = 5
	}
	g_wlBLE_connectTimes = 1
	g_wlBLE_FinshCallback = finshCallback
	g_wlBLE_ConnectCallback = connectCallback
	let deviceId = uni.getStorageSync("deviceId")
	WLConnectBLE(deviceId, connectResult)
}
//全局连接蓝牙函数
function WLConnectBLE(deviceId, callback) {
	onlyConnect(deviceId, function(res) {
		if (res.errCode === 10000) {
			openBluetoothAdapter(function(res) {
				if (res.errCode === 0) {
					WLConnectBLE(deviceId, callback)
				} else {
					callback(res)
				}
			})
		} else {
			callback(res)
		}
	})
}

function connectResult(data) {
	if (g_wlBLE_ConnectCallback) {
		g_wlBLE_ConnectCallback({
			errCode: data.errCode,
			connectTimes: g_wlBLE_connectTimes
		})
	}

	//如果次数用完就返回
	g_wlBLE_connectTimes++
	if (g_wlBLE_connectTimes >= g_wlBLE_Max_connectTimes) {
		g_wlBLE_FinshCallback(data)
	} else {
		let errCode = data.errCode;
		if (errCode === 0) {
			let deviceId = uni.getStorageSync('deviceId')
			notifyBLECharacteristicValueChange(deviceId, dealCharacteristicValueChangeRes)
		} else if (errCode === 0 || errCode === -1) {
			let deviceId = uni.getStorageSync('deviceId')
			notifyBLECharacteristicValueChange(deviceId, dealCharacteristicValueChangeRes)
		} else if (errCode === 10004 || errCode === 10005) { //如果是服务特征值问题需要关闭蓝牙再开启再连接
			uni.closeBluetoothAdapter({
				complete(res) {
					WLConnectBLE(connectResult)
				},
			});
		} else if (errCode === 10013 || errCode === 10001) {
			//无效的mac地址和蓝牙未打开
			g_wlBLE_FinshCallback(data)
		} else {
			WLConnectBLE(connectResult)
		}
	}
}

function dealCharacteristicValueChangeRes(data) {
	if (data.errCode === 0) {
		uni.onBLECharacteristicValueChange(function(res) {
			let unit8Arr = new Uint8Array(res.value)
			if (g_wlBLE_DataCallback) {
				g_wlBLE_DataCallback(unit8Arr)
			}
		})
	}
	g_wlBLE_FinshCallback(data) //回调返回
}


function closeBLEConnection(callback) {
	let deviceId = uni.getStorageSync("deviceId")
	// g_wlBLE_fiveMeanHRs = []
	// g_DeivceElectricitys = []
	// g_Temperatures = []
	if (deviceId) {
		uni.closeBLEConnection({
			deviceId,
			complete(info) {
				uni.closeBluetoothAdapter({
					complete(info1) {
						if (callback) {
							callback(info1)
						}
					}
				})
			}
		})
	} else {
		if (callback) {
			callback({
				errCode: 0
			})
		}
	}
}

const serviceId = "974CBE30-3E83-465E-ACDE-6F92FE712134"
const characteristicId = "974CBE31-3E83-465E-ACDE-6F92FE712134"
const characteristicIdWrite = "974CBE32-3E83-465E-ACDE-6F92FE712134"

function openBluetoothAdapter(callback) {
	uni.openBluetoothAdapter({
		success(res) {
			uni.onBLEConnectionStateChange(function(res) {
				console.log('监听蓝牙连接情况正常',res)
				//监听蓝牙连接情况
				// store.commit('changeBleConnectStatus', res.connected)
			})
			callback({
				errCode: 0
			})
		},
		fail(res1) {
			console.log('监听蓝牙连接情况,fail',res1)
			callback({
				errCode: res1.errCode
			})
		}
	})
}
//连接设备到获取服务 不监听
function onlyConnect(deviceId, callback) {
	let timeout = 5000
	uni.createBLEConnection({
		deviceId,
		timeout,
		success(res) {
			getWLBLEDeviceServices(deviceId, 0, callback)
		},
		fail(err) {
			if (err.errCode === -1) { //已经连接了
				getWLBLEDeviceServices(deviceId, -1, callback)
			} else {
				callback(err)
			}
		}
	})
}
//连接成功后通知监听特征值
function notifyBLECharacteristicValueChange(deviceId, callback) {
	uni.notifyBLECharacteristicValueChange({
		state: true,
		deviceId,
		serviceId,
		characteristicId,
		success(res) {
			callback({
				errCode: 0
			})
		},
		fail(err) {
			callback(err)
		}
	})
}

function getWLBLEDeviceServices(deviceId, errCode, callback) {
	uni.getBLEDeviceServices({
		deviceId,
		success(res) {
			uni.getBLEDeviceCharacteristics({
				deviceId,
				serviceId,
				success(res) {
					callback({
						errCode: errCode
					})
				},
				fail(err) {
					callback(err)
				}
			})
		},
		fail(err) {
			callback(err)
		}
	})
}

function startBluetoothDevicesDiscovery() {
	return new Promise((resolve, reject) => {
		openBluetoothAdapter(function(res) {
			if (res.errCode === 0) {
				uni.startBluetoothDevicesDiscovery({
					powerLevel: 'high',
					success(res) {
						resolve(res);
					},
					fail(res1) {
						uni.showToast({
							title: '蓝牙搜索失败',
							icon: 'none',
							duration: 3000
						})
						reject(res1);
					}
				})
			} else {
				reject(res);
			}
		})
	})
}

///////////////////
function judgeLocaltion() {
	let mobileInfo = uni.getSystemInfoSync()
	if (!mobileInfo.bluetoothEnabled) {
		if (mobileInfo.platform === 'ios') {
			let AppAuth = uni.getAppAuthorizeSetting()
			if (AppAuth.bluetoothAuthorized == "denied") {
				uni.showToast({
					title: '请设置微信使用蓝牙权限，用于设备的连接',
					icon: 'none',
					duration: 3000
				})
				return false
			}
		}

		uni.showToast({
			title: '请打开蓝牙，用于设备的连接',
			icon: 'none',
			duration: 3000
		})
		return false
	}

	if (mobileInfo.platform == 'ios') {
		return true
	}
	if (mobileInfo.locationAuthorized) {
		if (mobileInfo.locationEnabled) {
			return true
		} else {
			uni.showToast({
				title: '请开启定位功能，用于设备的连接',
				icon: 'none',
				duration: 3000
			})
			return false
		}
	} else {
		uni.showToast({
			title: '请设置微信使用定位权限，用于设备的连接',
			icon: 'none',
			duration: 3000
		})
		return false
	}
}

function getBleErrorMessage(errCode) {
	if (errCode === 10001) {
		return "请打开蓝牙"
	} else if (errCode === 10003) {
		return "连接设备失败"
	} else if (errCode === 10004) {
		return "获取服务失败"
	} else if (errCode === 10005) {
		return "获取特征值失败"
	} else if (errCode === 10012) {
		return "连接超时"
	} else if (errCode === 10013) {
		return "设备地址无效，请先连接设备"
	} else {
		return "连接错误，错误码为：" + errCode
	}
}
