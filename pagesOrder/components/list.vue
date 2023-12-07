<template>
  <view>
    <view class="card" v-for="(item,i) in list" :key="i">
      <view class="flexBox" style="margin-bottom:20rpx;" @click="gotoDetail(item.appointmentId)">
        <view class="left">
          <view class="left_box">
            <!-- <image src="../../static/images/d1.png"></image> -->
            <view class="icon">
              <view class="iconfont icon-yisheng" style="font-size: 80rpx;color: #fff;"></view>
            </view>

            <view class="left_box_tip">
              <view style="font-weight: 700;">{{item.doctorName}}</view>
              <view>{{item.doctorProfessional}}</view>
            </view>
          </view>
          <view>{{strToDate(item.periodDay,false)}}</view>
        </view>
        <view class="right">
          <view>{{statusHandler(item.status)}} <text
              style="color: #e77169;margin-left: 15rpx;">{{payStatusHandler(item.payStatus)}}</text></view>
          <view>{{item.outpatientName}}</view>
          <view>{{item.patientName}}</view>
        </view>
      </view>
      <view class="line" v-if="showBtn"></view>
      <view class="btnBox flexBox" style="justify-content: space-around;" v-if="showBtn">
        <view class="flexItem" @click="updateAbout(item.hospitalId,item.appointmentId)">
          <view class="iconfont icon-clock"></view>
          <view style="margin: 0 10rpx;">改约</view>
        </view>
        <view class="flexItem" @click="updateStatus(item.payStatus,item.appointmentId)">
          <view class="iconfont icon-close" style="font-size: 44rpx;"></view>
          <view style="margin: 0 10rpx; margin-bottom: 5rpx;">取消</view>
        </view>
      </view>
      <view class="line" v-if="showStatus"></view>
      <view class="flexBox showStatus" v-if="showStatus" @click="updateStatus(item.payStatus,item.appointmentId)">
        <view class="iconfont icon-close" style="font-size: 44rpx;"></view>
        <view style="margin: 0 10rpx; color: #09f; margin-bottom: 5rpx;">取消</view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    strToDate
  } from '@/tools/tool.js'
  export default {
    props: {
      list: {
        type: Array,
        default () {
          return []
        }
      },
      showBtn: {
        type: Boolean,
        default: false
      },
      showStatus: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      strToDate,
      gotoDetail(id) {
        // console.log(id);
        uni.navigateTo({
          url: '../../pages/detail/detail?id=' + id
        })
      },
      // 点击取消按钮修改预约状态
      async updateStatus(status, id) {
        const vuePro = this
        uni.showModal({
          title: '提示',
          content: '您确认要取消吗？',
          success: async function(res) {
            if (res.confirm) {
              if (status === '0') {
                const {
                  data: res
                } = await uni.$http.get('/hospital/visitAppointment/updateStatus?appointmentId=' + id)
                console.log('555', res);
                if (res.code !== 200) return uni.$showMsg(res.msg)
                // 通知父组件根据id删除对应的元素
                vuePro.$emit('delList', id)
                uni.$showMsg('取消成功！')
              } else {
                // 已支付退款接口                
                const {
                  data: res
                } = await uni.$http.get('/visit/pay/refund?id=' + id)
                vuePro.$emit('delList', id)
                uni.$showMsg('已发起退款申请', 'none', 1500)
              }
            }
          }
        })
      },
      async updateAbout(hosId, appointmentId) {
        const vuePro = this
        uni.showModal({
          title: '提示',
          content: '您确认要改约吗？',
          success: async function(res) {
            if (res.confirm) {
              uni.redirectTo({
                url: '../../pages/index/index?id=' + hosId + '&appointmentId=' + appointmentId
              })
            }

          }
        })
      },
      statusHandler(val) {
        if (val === 0) {
          return '待就诊'
        } else if (val === 1) {
          return '已就诊'
        } else if (val === 2) {
          return '已取消'
        } else {
          return '超时未就诊'
        }
      },
      payStatusHandler(val) {
        if (val === '0') {
          return '未支付'
        } else if (val === '1') {
          return '已支付'
        } else {
          return '已退款'
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .flexBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .iconfont {
    vertical-align: middle;
    font-size: 40rpx;
    color: #09f
  }


  .card {
    border-radius: 10rpx;
    width: 90%;
    padding: 20rpx 30rpx;
    box-shadow: 0rpx 0rpx 10rpx rgba(0, 0, 0, .3);
    margin: 15rpx auto;

    .left {
      width: 380rpx;

      .left_box {
        display: flex;
        align-items: center;

        .icon {
          width: 130rpx;
          height: 130rpx;
          background-color: #09f;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 5rpx 35rpx 20rpx 0;
        }

        .left_box_tip {
          display: flex;
          height: 130rpx;
          flex-direction: column;
          justify-content: space-around;
        }
      }
    }

    .right {
      height: 200rpx;
      width: 290rpx;
      font-size: 28rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: right;
    }
  }

  .line {
    width: 110%;
    height: 5rpx;
    margin-left: -30rpx;
    background-color: #efefef;
  }

  .btnBox {
    padding: 20rpx 0 0 0;
    color: #09f;
  }

  .flexItem {
    display: flex;
    align-items: center;
    padding: 5 20rpx;
  }

  .showStatus {
    width: 145rpx;
    text-align: center;
    margin: 0 auto;
    padding: 20rpx 0 0 0;
    justify-content: start;
  }

  .item {
    padding: 25rpx 15rpx;
    padding-left: 30rpx;
    background-color: #fff;
  }
</style>