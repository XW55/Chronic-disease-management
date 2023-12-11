<template>
  <view>
    <view class="img_box" v-if="medicalAndPatientVOS.length">
      <view style="margin:10rpx 0;" v-for="(item,index) in medicalAndPatientVOS" :key="item.id">
        <view class="img_item card" @click="gotoDetail(item.id)">
          <view class="img_item_content" style="padding: 20rpx; font-size: 27rpx;">
            <view class="left">
              <view class="img_item_content_top">
                <view class="">主诉：{{item.complaint || ''}}</view>
                <view class="">医生：{{item.doctor || ''}}</view>
              </view>
              <view class="">时间：{{item.diagnosisStartTime || ''}}</view>
            </view>
            <view class=""><u-icon name="arrow-right" size="35"></u-icon></view>
          </view>
        </view>
      </view>
    </view>
    <view class="" v-else>
      <view class="box">
        <view class="iconfont icon-juecebaogao" style="font-size: 300rpx;"></view>
        <view class="tip">暂无病历记录</view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    getMedicaHis
  } from '@/request/request.js'
  export default {
    data() {
      return {
        patientName: '',
        patientAge: '',
        patientSex: '',
        medicalAndPatientVOS: []
      };
    },
    onLoad() {
      this.initMediaHis()
    },
    methods: {
      async initMediaHis() {
        const res = await getMedicaHis(uni.getStorageSync('idCard'))
        console.log(res);
        if (res.code === 200) {
          this.patientName = res.data.patientName;
          this.patientAge = res.data.patientAge;
          this.patientSex = res.data.patientSex;
          this.medicalAndPatientVOS = res.data.medicalAndPatientVOS;
        }
      },
      gotoDetail(id) {
        uni.navigateTo({
          url: '../../../detail/medicineHisDetail/medicineHisDetail?id=' + id
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .img_box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10rpx 20rpx;


    .img_item {
      width: 700rpx;
      height: 150rpx;
      border: 2rpx solid #ccc;
      display: flex;
      align-items: center;

      .img_item_content {
        padding: 0 18rpx;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 30rpx;


        .left {
          width: 70%;
          height: 150rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
        }

        .img_item_content_top {
          display: flex;
          justify-content: space-between;
          width: 120%;
        }

        .img_item_container {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }



  .box {
    text-align: center;
    margin: 100rpx auto;
    color: #979797;

    .tip {

      margin: 80rpx 0 80rpx 0;
      font-size: 35rpx;
    }
  }
</style>