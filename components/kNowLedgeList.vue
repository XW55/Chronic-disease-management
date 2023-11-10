<template>
  <view>
    <view class="box flexBox" v-for="item in 5" :key="item" @click="clickItem(item)">
      <view class="left">
        <view class="">这是一段标题</view>
        <view class="tip">这是内容标签</view>
      </view>
      <view class="right">
        <image src="../static/knowledge-active.png" mode=""></image>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "kNowLedgeList",
    props: {
      list: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    data() {
      return {

      };
    },
    methods: {
      clickItem(val) {
        this.$emit('clickItem', val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box:nth-child(1) {
    border-top-left-radius: 30rpx;
    border-top-right-radius: 30rpx;
  }

  .box {
    padding: 30rpx;
    margin: 0 20rpx;
    background-color: #fff;
    height: 190rpx;
    border-bottom: 1rpx solid #ebebeb;

    .left {
      width: 60%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .tip {
        background-color: #f5f5f5;
        font-size: 26rpx;
        color: #909399;
        padding: 10rpx;
        width: max-content;
      }
    }

    .right {
      width: 40%;
      height: 100%;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
