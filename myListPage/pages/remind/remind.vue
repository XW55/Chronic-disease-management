<template>
  <view>
    <u-toast ref="uToast"></u-toast>
    <!-- 用药提醒 -->
    <view class="box w95 boxSing p20 m20 card">
      <view class="flexBox m20">
        <view>用药提醒</view>
        <u-switch v-model="trunOnremind" :size="50" activeColor="#09f" @change="change"></u-switch>
      </view>
      <u-line></u-line>
      <view class="flexBox m20" @click="firstTimeHandler">
        <view>第一次提醒</view>
        <view class="flexBox">
          <u--input v-model="firstTime" inputAlign="right" disabled disabledColor="#ffffff" border="none">
          </u--input>
          <view class="iconfont icon-youjiantou"></view>
        </view>
      </view>
      <u-line></u-line>
      <view class="flexBox m20" @click="secondTimeHandler">
        <view>第二次提醒</view>
        <view class="flexBox">
          <u--input v-model="secondTime" inputAlign="right" disabled disabledColor="#ffffff" border="none">
          </u--input>
          <view class="iconfont icon-youjiantou"></view>
        </view>
      </view>
      <u-line></u-line>
      <view class="flexBox m20" @click="thirdTimeHandler">
        <view>第三次提醒</view>
        <view class="flexBox">
          <u--input v-model="thirdTime" inputAlign="right" disabled disabledColor="#ffffff" border="none">
          </u--input>
          <view class="iconfont icon-youjiantou"></view>
        </view>
      </view>
    </view>
    <!-- 复诊提醒 -->
    <view class="box w95 boxSing p20 m20 card">
      <view class="flexBox m20">
        <view>复诊提醒</view>
        <u-switch v-model="trunOnremind" :size="50" activeColor="#09f" @change="change"></u-switch>
      </view>
    </view>



    <u-datetime-picker ref="first" :itemHeight="100" :minHour="5" :maxHour="8" :show="showFirstTime" mode="time"
      @cancel="showFirstTime = false" @confirm="showFirstTimeConfirm"></u-datetime-picker>
    <u-datetime-picker ref="second" :itemHeight="100" :minHour="10" :maxHour="13" :show="showSecondTime" mode="time"
      @cancel="showSecondTime = false" @confirm="showSecondTimeConfirm"></u-datetime-picker>
    <u-datetime-picker ref="third" :itemHeight="100" :minHour="15" :maxHour="18" :show="showThirdTime" mode="time"
      @cancel="showThirdTime = false" @confirm="showThirdTimeConfirm"></u-datetime-picker>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 打开时间选择器
        showFirstTime: false,
        showSecondTime: false,
        showThirdTime: false,
        // 是否开启提醒
        trunOnremind: false,
        firstTime: '7:00',
        secondTime: '12:00',
        thirdTime: '17:00'
      };
    },
    methods: {
      // 用药提醒开关按钮变化
      change(e) {
        this.trunOnRemind = e
        if (e === true) {
          this.$refs.uToast.show({
            message: '已开启用药提醒',
            type: 'success',
            position: 'top',
            duration: 1000
          })
        } else {
          this.$refs.uToast.show({
            message: '已关闭用药提醒',
            type: 'warning',
            position: 'top',
            duration: 1000
          })
        }

      },
      firstTimeHandler() {
        if (this.$refs.first.innerValue === '05:00') {
          this.$refs.first.innerValue = '07:00'
        }
        this.showFirstTime = true
      },
      secondTimeHandler() {
        if (this.$refs.second.innerValue === '10:00') {
          this.$refs.second.innerValue = '12:00'
        }
        this.showSecondTime = true
      },
      thirdTimeHandler() {
        if (this.$refs.third.innerValue === '15:00') {
          this.$refs.third.innerValue = '17:00'
        }
        this.showThirdTime = true
      },
      showFirstTimeConfirm(e) {
        this.firstTime = e.value
        this.showFirstTime = false
      },
      showSecondTimeConfirm(e) {
        this.secondTime = e.value
        this.showSecondTime = false
      },
      showThirdTimeConfirm(e) {
        this.thirdTime = e.value
        this.showThirdTime = false
      },
    }
  }
</script>

<style lang="scss" scoped>
  .box {
    font-size: 32rpx;

    .iconfont {
      font-size: 40rpx;
    }
  }
</style>