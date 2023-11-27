<template>
  <view>
    <view class="w95 boxSing p20 m20 card container">
      <view class="title">药品信息</view>
      <view class="tip">请仔细核对药品的规格和剂量</view>
      <view class="">
        <view class="">
          药品名
        </view>
        <u--input placeholder="请输入药品名" border="surround" clearable v-model="medicineName"></u--input>
      </view>
    </view>


    <!-- 底部添加药品按钮 -->
    <view class="btn w95 m20 p20">
      <u-button text="添加药品" type="primary" @click="addMedicine"></u-button>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        medicineName: '',
        dayTime: '',
        dayNum: ''
      };
    },
    methods: {
      // 添加药品
      addMedicine() {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    .title {
      font-size: 38rpx;
    }

    .tip {
      color: #959595;
      font-size: 28rpx;
    }
  }

  .btn {
    position: fixed;
    z-index: 99;
    bottom: 0;
  }
</style>