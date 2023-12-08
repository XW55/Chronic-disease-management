<template>
  <view class="item" :style="{height: bleConnectState && isShowBattery ? '232rpx' : '144rpx'}">
    <view style="display: flex; justify-content: space-between">
      <view style="display: flex; align-items: center">
        <view class="device-name-little">{{ item.localName }}</view>
        <battery v-if="bleConnectState && isShowBattery" />
      </view>
      <view class="device-tip" @click="selectDevice">{{buttonText}}</view>
    </view>
    <view style="margin-top: 28rpx" v-if="bleConnectState && isShowBattery">
      <view class="bottom-text">{{`SN：${deviceSN}`}}</view>
      <view class="bottom-text">{{`设备软件版本：${deviceVersion}`}}</view>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapActions
  } from "vuex"
  import Battery from './Battery.vue'
  export default {
    components: {
      Battery
    },
    props: {
      item: {
        type: Object,
        default () {
          return {
            localName: ''
          }
        }
      },
      type: {
        type: Number,
        default () {
          return 0
        }
      }
    },
    data() {
      return {}
    },
    computed: {
      ...mapState({
        bleConnectState: (state) => state.bleConnectState,
        deviceSN: (state) => state.deviceSN,
        deviceVersion: (state) => state.deviceVersion,
        deviceElectricity: (state) => state.deviceElectricity,
      }),
      isShowBattery() {
        return this.deviceElectricity ? true : false
      },
      buttonText() {
        if (this.type === 0) {
          return '连接'
        } else {
          return '断开'
        }
      }
    },
    methods: {
      selectDevice() {
        this.$emit('clickItem', this.item)
        console.log('clickItem', this.item)
      }
    }
  }
</script>

<style scoped>
  .item {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 686rpx;
    height: 144rpx;
    padding: 0 40rpx;
    margin-bottom: 40rpx;
    background-color: #fff;
    border-radius: 24rpx;
    box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.08);
  }

  .device-name-little {
    margin-right: 16rpx;
    color: #313848;
    font-size: 40rpx;
    line-height: 48rpx;
    font-weight: bold;
  }

  .device-tip {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200rpx;
    height: 80rpx;
    color: #FFF;
    font-size: 38rpx;
    line-height: 80rpx;
    background-color: #04cb9b;
    border-radius: 50rpx;
  }

  .bottom-text {
    color: #babcc1;
    font-size: 24rpx;
    line-height: 40rpx;
  }
</style>