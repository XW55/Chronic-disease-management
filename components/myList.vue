<template>
  <view>
    <view class="box m20 card w95">
      <view class="flexBox item" v-for="(item,i) in list" :key="i" @click="clickItem(item.url)">
        <view>{{item.title}}</view>
        <view class="iconfont icon-youjiantou"></view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    methods: {
      // 子组件被点击 触发父组件的方法
      clickItem(url) {
        this.$emit('clickItem', url)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .item {
    background-color: #fff;
    padding: 25rpx 30rpx;
    font-size: 32rpx;
    border-bottom: 1rpx solid #ebeced;
  }

  .item:first-child {
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
  }

  .item:last-child {
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    border: transparent;
  }

  .iconfont {
    font-size: 40rpx;
  }
</style>
