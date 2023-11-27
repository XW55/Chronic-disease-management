<template>
  <view>





    <!-- 未收藏按钮 点击收藏 -->
    <view class="collect" v-if="!isCollect" @click="updateCollect(true)">
      <u-icon class="uIcon" name="star" size="50"></u-icon>
      <view>收藏</view>
    </view>
    <!-- 已收藏 点击取消 -->
    <view class="collect" v-else @click="updateCollect(false)">
      <u-icon class="uIcon" name="star-fill" size="50" color="#09f"></u-icon>
      <view style="color: #09f;">已收藏</view>
    </view>
  </view>
</template>

<script>
  import {
    getknowDetail,
    setCollect
  } from '@/request/request.js'
  export default {
    data() {
      return {
        // 知识id
        pageId: '',
        // 内容标题
        title: '',
        // 这里展示的是是否收藏，若用户已收藏需要在请求数据进行改变状态
        isCollect: false,
      };
    },
    onLoad(option) {
      // this.pageId = option.id
      // this.title = option.title
    },
    // 设置知识专题
    onReady() {
      // uni.setNavigationBarTitle({
      //   title: this.title
      // });
    },
    methods: {
      // 根据id请求具体的知识详情
      async getDetail() {
        // const {
        //   data: res
        // } = await getknowDetail({})
        // console.log(res);
        // if (res.code === 200) {

        // }
      },
      // 收藏/取消收藏
      updateCollect(flag) {
        // 进行的是收藏操作
        if (flag) {

          uni.$showMsg('收藏成功', 'success')
        } else {

        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .collect {
    width: 110rpx;
    height: 110rpx;
    background-color: #fff;
    border-radius: 50%;
    font-size: 26rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    bottom: 100rpx;
    right: 30rpx;

    /deep/ .u-icon__icon {
      margin: 10rpx 0 5rpx;
    }
  }
</style>