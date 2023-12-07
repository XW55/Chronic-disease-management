<template>
  <view class="main" v-if="isShow">
    <view class="connecting">
      <view class="connecting-title">
        <view class="device-name">{{ activeDeviceName }}</view>
        <view class="connecting-tip" :style="connectingTip.style">{{connectingTip.text}}</view>
      </view>
      <view class="connecting-log-list">
        <view class="connecting-log" v-for="(item, index) in connectingLog" :key="index">{{ item }}</view>
      </view>
      <view class="button-container" v-if="statusCode === 1">
        <view class="back-button" @tap="closeThisModal">返回</view>
        <view class="retry-button" @tap="retry">重试</view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapActions
  } from "vuex"

  import * as wlTool from "@/tools/wlToolReApp.js"
  export default {
    props: {
      isShow: {
        type: Boolean,
        default () {
          return false
        }
      },
      // 区分社区版跳转页面
      community: {
        type: Boolean,
        default: false
      },
      errorCode: {
        type: String,
        default () {
          return ''
        }
      },
      activeDeviceName: {
        type: String,
        default () {
          return ''
        }
      }
    },
    data() {
      return {
        // 0 正在连接
        // 1 失败
        statusCode: 0,
        connectingLog: [],
      }
    },
    computed: {
      ...mapState({
        bleConnectState: (state) => state.bleConnectState,
      }),
      connectingTip() {
        if (this.statusCode === 0) {
          return {
            text: '正在连接',
            style: 'color: #babcc1'
          }
        } else {
          return {
            text: '连接失败',
            style: 'color: #FF5252'
          }
        }
      },
    },
    methods: {
      backHome() {
        // uni.switchTab({
        // 	url: '/pages/index/index'
        // })
        if (this.community) {
          uni.navigateBack()
        } else {
          uni.redirectTo({
            url: '../../pageCheck/pages/index'
          })
        }

      },
      retry() {
        this.statusCode = 0
        this.connectingLog = []
        this.connectingLog.push("开始连接" + this.activeDeviceName)
        wlTool.connectBLE(5, this.finshconnectBLERes, this.connectBLERes)
      },
      finshconnectBLERes(res) {
        let deviceId = uni.getStorageSync("deviceId")
        let logData = {
          module: 0,
          type: 0,
          mac: deviceId,
          remark: ""
        }
        if (res.errCode === 0) {
          this.statusCode = 0
          this.backHome()
        } else {
          this.statusCode = 1
          this.connectingLog.push(getApp().getBleErrorMessage(res.errCode))
        }
      },
      connectBLERes(res) {
        if (res.errCode === 0 || res.errCode === -1) {
          this.connectingLog.push("第" + res.connectTimes + "次连接成功")
        } else {
          this.connectingLog.push("第" + res.connectTimes + "次连接失败错误码:" + res.errCode)
          let times = res.connectTimes + 1
          this.connectingLog.push("第" + times + "次连接")
        }
      },
      selectDevice(item) {
        uni.setStorageSync("deviceId", item.deviceId);
        uni.setStorageSync("deviceName", item.localName);
        this.connectingLog.push("开始连接" + item.localName)
        wlTool.connectBLE(5, this.finshconnectBLERes, this.connectBLERes);
      },
      closeThisModal() {
        this.$emit('closeConnectModal')
        this.statusCode = 0
        this.connectingLog = []
      }
    }
  }
</script>

<style scoped>
  view {
    box-sizing: border-box;
  }

  .main {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, .20);
  }

  .connecting {
    position: relative;
    margin: 18vh 48rpx 0;
    width: 654rpx;
    height: 680rpx;
    background-color: #fff;
    border-radius: 24rpx;
    box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .connecting-title {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 48rpx;
    padding: 0 40rpx;
    margin: 40rpx 0;
  }

  .device-name {
    color: #313848;
    font-size: 36rpx;
    line-height: 48rpx;
    font-weight: bold;
  }

  .connecting-tip {
    color: #babcc1;
    font-size: 32rpx;
    line-height: 48rpx;
  }

  .connecting-log-list {
    width: 574rpx;
    height: 360rpx;
    margin: 0 40rpx;
    overflow: hidden;
  }

  .connecting-log {
    color: #babcc1;
    font-size: 24rpx;
    line-height: 40rpx;
  }

  .connecting-modal {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 686rpx;
    height: 672rpx;
    background-color: rgba(255, 255, 255, 0.8);
  }

  .tip-icon {
    margin-top: 165rpx;
    width: 158rpx;
    height: 158rpx;
  }

  .tip-text {
    margin-top: 36rpx;
    color: #313848;
    font-size: 36rpx;
    line-height: 36rpx;
    letter-spacing: 4rpx;
  }

  .back-home-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 156rpx;
    width: 606rpx;
    height: 88rpx;
    color: #fff;
    font-size: 28rpx;
    line-height: 28rpx;
    background-color: #00D6DC;
    border-radius: 44rpx;
  }

  .back-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 282rpx;
    height: 88rpx;
    color: #313848;
    font-size: 28rpx;
    line-height: 28rpx;
    background-color: #f4f4f5;
    border-radius: 44rpx;
  }

  .retry-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 282rpx;
    height: 88rpx;
    color: #fff;
    font-size: 28rpx;
    line-height: 28rpx;
    background-color: #00D6DC;
    border-radius: 44rpx;
  }

  .button-container {
    position: absolute;
    bottom: 32rpx;
    display: flex;
    justify-content: space-between;
    width: 590rpx;
    height: 88rpx;
    margin: 0 32rpx;
  }
</style>