<template>
  <view>
    <view>
      <scroll-view class="scroll-view-wrapper" scroll-x="true" style="background-color: #fff;">
        <view class="dateList">
          <view v-for="(item,index) in dataList" :key="index" class="dateItem" @click="clickDay(item,index)"
            :class="selectDay===index?'select':''">
            <view class="week">{{ item.day }}</view>
            <view class="day">{{ item.week }}</view>
          </view>
        </view>
      </scroll-view>

      <uni-collapse class="doctorList" v-if="!!doctorList.length">
        <uni-collapse-item title-border="none" :border="false" :show-arrow="true" accordion
          v-for="(item,index) in doctorList" :key="index" class="doctorItem">
          <template v-slot:title>
            <view class="doctorInfo">
              <view class="doctorImg">
                <image :src="item.doctor.img" mode="aspectFill"></image>
              </view>
              <view class="doctorText">
                <view class="doctorName">
                  <view class="name">{{ item.doctor.doctorName }}</view>
                  <view class="posts">{{ item.doctor.professional }}</view>
                </view>
                <view class="doctorTitle">{{ item.doctor.introduction }}</view>
              </view>
              <view class="doctorPrice">
                <view>挂号费</view>
                <view>￥{{ getPrice(item.doctor.chargePrice) }}</view>
              </view>
            </view>
          </template>
          <view class="am panel" v-if="!!item.visitTimeMap.am">
            <view class="title" v-if="item.visitTimeMap.am.length">上午 8:30 - 12:00</view>
            <!-- <view v-else style="font-size: 38rpx;">当前没有排班了</view> -->
            <view class="orderList">
              <view class="orderTag" v-for="(timeTag,timeIndex) in item.visitTimeMap.am" :key="timeTag.slotId"
                :class="{'disableTag':timeTag.status}" hover-class="selectTag"
                @click="selectTag(timeTag.status,timeTag.slotId,item.planId)">
                {{ timeTag.startTime }} - {{ timeTag.endTime }}
              </view>
            </view>
          </view>
          <view class="pm panel" v-if="!!item.visitTimeMap.pm">
            <!-- <view class="title">下午 14:00 - 17:30</view> -->
            <view class="title" v-if="item.visitTimeMap.pm.length">下午 14:00 - 17:30</view>
            <!-- <view v-else style="font-size: 38rpx;">当前没有排班了</view> -->
            <view class="orderList">
              <view class="orderTag" v-for="(timeTag,timeIndex) in item.visitTimeMap.pm" :key="timeTag.slotId"
                :class="{'disableTag':timeTag.status}" hover-class="selectTag"
                @click="selectTag(timeTag.status,timeTag.slotId,item.planId)">
                {{ timeTag.startTime }} - {{ timeTag.endTime }}
              </view>
            </view>
          </view>
        </uni-collapse-item>
      </uni-collapse>
      <view class="noDoctor" v-else>
        当天没有医生排班
      </view>
      <view class="icon" @click="gotoIndex">首页</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        doctorList: [],
        dataList: [],
        selectDay: 0,
        getDay: '',
        id: '',
        // 是否是修改预约
        appointmentId: '',
      };
    },
    computed: {

    },
    onLoad(options) {
      // if (options.id) {
      //   this.id = options.id
      // }
      // if (options.appointmentId) {
      //   this.appointmentId = options.appointmentId
      // }

      // this.dataList = getTwoWeek()
    },
    onShow() {
      // this.getDataList();
      // this.getDoctorList();
    },
    methods: {
      getTest() {
        //随机返回0或1
        let min = Math.ceil(0);
        let max = Math.floor(1);
        return Math.round(Math.random() * (max - min + 1)) + min;
      },
      getDataList() {
        this.getDay = this.dataList[this.selectDay].time
        uni.hideLoading()
      },
      clickDay(item, index) {
        this.selectDay = index
        this.getDataList();
        this.getDoctorList();
      },
      getPrice(price) {
        //将价格price从分转换到元
        return (price / 100).toFixed(2)
      },
      gotoIndex() {
        uni.switchTab({
          url: '../../../pages/index/index'
        })
      },
      getDoctorList() {
        try {
          getDoctorList({
            hospitalId: this.id,
            day: this.getDay
          }).then(res => {
            console.log(res);
            if (res.data.code !== 200) return uni.$showMsg(res.msg)
            this.doctorList = res.data.data
          }).catch(err => {
            uni.$showMsg('获取医生列表失败')
          })
        } catch (e) {
          uni.$showMsg('获取医生列表失败')
        }
      },
      selectTag(status, slotId, planId) {
        console.log(status, slotId, planId);
        if (status) return
        // 准备需要的参数
        const obj = {
          patientPhone: this.barUser.tel,
          slotId,
          planId
        }
        console.log(obj);
        if (this.appointmentId) {
          uni.navigateTo({
            url: `/pagesOrder/pages/doctor/doctor?obj=${JSON.stringify(obj)}&appointmentId=` + this.appointmentId
          })
        } else {
          uni.navigateTo({
            url: `/pagesOrder/pages/doctor/doctor?obj=${JSON.stringify(obj)}`
          })
        }

      }
    },
  }
</script>

<style lang="scss" scoped>
  .dateList {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    padding: 20rpx;
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

  .dateItem {
    flex: 0 0 calc(100vw / 7);
    /* 计算每个元素宽度为屏幕宽度的1/7 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    // width: 300rpx;
    margin-right: 10rpx;
    height: 100rpx;
    border-radius: 30%;
  }

  .week {}

  .day {
    border-radius: 50%;
  }

  .select {
    background-color: #27A2F2;
    color: #fff;
  }

  .doctorList {
    padding: 20rpx;
    box-sizing: border-box;
    width: 720rpx;
    overflow: hidden;
    border-radius: 10rpx;

    .doctorItem {
      margin-bottom: 25rpx !important;
      box-shadow: 0rpx 0rpx 10rpx rgba(0, 0, 0, 0.3);
      background-color: #fff;
      border-radius: 10rpx;
      margin: auto;
      width: 720rpx;
      box-sizing: border-box;
      padding: 20rpx;

      .doctorInfo {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        height: 150rpx;
        gap: 10rpx;

        .doctorImg {
          width: 120rpx;
          height: 120rpx;
          border-radius: 50%;
          overflow: hidden;

          image {
            width: 100%;
            height: 100%;
          }
        }

        .doctorText {
          padding-top: 10rpx;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          flex-wrap: nowrap;

          .doctorName {
            font-size: 30rpx;
            font-weight: bold;
            color: #1B1B1B;
            height: 30rpx;
            display: flex;
            align-items: flex-end;

            .posts {
              margin-left: 20rpx;
              font-size: 24rpx;
              color: #999999;
            }
          }

          .doctorTitle {
            margin-top: 10rpx;
            font-size: 24rpx;
            color: #999999;
            height: 70rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;

          }
        }


      }
    }

    //除了第一个doctorItem
    &:not(:first-child) {
      margin-top: 20rpx;
    }
  }

  .doctorPrice {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    width: 120rpx;

    view {
      font-size: 24rpx;
      color: #999999;
    }

    view:nth-child(2) {
      font-size: 30rpx;
      color: #1B1B1B;
    }
  }

  ::v-deep .uni-collapse {
    background-color: rgba(0, 0, 0, 0);
  }

  .panel {
    .title {
      font-size: 36rpx;
      color: #1B1B1B;
      margin-left: 30rpx;
      position: relative;
    }

    .title::after {
      content: '';
      position: absolute;
      left: -20rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      background-color: #27A2F2;
    }

    .orderList {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      gap: 20rpx;
      padding: 20rpx 0;
      margin-left: 30rpx;

      .orderTag {
        font-size: 24rpx;
        color: #000;
        border: 1px solid #999999;
        border-radius: 10rpx;
        padding: 10rpx 20rpx;
      }

      .selectTag {
        background-color: #27A2F2;
        color: #fff;
      }

      .disableTag {
        background-color: #999999 !important;
        color: #444 !important;
      }
    }
  }

  .noDoctor {
    margin-top: 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40rpx;
    color: #999999;
  }
</style>
<style>
  page {
    background-color: #f2f5f8;
  }

  /*每个页面公共css */
  /* 解决小程序和app滚动条的问题 */
  /* #ifdef MP-WEIXIN || APP-PLUS */
  ::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
    color: transparent;
  }

  /* #endif */

  /* 解决H5 的问题 */
  /* #ifdef H5 */
  .scroll-view-wrapper::-webkit-scrollbar {
    /* 隐藏滚动条，但依旧具备可以滚动的功能 */
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
    color: transparent;
  }

  /* #endif */
</style>
