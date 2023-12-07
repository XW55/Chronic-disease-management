<template>
  <view>
    <image class="grid" src="@/pageCheck/static/grid.png" />
    <wl-wave-chart ref="wlWaveChartref" />
    <view
      style="display: flex; justify-content: space-between; align-items: center; width: 686rpx; font-size: 27rpx;color: #b2b2b2;line-height: 47rpx;text-align: left;padding: 10rpx 0 0 32rpx;">
      <text>*此波形图仅供调整姿势使用，精准数据见报告</text>
    </view>
    <view class="heart-rate">
      <view class="heart-rate-top">
        <text class="heart-rate-title">心率特征</text>
        <view>
          <text class="heart-rate-value" :style="{color: Number(HR) > 100 ? '#FF5252' : '#313848'}">{{ HR }}</text>
          <text class="heart-rate-unit">次/分</text>
        </view>
      </view>
      <wl-line-skiprate class="heart-rate-chart" ref="heartRateChart" canvas-id="heartRateChart" />
    </view>
    <view>
      <view v-if="isHolter" style="margin: 0 66rpx 0 69rpx">
        <view style="flex-direction: row; display: flex; height: 100rpx">
          <view style="width: 315rpx;padding-top: 50rpx; font-size: 26rpx;color: #525151;">已测试时长:</view>
          <view style="width: 300rpx; text-align: right">
            <text style="font-size: 72rpx; font-weight: bold; color: #000000">{{testTime}}</text>
            <text style="font-size: 26rpx; font-weight: bold; color: #000000">min</text>
          </view>
        </view>
      </view>
      <view v-else style="margin: 0 66rpx 0 69rpx">
        <view style="flex-direction: row; display: flex; height: 100rpx">
          <view style="width: 315rpx;padding-top: 50rpx; font-size: 26rpx;color: #525151;">剩余时间:</view>
          <view style="width: 300rpx; text-align: right">
            <text style="font-size: 72rpx; font-weight: bold; color: #000000">{{getDisplayTime}}</text>
            <text style="font-size: 26rpx; font-weight: bold; color: #000000">s</text>
          </view>
        </view>
        <view style="height: 29rpx"></view>
        <wlLineProgress stroke-color="#00D6DC" :stroke-width="20" :showInfo="false" :percent="getDisplayPercent">
        </wlLineProgress>
      </view>

      <view style="text-align: center; padding: 60rpx 0 0 0">
        <view style="font-size: 42rpx; font-weight: 600">{{ tipShowText }}</view>
      </view>
    </view>
  </view>
</template>

<script>
  import wlLineProgress from "../components/wl-line-progress.vue"
  import WlWaveChart from '../components/wl-wave-chart.vue'
  import wlLineSkiprate from "../components/wl-line-skiprate.vue"

  import * as wlTool from "@/tools/wlToolReApp.js"

  export default {
    components: {
      wlLineProgress,
      WlWaveChart,
      wlLineSkiprate
    },
    props: {
      isHolter: {
        type: Boolean,
        default: false,
      },
      testTime: {
        type: Number,
        default: 0,
      },
      totalTime: {
        type: Number,
        default: 30,
      },
      num: {
        type: Number,
        default: 0,
      },
      tipShowText: {
        type: String,
        default: "",
      }
    },
    data() {
      return {
        HR: "--",
        HRs: []
      };
    },
    computed: {
      getDisplayPercent() {
        return (this.num * 100) / this.totalTime;
      },
      getDisplayTime() {
        return this.totalTime - this.num
      }
    },
    methods: {
      drawECG(dataAry) {
        let newDataAry = []
        for (let index = 0; index < dataAry.length; index = index + 2) {
          newDataAry.push(dataAry[index] / 32)
        }
        this.$refs.wlWaveChartref.addNewData(newDataAry)
      },
      drawHR(resultObj) {
        if (resultObj.meanHR < 35 || resultObj.meanHR > 220) {
          this.HR = "--";
        } else {
          this.HR = resultObj.meanHR.toFixed(1);
          this.HRs.push(resultObj.meanHR);
          // if(this.HRs.length > this.testTime){
          // 	this.HRs = this.HRs.slice(1)
          // }
        }
        this.$refs.heartRateChart.initRateData(this.HRs, this.totalTime)
      }
    }
  };
</script>

<style lang="scss">
  .grid {
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 750rpx;
  }

  .heart-rate-top {
    display: flex;
    justify-content: space-between;
    width: 620rpx;
    margin: 32rpx 32rpx 0 32rpx;
  }

  .heart-rate {
    z-index: 10;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 686rpx;
    height: 448rpx;
    margin: 32rpx 32rpx;
    border-radius: 24rpx;
    background-color: #fff;
    box-shadow: 0 12rpx 32rpx 0 rgba(0, 0, 0, 0.12);
  }


  .heart-rate-title {
    color: #313848;
    font-size: 44rpx;
    font-weight: 800;
    letter-spacing: 0;
    line-height: 48rpx;
  }

  .heart-rate-value {
    color: #313848;
    font-size: 48rpx;
    line-height: 48rpx;
    font-weight: 800;
  }

  .heart-rate-unit {
    color: #313848;
    font-size: 24rpx;
    line-height: 24rpx;
    font-weight: 600;
    ;
  }

  .heart-rate-chart {
    width: 620rpx;
    height: 320rpx;
  }
</style>