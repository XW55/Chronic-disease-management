<template>
  <view>
    <view class="w95 boxSing m20 p20 card flexBox">
      <view class="">
        <view class="f38">用药</view>
        <view class="name">感冒灵颗粒</view>
        <view class="tip">每天<text>3</text>次 每次<text>1</text>粒 </view>
      </view>
      <view class="btn flexBox">
        <text style="font-size: 33rpx;">已服用</text>
        <text>1次</text>
      </view>
    </view>
    <navigator url="../../modif/signIn/signIn">去往信息页</navigator>
    <navigator url="../../modif/login/login">去往登录页</navigator>
  </view>
</template>

<script>
  // import {
  //   login
  // } from '@/request/request.js'
  export default {
    data() {
      return {

      }
    }

  }
</script>

<style lang="scss" scoped>
  $main-color: #09f;

  .name {
    font-size: 32rpx;
    margin: 15rpx 0;
  }

  .tip text {
    color: $main-color;
  }

  .btn {
    width: 150rpx;
    height: 150rpx;
    box-shadow: 0 0 10rpx #09f;
    text-align: center;
    background-color: $main-color;
    border-radius: 50%;
    color: #fff;
    flex-direction: column;
    justify-content: center;
  }
</style>