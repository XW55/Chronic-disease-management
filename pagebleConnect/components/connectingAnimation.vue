<template>
  <view class="main">
    <view class="container">
      <image class="fitcard" src="../static/fitcard.png" />
      <view class="phone-container">
        <view class="circle1"></view>
        <view class="circle2"></view>
        <image class="phone" src="../static/phone.png" />
      </view>
      <text class="count-down">{{interval + 's'}}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    interval: {
      type: Number,
      default: 9,
    }
  }
}
</script>

<style scoped>
.main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, .20);
}
.container {
  position: absolute;
  top: 20vh;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 654rpx;
  height: 680rpx;
  background-color: #FFF;
  border-radius: 24rpx;
  transform: translate(-50%);
  overflow: hidden;
}
.fitcard {
  position: absolute;
  top: 72rpx;
  width: 372rpx;
  height: 150rpx;
}
.phone-container {
  position: absolute;
  top: 222rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 865rpx;
  height: 458rpx;
}
.phone {
  position: absolute;
  bottom: -40rpx;
  width: 358rpx;
  height: 298rpx;
}
.count-down {
  position: absolute;
  top: 50%;
  left: 50%;
  color: #313848;
  font-size: 64rpx;
  font-weight: bold;
  transform: translate(-50%, -50%);
}
.circle1 {
  position: absolute;
  top: 144rpx;
  width: 718rpx;
  height: 718rpx;
  background-color: rgba(244, 244, 246, .4);
  border-radius: 100%;
  animation: circleAni 2s ease-out infinite;
}
.circle2 {
  position: absolute;
  top: 240rpx;
  width: 526rpx;
  height: 526rpx;
  background-color: rgba(244, 244, 246, 1);
  border-radius: 100%;
  animation: circleAni 2s ease-out infinite;
}
@keyframes circleAni {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(1.6);
    opacity: 0;
  }
}
</style>