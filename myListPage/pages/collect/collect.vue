<template>
  <view>
    <!-- 用户没有收藏的展示页面 -->
    <view class="box">
      <view class="tip">暂无收藏</view>
      <u-button text="发现更多" color="#09f" :throttleTime="500" @click="gotoKnowLedge"></u-button>
    </view>

  </view>
</template>

<script>
  import {
    getCollectList
  } from '@/request/request.js'
  export default {
    data() {
      return {

      };
    },
    methods: {
      // 获取收藏列表
      async getList() {
        // const res = await getCollectList
      },
      // 获取更多知识
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
    margin: 300rpx auto;

    .tip {
      color: #979797;
      margin: 150rpx 0 150rpx 0;
      font-size: 35rpx;
    }

    /deep/ .u-button {
      width: 60%;
      height: 80rpx;
      border-radius: 25rpx;
    }
  }
</style>