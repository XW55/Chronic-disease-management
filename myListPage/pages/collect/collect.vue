<template>
  <view>
    <!-- 用户没有收藏的展示页面 -->
    <view class="box">
      <view class=""></view>
      <view class="tip">暂无收藏</view>
      <u-button text="发现更多" color="#09f" :throttleTime="500" @click="gotoKnowLedge"></u-button>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {

      };
    },
    methods: {
      gotoKnowLedge() {
        uni.switchTab({
          url: '/pages/knowledge/knowledge'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box {
    text-align: center;

    .tip {
      color: #979797;
      margin: 30rpx 0 50rpx 0;
      font-size: 33rpx;
    }

    /deep/ .u-button {
      width: 60%;
      height: 80rpx;
      border-radius: 25rpx;
    }

    /deep/ .u-button__text {
      font-size: 36rpx !important;
    }
  }
</style>
