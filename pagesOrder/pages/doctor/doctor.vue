<template>
  <view class="">
    <u-toast ref="uToast"></u-toast>
    <view style="background-color: #ededed;">
      <view class="item mb20">
        <view class="flexBox">
          <view class="leftText">就诊人</view>
          <view class="flexBox">
            <view style="color: #4087eb; margin: 0 15rpx;">
              {{list.patientName}}【{{list.patientSex == '1' ? '男' : '女'}}】{{list.patientAge}}岁
            </view>
            <view class="iconfont icon-youjiantou" style="font-size: 40rpx; color: #000;"></view>
          </view>
        </view>
      </view>

      <view class="item">
        <view class="flexBox">
          <view class="leftText">医院名称</view>
          <view class="textHandler">福州中医院</view>
        </view>
      </view>

      <view class="item">
        <view class="flexBox">
          <view class="leftText">科室名称</view>
          <view>{{list.hospitalClinicName}}</view>
        </view>
      </view>

      <view class="item">
        <view class="flexBox">
          <view class="leftText">医生名称</view>
          <view>{{list.doctorName}}</view>
        </view>
      </view>

      <view class="item">
        <view class="flexBox">
          <view class="leftText">医生职称</view>
          <view>{{list.professional}}</view>
        </view>
      </view>

      <view class="item">
        <view class="flexBox">
          <view class="leftText">就诊时间</view>
          <view style="color: #4087eb;">{{list.day}} {{list.startTime}}-{{list.endTime}}</view>
        </view>
      </view>

      <!--      <view class="item mb20">
        <view class="flexBox">
          <view class="leftText">就诊类型</view>
          <uni-data-checkbox mode="button" v-model="radio" :localdata="options"></uni-data-checkbox>
        </view>
      </view> -->

      <view class="item mb20">
        <view class="flexBox">
          <view class="leftText">挂号及诊查费</view>
          <view style="color: #e77169;">￥{{getPrice(list.chargePrice)}}</view>
        </view>
      </view>

      <view class="item mb20">
        <view class="flexBox">
          <view class="iconfont icon-xiaoxizhongxin" style="font-size: 40rpx;margin-bottom:20rpx;color: #333;"></view>
          <view style="color: #a5a5a5; font-size: 26rpx;">请您于约定时间提前120分钟到分诊台签到候诊，如无法按时就诊请提前取消预约。</view>
          <!-- 此段内容待斟酌 -->
        </view>
      </view>
    </view>
    <!-- <view class="btn primary" @click="payShowModel = true">立即支付（￥{{getPrice(list.chargePrice)}}）</view> -->
    <view class="btn primary" @click="showModal = true">预约保存</view>
    <u-modal :show="showModal" :showCancelButton="true" :title="title" :content='content' @confirm="confirmContent"
      @cancel="showModal = false"></u-modal>
    <u-modal :show="payShowModel" :showCancelButton="true" :title="payTitle" :content='payContent' @confirm="pay"
      @cancel="payShowModel = false"></u-modal>
    <view class="icon" @click="gotoIndex">首页</view>
  </view>
</template>

<script>
  import {
    addintrument,
    getPlanMsg,
    updateAbout
  } from '@/request/request.js'
  export default {
    data() {
      return {
        // radio: 0,
        params: {},
        list: [],
        title: '预约挂号确认',
        content: '您确认要预约挂号吗',
        payTitle: '支付确认',
        payContent: '请确保您已到达医院，叫号未到将影响您的就诊，确认立即支付吗',
        showModal: false,
        payShowModel: false,
        appointmentId: '',
        // options: [{
        //     text: '初诊',
        //     value: 0
        //   },
        //   {
        //     text: '复诊',
        //     value: 1
        //   }
        // ]
      };
    },
    onLoad(options) {
      this.params = JSON.parse(options.obj)
      if (options.appointmentId) {
        this.appointmentId = options.appointmentId
      }
      this.getList()
    },
    methods: {
      async getList() {
        const res = await getPlanMsg(this.params)
        console.log(res);
        if (res.code !== 200) return uni.$showMsg(res.msg)
        this.list = res.data
      },
      getPrice(price) {
        //将价格price从分转换到元
        return (price / 100).toFixed(2)
      },
      async confirmContent() {
        const vuePro = this
        this.showModal = false
        if (vuePro.appointmentId) {
          const res = await updateAbout({
            appointmentId: vuePro.appointmentId,
            ...vuePro.params,
          })
          console.log('这是改约', res);
          if (res.code !== 200) return uni.$showMsg(res.msg)
          uni.navigateTo({
            url: `../../pages/aboutDay/aboutDay`
          })
        } else {
          const res = await addintrument({
            appointmentId: this.appointmentId,
            ...this.params,
          })
          console.log('添加订单结果', res);
          if (res.code !== 200) return uni.$showMsg(res.msg)
          uni.navigateTo({
            url: `../../pages/aboutDay/aboutDay`
          })
        }
      },
      gotoIndex() {
        uni.switchTab({
          url: '../../../pages/index/index'
        })
      },
      pay() {
        // const vuePro = this
        // uni.showModal({
        //   title: '支付确认',
        //   content: '',
        //   success: async function(res) {
        //     if (res.confirm) {
        //       const {
        //         data: ress
        //       } = await uni.$http.post('/hospital/visitAppointment/addAppointment', vuePro.params)
        //       console.log('添加订单结果', ress);
        //       if (ress.code !== 200) return uni.$showMsg(ress.msg, 'none', 3000);
        //       const {
        //         data: result
        //       } = await uni.$http.post('/visit/pay/prePay', {
        //         orderId: ress.data.appointmentId
        //       })
        //       console.log(result);
        //       if (result.success) {
        //         uni.requestPayment({
        //           provider: 'wxpay',
        //           timeStamp: result.payMap.timeStamp,
        //           nonceStr: result.payMap.nonceStr,
        //           package: result.payMap.package,
        //           signType: result.payMap.signType,
        //           paySign: result.payMap.paySign,
        //           success: function(res) {
        //             this.$refs.uToast.show({
        //               message: '支付成功',
        //               type: 'success',
        //               position: 'top',
        //               duration: 1000
        //             })
        //             setTimeout(() => {
        //               uni.navigateTo({
        //                 url: '../../pages/detail/detail?id=' + ress.data.appointmentId
        //               })
        //             }, 700)

        //           },
        //           fail(err) {
        //             this.$refs.uToast.show({
        //               message: '您取消了支付',
        //               type: 'warning',
        //               position: 'top',
        //               duration: 1000
        //             })
        //             setTimeout(() => {
        //               uni.navigateTo({
        //                 url: '../../pages/aboutDay/aboutDay'
        //               })
        //             }, 800)
        //           }
        //         })
        //       }

        //     }
        //   }
        // })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .item {
    padding: 25rpx;
    padding-left: 30rpx;
    background-color: #fff;
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

  .textHandler {
    width: 480rpx;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mb20 {
    margin-bottom: 20rpx;
  }

  .leftText {
    color: #646464;
  }

  .flexBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .btn {
    width: 85%;
    height: 90rpx;
    text-align: center;
    line-height: 90rpx;
    font-size: 35rpx;
    margin: 20rpx auto;
    border-radius: 10rpx;
  }

  .primary {
    background-color: #3c87fe;
    color: #fff;
  }
</style>