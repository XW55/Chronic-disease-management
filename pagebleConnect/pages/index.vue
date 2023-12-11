<template>
  <view class="main">
    <view class="title-container">
      <view class="title">{{ title }}</view>
    </view>
    <view class="list-container">
      <view class="device-list-container" v-if="isConnected">
        <device-item :item="currentConnectedDevice" :type="1" @clickItem="breakOff"></device-item>
      </view>
      <view v-else>
        <view class="device-list-container" v-if="deviceList.length > 0">
          <view v-for="item in deviceList" :key="item.id">
            <device-item :item="item" :type="0" @clickItem="selectDevice"></device-item>
          </view>
        </view>
        <view v-else>
          <image class="default-page" src="../static/null.png" />
          <view class="tip">没有找到设备吗？试试重新搜索</view>
          <view class="btn" @click="reSearch">重新搜索</view>
          <view class="tip" style="color: #00ca99;" @click="gotoSQ()">前往授权页面</view>
        </view>
      </view>
    </view>
    <view class="button-container">
      <!-- <view class="bottom-button" v-if="!isConnected" :style="bottomButtonStyle" @tap="clickBottomButton">
				{{ bottomButtonText }}
			</view> -->
    </view>
    <connecting-animation v-if="statusCode === 1 && deviceList.length === 0" :interval="interval" />
    <device ref="device" :isShow="isShowConnectingModal" :activeDeviceName="activeDeviceName"
      @closeConnectModal="closeConnectModal" />
  </view>
</template>

<script>
  import {
    mapState,
    mapActions,
    mapMutations
  } from "vuex"
  import * as wlTool from "../../tools/wlToolReApp.js"
  import deviceItem from "../../pagebleConnect/components/deviceItem.vue";
  import WlTipModal from '../../pagebleConnect/components/wl-tip-modal.vue'
  import Device from '../../pagebleConnect/components/device.vue'
  import connectingAnimation from '../../pagebleConnect/components/connectingAnimation.vue'
  export default {
    components: {
      deviceItem,
      WlTipModal,
      Device,
      connectingAnimation,
    },
    data() {
      return {
        /*
         * 页面状态码
         0 => 搜索前
         1 => 搜索中
         2 => 搜索结束
         */
        statusCode: 0,
        deviceList: [],
        interval: 15,
        activeDeviceName: '',
        isDeviceNotFound: false,
        isShowConnectingModal: false,
        timeIntervalId: null,
        isConnected: false,
        currentConnectedDevice: {
          localName: ''
        },
        disabledBottomButton: false,
        searchTimeCount: 20
      };
    },
    computed: {
      ...mapState({
        bleConnectState: (state) => state.bleConnectState,
        deviceSN: (state) => state.deviceSN,
        deviceVersion: (state) => state.deviceVersion,
        deviceElectricity: (state) => state.deviceElectricity,
      }),
      bottomButtonText() {
        if (this.statusCode === 1) {
          return `正在搜索(${this.interval}s)`;
        } else {
          return "搜索设备";
        }
      },
      title() {
        if (this.isConnected) {
          return "我的设备"
        } else {
          return "设备列表"
        }
      },
      bottomButtonStyle() {
        if (this.statusCode === 1) {
          return "background-color: #E6E6E8; color: #8C8F98"
        } else {
          return "background-color: #00D6DC; color: #FFF"
        }
      }
    },
    onLoad() {
      console.log('store')
      console.log(this.$store.state)
      uni.setStorageSync('deviceSN', '');
      if (this.bleConnectState) {
        this.isConnected = true
        this.currentConnectedDevice.localName = uni.getStorageSync("deviceName")
      } else {
        this.isConnected = false
      }
      // console.log(wlTool.judgeLocaltion())
      // TODO 蓝牙连接
      if (!wlTool.judgeLocaltion()) {
        console.log(wlTool.judgeLocaltion())
        if (false) {
          uni.showModal({
            //title: '注意！',
            content: '请打开蓝牙和位置',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                // uni.redirectTo({
                //   url: '/pages/index/index'
                // })
                //   uni.switchTab({
                //     url:'/pages/index/index'
                //   })
                uni.navigateBack()
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        }
        return
      } else {
        console.log('else if')
        if (this.disabledBottomButton === false) {
          this.disabledBottomButton = true
          this.searchDevice()
        }
      }
    },
    methods: {
      ...mapMutations({
        changeBleConnectStatus: 'changeBleConnectStatus',
        changeDeviceSNStatus: 'changeDeviceSNStatus'
      }),
      gotoSQ() {
        // 打开小程序的设置列表
        uni.openSetting({
          success: function(res) {
            // 用户在设置页面进行了操作后的回调
            if (res.authSetting['scope.bluetooth']) {
              // 用户允许授权了蓝牙权限
              console.log('用户已经授权了蓝牙权限');
            } else {
              uni.showModal({
                title: '您未授权蓝牙权限',
                content: '是否前去授权',
                success(res) {
                  if (res.confirm) {
                    uni.openSetting()
                  } else {
                    uni.navigateBack()
                  }
                }
              })
            }
          },
          fail: function(err) {
            // 打开设置页面失败的回调
            console.log('打开设置页面失败', err);
          }
        });
      },
      clickBottomButton() {
        if (!wlTool.judgeLocaltion()) {

          return
        } else {
          if (this.disabledBottomButton === false) {
            this.disabledBottomButton = true
            this.searchDevice()
          }
        }
      },
      reSearch(isReSearch) {
        if (isReSearch) {
          this.searchDevice()
        } else {
          this.statusCode = 0
        }
        this.isDeviceNotFound = false
      },
      selectDevice(item) {
        this.isShowConnectingModal = true
        this.activeDeviceName = item.localName
        this.$refs.device.selectDevice(item)
        this.endSearch()
      },
      closeConnectModal() {
        this.isShowConnectingModal = false
      },
      searchDevice() {
        this.statusCode = 1
        this.interval = this.searchTimeCount
        let that = this
        this.deviceList = []
        uni.closeBluetoothAdapter({
          complete(info1) {
            that.searchDevice1()
          }
        })
      },
      searchDevice1() {
        this.startTimeInterval()
        wlTool.startBluetoothDevicesDiscovery()
        let that = this
        uni.onBluetoothDeviceFound(function(res) {
          const strName = res.devices[0].localName
          if (strName) {
            let index = strName.indexOf("WL ECG")
            if (index == 0) {
              let needAdd = true
              for (const item of that.deviceList) {
                if (item.localName === strName && item.deviceId === res.devices[0].deviceId) {
                  needAdd = false
                }
              }
              if (needAdd) {
                that.deviceList.push(res.devices[0])
              }
            }
          }
        })
      },
      stopSearchDevice() {
        uni.stopBluetoothDevicesDiscovery({
          complete() {}
        })
      },
      startTimeInterval() {
        if (this.timeIntervalId) {
          clearInterval(this.timeIntervalId)
        }
        this.timeIntervalId = setInterval(this.computeTime, 1000)
      },
      computeTime() {
        this.interval--
        if (this.interval === 0) {
          this.endSearch()
        }
      },

      endSearch() {
        this.statusCode = 2
        this.stopSearchDevice()
        if (this.deviceList.length === 0) {
          this.isDeviceNotFound = true
        } else {
          this.isDeviceNotFound = false
        }
        this.disabledBottomButton = false
        if (this.timeIntervalId) {
          clearInterval(this.timeIntervalId)
          this.timeIntervalId = null
        }
      },
      breakOff() {
        wlTool.closeBLEConnection(this.closeConnectRes)
      },
      closeConnectRes() {
        this.isConnected = false
        this.statusCode = 0
        uni.setStorageSync('deviceSN', '');
        uni.setStorageSync('deviceId', '');
        this.changeBleConnectStatus(false);
        this.changeDeviceSNStatus('');
      }
    },
  };
</script>

<style lang="scss" scoped>
  .main {
    max-height: 100vh;
    background-color: #f9f9f9;
    overflow: hidden;
  }

  .tip {
    padding: 15rpx;
    width: max-content;
    margin: 20rpx auto;
    font-size: 30rpx;
    color: #c3c3c3;
  }

  .btn {
    width: 250rpx;
    border-radius: 40rpx;
    background-color: #00ca99;
    color: #fff;
    text-align: center;
    margin: 0 auto;
    line-height: 80rpx;
    height: 80rpx;
  }

  .title-container {
    margin-bottom: 30rpx;
    height: 48rpx;
    padding: 72rpx 64rpx 48rpx;
  }

  .title {
    color: #313848;
    font-size: 44rpx;
    line-height: 48rpx;
    font-weight: bold;
  }

  .list-container {
    width: 100%;
    height: calc(100vh - 348rpx);
    overflow: auto;
  }

  .button-container {
    width: 100%;
    height: 180rpx;
  }

  .bottom-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 686rpx;
    height: 90rpx;
    margin: 32rpx auto 0;
    color: #ffffff;
    font-size: 28rpx;
    line-height: 28rpx;
    background: linear-gradient(-84deg, #00D6DC, #27A2F2);
    border-radius: 45rpx;
    box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.08);
  }

  .device-list-container {
    height: auto;
    margin: 0 32rpx;
  }

  .default-page {
    width: 610rpx;
    height: 569rpx;
    margin: 0 70rpx -160rpx;
  }

  .default-page-tips {
    color: #babcc1;
    font-size: 28rpx;
    line-height: 48rpx;
    text-align: center;
  }

  .default_page_wenti {
    text-align: center;
    margin: 0 auto;
    color: #babcc1;
    font-size: 28rpx;

    .text_blod {
      font-size: 32rpx;
      font-weight: 700;
      color: #00D6DC;
      margin: 0 5rpx;
    }
  }

  .high-light {
    margin: 0 12rpx;
    color: #00D6DC;
    font-size: 32rpx;
    font-weight: 700;
  }
</style>