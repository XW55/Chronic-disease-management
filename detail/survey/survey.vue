<template>
  <view>
    <view class="img_box">
      <view style="margin:10rpx 0;" v-for="(item,index) in surveyList" :key="item.questionnairePatientId">
        <view class="img_item card" @click="gotoDetail(item.questionnairePatientId,item.questionnairePerson.title)">
          <view class="img_item_content" style="padding: 20rpx; font-size: 27rpx;">
            <view class="left">
              <view class="img_item_content_top">
                <view class="">标题：{{item.questionnairePerson.title || ''}}</view>
                <view class="">医生：{{item.doctor.doctorName || ''}}</view>
              </view>
              <view class="">时间：{{strToDate(item.createTime) || ''}}</view>
            </view>
            <view class=""><u-icon name="arrow-right" size="35"></u-icon></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    getSurvey
  } from '@/request/request.js'
  import {
    strToDate
  } from '@/tools/tool.js'
  export default {
    data() {
      return {
        surveyList: [],
      };
    },
    onLoad() {
      this.getContent()
    },
    methods: {
      strToDate,
      // 请求问卷内容
      async getContent() {
        const res = await getSurvey({
          patientCode: uni.getStorageSync('idCard'),
          status: 0
        })
        console.log(res);
        if (res.code === 200) {
          this.surveyList = res.data
        }
      },
      gotoDetail(id, title) {
        uni.navigateTo({
          url: '/detail/surveyDetail/surveyDetail?id=' + id + '&title=' + title
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
        }

        .img_item_container {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
</style>