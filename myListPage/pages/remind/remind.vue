<template>
  <view>
    <u-toast ref="uToast"></u-toast>
    <!-- 用药提醒 -->
    <!-- 复诊提醒 -->
    <view class="box w95 boxSing p20 m20 card">
      <view class="flexBox m20">
        <view>复诊提醒</view>
        <u-switch v-model="returnVisit" :size="50" activeColor="#09f" @change="visitChange"></u-switch>
      </view>
      <u-line></u-line>
      <view class="flexBox m20" :style="returnVisit ? 'opacity: 1;' : 'opacity: .5;'" @click="openDateTimePicker">
        <view>下次就诊日期</view>
        <view class="flexBox">
          <u--input v-model="returnVisitTime" inputAlign="right" disabled disabledColor="#ffffff" border="none">
          </u--input>
          <view class="iconfont icon-youjiantou"></view>
        </view>
      </view>
      <view class="tip">系统会在就诊日期前提醒您预约挂号以及生成复诊报告</view>
    </view>


    <!-- 复诊日期选择 -->
    <u-datetime-picker ref="dateTime" :show="showVisit" itemHeight="100" @cancel="showVisit = false"
      @confirm="confirmVisit" mode="date" :minDate="dayNow">
    </u-datetime-picker>


  </view>
</template>

<script>
  import {
    formatTimeStamp,
    getTime
  } from '@/tools/tool.js'
  export default {
    data() {
      return {

        // 复诊提醒
        returnVisit: false,
        // 输入框绑定的复诊日期
        returnVisitTime: '',
        // 今日时间戳，用来设置默认复诊日期值
        dayNow: '',
        // 展示日期选择
        showVisit: false,

      };
    },
    onLoad() {
      this.dayNow = Date.parse(getTime(false));
    },
    methods: {
      // 日期确定
      confirmVisit(e) {
        this.returnVisitTime = formatTimeStamp(e.value)
        this.showVisit = false
      },
      // 打开就诊日期
      openDateTimePicker() {
        if (!this.returnVisit) {
          return this.$refs.uToast.show({
            message: '请先开启复诊提醒',
            type: 'warning',
            position: 'top',
            duration: 1000
          })
        }
        this.showVisit = true
      },
      visitChange(e) {
        this.returnVisit = e
        if (e === true) {
          this.$refs.uToast.show({
            message: '已开启复诊提醒',
            type: 'success',
            position: 'top',
            duration: 1000
          })
        } else {
          this.$refs.uToast.show({
            message: '已关闭复诊提醒',
            type: 'warning',
            position: 'top',
            duration: 1000
          })
        }
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

  .tip {
    font-size: 26rpx;
    color: #999999;
  }
</style>