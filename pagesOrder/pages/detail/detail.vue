<template>
  <view>
    <u-toast ref="uToast"></u-toast>
    <!-- <view class="flexBox">
      <view class="btn" style="background-color: #fdb644;">候诊查询</view>
      <view class="btn" style="background-color: #6296fc;" @click="gotoAbout">我的预约</view>
    </view> -->
    <view class="content">
      <view class="row">
        <text class="label">就诊类型：</text>
        <text class="value">{{obj.outpatientType || ''}}</text>
      </view>
      <view class="row">
        <text class="label">就诊科室：</text>
        <text class="value">{{obj.outpatientName || ''}}</text>
      </view>
      <view class="row">
        <text class="label">就诊医生：</text>
        <text class="value">{{obj.doctorName || ''}}（{{obj.doctorProfessional || ''}}）</text>
      </view>
      <view class="row">
        <text class="label">就诊地点：</text>
        <text class="value">{{obj.clinicAddress || ''}}</text>
      </view>
      <view class="row">
        <text class="label">金额：</text>
        <text class="value" style="color: #1d7f21;">￥{{priceHandler(obj.payPrice) || ''}}</text>
      </view>
      <view class="row">
        <text class="label">就诊状态：</text>
        <text class="value">{{status || ''}}</text>
      </view>
      <view class="row">
        <text class="label">支付状态：</text>
        <text class="value">{{payStatus || ''}}</text>
      </view>
      <view class="row line">
        <text class="label">创建时间：</text>
        <text class="value">{{strToDate(obj.createTime, true)  || ''}}</text>
      </view>
      <view class="row">
        <text class="label">就诊人：</text>
        <text class="value">{{obj.patientName || ''}}</text>
      </view>
      <view class="row">
        <text class="label">性别：</text>
        <text class="value">{{obj.patientSex == '1' ? '女' : '男' || ''}}</text>
      </view>
      <view class="row">
        <text class="label">身份证号：</text>
        <text class="value">{{obj.patientCode || ''}}</text>
      </view>
    </view>
    <!-- <view class="btn" v-if="payStatus === '未支付'" style="background-color: #6296fc;" @click="pay">立即支付</view> -->

    <!-- 签到按钮  -->
    <!-- payStatus==='已支付' && -->
    <view v-if="status==='待就诊'">
      <view class="sign" :style="{backgroundColor: color}" @click="sureSign">{{text}}</view>
      <view class="tip">
        请您在就诊前20分钟进行签到，签到过后您将会进入候诊列表，即可候诊。
      </view>
    </view>
    <!-- <view class="tip" v-if="payStatus==='未支付'">请您最晚在就诊前20分钟完成支付并且签到才能进入候诊列表</view> -->
    <view class="icon" @click="gotoIndex">首页</view>
  </view>
</template>

<script>
  import {
    getPointMentDetail,
    getSignStatus,
    confirmSign
  } from '@/request/request.js'
  import {
    strToDate,
    getTime
  } from '@/tools/tool.js'
  export default {
    data() {
      return {
        obj: {},
        id: '',
        color: '',
        text: ''
      };
    },
    onLoad(options) {
      if (options.id) {
        this.id = options.id
      }
      this.comfirmSign()
      this.getList()
    },
    methods: {
      strToDate,
      gotoIndex() {
        uni.switchTab({
          url: '../../../pages/index/index'
        })
      },
      priceHandler(price) {
        //将价格price从分转换到元
        return (price / 100).toFixed(2)
      },
      async comfirmSign() {
        const res = await getSignStatus(this.id)
        console.log('签到状态', res);
        if (res.data) {
          this.text = '已签到'
          this.color = '#24d96e'
        } else {
          this.text = '签到'
          this.color = '#fdb644'
        }
      },
      // 用户确认签到
      sureSign() {
        // 设置签到开始时间和结束时间
        const startTime = new Date(this.strToDate(this.obj.periodDay, false) + ' ' + this.obj.periodStart).getTime();
        const endTime = new Date(this.strToDate(this.obj.periodDay, false) + ' ' + this.obj.periodEnd).getTime();
        const now = Date.now();
        const thirtyMinutesBeforeStartTime = new Date(startTime);
        thirtyMinutesBeforeStartTime.setMinutes(thirtyMinutesBeforeStartTime.getMinutes() - 30);
        const thirtyMinutesBeforeStartTimeTimestamp = thirtyMinutesBeforeStartTime.getTime();

        // 判断当前时间是否在签到开始时间和结束时间之间
        console.log('现在时间', now);
        console.log('起始，结束', startTime, endTime);

        if (now >= startTime && now <= endTime) {
          this.addSign();
        } else if (now >= thirtyMinutesBeforeStartTimeTimestamp && now < startTime) {
          this.addSign();
        } else if (now >= endTime) {
          this.$refs.uToast.show({
            message: '已超过签到时间',
            type: 'warning',
            position: 'top',
            duration: 1000
          });
        } else {
          this.$refs.uToast.show({
            message: '还未到签到时间',
            type: 'warning',
            position: 'top',
            duration: 1000
          });
        }
      },
      async pay() {
        const {
          data: result
        } = await uni.$http.post('/visit/pay/prePay', {
          orderId: this.id
        })
        console.log(result);
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: result.payMap.timeStamp,
          nonceStr: result.payMap.nonceStr,
          package: result.payMap.package,
          signType: result.payMap.signType,
          paySign: result.payMap.paySign,
          success: function(res) {
            this.$refs.uToast.show({
              message: '支付成功',
              type: 'success',
              position: 'top',
              duration: 1000
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 700)
          },
          fail(err) {
            this.$refs.uToast.show({
              message: '您取消了支付',
              type: 'warning',
              position: 'top',
              duration: 1000
            })
          }
        })
      },
      // 签到加入候诊列表中的函数
      async addSign() {
        const res = await confirmSign(this.id)
        console.log('加入候诊列表结果', res);
        if (res.code !== 200) return uni.$showMsg(res.msg)
        this.text = '已签到'
        this.color = '#24d96e'
        this.$refs.uToast.show({
          message: '签到成功，已进入候诊列表',
          type: 'success',
          position: 'top',
          duration: 1000
        })
      },
      async getList() {
        const res = await getPointMentDetail(this.id)
        console.log(res);
        if (res.code !== 200) return uni.$showMsg(res.msg)
        this.obj = res.data
      },
      gotoAbout() {
        uni.navigateBack()
      },
    },
    computed: {
      status() {
        if (this.obj.status === 0) {
          return '待就诊'
        } else if (this.obj.status === 1) {
          return '已就诊'
        } else if (this.obj.status === 2) {
          return '已取消'
        } else {
          return '超时未就诊'
        }
      },
      payStatus() {
        if (this.obj.payStatus === '0') {
          return '未支付'
        } else if (this.obj.payStatus === '1') {
          return '已支付'
        } else {
          return '已退款'
        }
      }
    }
  }
</script>

<style lang="scss">
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

  .line {
    padding-bottom: 20rpx;
    border-bottom: 5rpx dotted #ccc;
  }

  .btn {
    width: 300rpx;
    height: 90rpx;
    color: #fff;
    text-align: center;
    line-height: 90rpx;
    font-size: 35rpx;
    margin: 20rpx auto 10rpx;
    border-radius: 10rpx;
  }

  .flexBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sign {
    width: 200rpx;
    height: 200rpx;
    margin: 20rpx auto;
    text-align: center;
    line-height: 200rpx;
    font-size: 45rpx;
    color: #fff;
    border-radius: 50%;
  }

  .tip {
    padding: 10rpx 30rpx 40rpx 30rpx;
    color: #a8a8a8;
  }
</style>