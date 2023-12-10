<template>
  <view>
    <view class="w95 boxSing p20 m20 card">
      <view class="row">
        <text class="label">就诊时间：</text>
        <text class="value">{{ strToDate(detail.createTime) || ''}}</text>
      </view>
      <view class="row">
        <text class="label">医嘱：</text>
        <text class="value">{{detail.doctorAdvice || ''}}</text>
      </view>
      <view class="row">
        <text class="label">就诊医生：</text>
        <text class="value">{{detail.medical.doctor || ''}}</text>
      </view>
      <view class="row">
        <text class="label">诊断结果：</text>
        <text class="value">{{detail.diagnoseText || ''}}</text>
      </view>
      <view class="row">
        <text class="label">病情类型：</text>
        <text class="value">{{detail.prescriptionName || ''}}</text>
      </view>
      <view class="row">
        <text class="label">症状类型：</text>
        <text class="value">{{detail.symptomType || ''}}</text>
      </view>
      <view class="row">
        <text class="label">主诉描述：</text>
        <text class="value">{{detail.principleAction || ''}}</text>
      </view>
      <!-- 处方信息 -->
      <!-- <view class="row line">
         <text class="label">药品名称：</text>
         <text class="value">{{detail.createTime  || ''}}</text>
       </view> -->
      <view class="row">
        <text class="label">药方成分：</text>
        <text class="value">{{detail.prescriptionConstitute || ''}}</text>
      </view>
      <view class="row">
        <text class="label">用药方式：</text>
        <text class="value">{{detail.boilMedicineWay || ''}}</text>
      </view>
      <view class="row">
        <text class="label">用药说明：</text>
        <text class="value">{{detail.agrochemicalRegulation || ''}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    getMedicineHisDetail
  } from '@/request/request.js'
  import {
    strToDate
  } from '@/tools/tool.js'
  export default {
    data() {
      return {
        id: '',
        detail: []
      };
    },
    onLoad(option) {
      this.id = option.id
      this.initDetail()
    },
    methods: {
      strToDate,
      async initDetail() {
        const res = await getMedicineHisDetail(this.id)
        console.log('病历详情', res);
        if (res.code === 200) {
          this.detail = res.data
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    margin: 20rpx;
    padding: 30rpx;
    background-color: #fff;
    border-radius: 10rpx;
    box-shadow: 0rpx 0rpx 10rpx rgba(0, 0, 0, 0.3);
  }

  .icon {
    background-color: #09f;
    border-radius: 50%;
    width: 90rpx;
    height: 90rpx;
    color: #fff;
    text-align: center;
    line-height: 90rpx;
    position: fixed;
    bottom: 30rpx;
    right: 15rpx;
    z-index: 10;
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 35rpx;
  }

  .label {
    width: 180rpx;
    color: #a8a8a8;
  }

  .value {
    flex: 1;
    text-align: left;
  }
</style>