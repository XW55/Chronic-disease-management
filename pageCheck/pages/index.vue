<template>
  <view style="background-color: #f9f9f9;overflow-x:hidden" :style="connectDeviceStyle">
    <view class="btn-nav-box" @click="backHome" :style="{top: `${systemInfo.statusBarHeight}px`, left: `4px`}">
      <image class="btn-nav" src="@/pageCheck/static/back-btn.png" />
    </view>
    <wl-ecg-check :num="num" :totalTime="totalTime" :tipShowText="tipShowText" ref="wlecgcheckref" />
    <wl-tip-modal :isShow="isAbnormalModal" noCancel :tip="abnormalModalText" sureText="返回重新检测"
      @confirm="confirmAbnormal" />
    <wl-tip-modal :isShow="isShowFail" noCancel tip="请打开蓝牙,用于设备的连接" @confirm="isShowFail = false" />
    <view class="start-tip" v-if="showConnect">
      <text class="dev-connect">{{ '设备连接中...' }}</text>
    </view>
    <view class="start-tip" v-if="show321">
      <text class="count-down">{{ 5 - threeSecond }}</text>
    </view>
    <view class="start-tip" v-if="showBLEDisco">
      <text class="count-down" style="font-size: 40rpx">检测到蓝牙连接已断开，请检查后重试</text>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
  import {
    requestPostProxySetHead,
    GUID
  } from "@/tools/checkTool.js"
  import {
    mapState,
    mapActions,
    mapMutations
  } from "vuex"
  import wlEcgCheck from "../../pageCheck/components/wl-ecg-check.vue"
  import wlTipModal from '../../pageCheck/components/wl-tip-modal.vue'
  import * as wlTool from "../../tools/wlToolReApp.js"

  let gOrigenDataAry16 = []
  export default {
    components: {
      wlEcgCheck,
      wlTipModal
    },
    data() {
      return {
        num: 0,
        threeSecond: 0,
        show321: false,
        showConnect: true,

        //质量判断
        isSigunsteady: false,
        ShowSigunsteadyModalText: "",

        height: 750,

        //异常情况处理
        isAbnormalModal: false,
        abnormalModalText: "",
        systemInfo: null,

        isShowFail: false,
        isUploadModal: false,
        uploadModalText: '',

        totalTime: 30,
        guid: "",
        badres: 0,
        phone: '',
        isCommunity: false,

        showBLEDisco: false
      };
    },
    onUnload() {
      //this.num = 0
      wlTool.setCallBack(null, null, 50)
      console.log('检测记录页面运行结束')
    },
    beforeDestroy() {
      // console.log('销毁num')
      // wlTool.setCallBack(null, null, 50)
      // clearInterval(this.num)
      // this.num = null
    },
    onLoad(options) {
      wx.setKeepScreenOn({
        keepScreenOn: true,
      });
      this.phone = options.phone ? options.phone : uni.getStorageSync('phone')
      this.guid = GUID()
      this.initAndConnect();
      this.isCommunity = options.isCommunity == 'yes' ? 1 : 0;
    },
    created() {
      let windowWidth = wx.getSystemInfoSync().windowWidth;
      let windowHeight = wx.getSystemInfoSync().windowHeight;
      this.height = (750 / windowWidth) * windowHeight;

      this.systemInfo = wx.getSystemInfoSync()
    },
    watch: {
      bleConnectState(val) {
        if (!val) {
          this.show321 = false
        } else {
          this.finshConnect()
        }
      }
    },
    computed: {
      ...mapState({
        bleConnectState: (state) => state.bleConnectState
      }),
      ...mapState('user', ['randomPhone']),
      connectDeviceStyle() {
        return "height:" + this.height + "rpx";
      },
      tipShowText() {
        if (this.show321) {
          return "请放好双手 测试即将开始";
        } else {
          if (this.isSigunsteady) {
            return "信号不平稳 请双手放平稳";
          }
          return "信号质量好 请保持";
        }
      },
    },
    methods: {
      backHome() {
        uni.switchTab({
          url: '/pages/index/index'
        });
      },
      initAndConnect() {
        this.show321 = false;
        this.num = 0;
        this.showConnect = true
        wlTool.connectBLE(5, this.connectResult, null)
      },
      finshConnect() {
        //启动画图计时器
        gOrigenDataAry16 = []
        wlTool.setBLEDataCallback(this.receviceBLEData)
        wlTool.setCallBack(this.$refs.wlecgcheckref.drawECG, this.oneMinFun, 50)
        this.show321 = true
        //完全连接成功
        this.threeSecond = 0;
      },
      receviceBLEData(dataAry) {
        let orginDataAry = wlTool.getECGOriginalData(dataAry)
        for (let index = 0; index < orginDataAry.length; index = index + 2) {
          let value = (orginDataAry[index] / 20).toFixed(0)
          gOrigenDataAry16.push(Number(value))
        }
      },
      oneMinFun(resultObj) {

        if (this.show321) {
          this.threeSecond++;
          if (this.threeSecond === 5) {
            this.show321 = false;
            this.num = 0;
            gOrigenDataAry16 = []
          }
        } else {
          this.isSigunsteady = resultObj.isSigunsteady

          if (this.num < this.totalTime) {
            this.num += 1;
            console.log(this.num)
            if (resultObj.isSigunsteady) {
              console.log(this.num)
              this.num = 0
              gOrigenDataAry16 = []
            }
            //console.log('tric:',this.num)
          } else {
            wlTool.setCallBack(null, null, 50)
            this.uploadData()
          }
        }
        this.$refs.wlecgcheckref.drawHR(resultObj)

      },
      connectResult(data) {
        this.showConnect = false
        let errCode = data.errCode;
        if (errCode === 0) {
          this.finshConnect()
        } else if (errCode === 10013) {
          //无效的
          let data = {
            cate: "0",
            type: 1,
          };
          uni.navigateTo({
            url: "/pagebleConnect/pages/index?data=" + JSON.stringify(data),
          });
        } else if (errCode === 10001) {
          this.isShowFail = true
          let that = this
          wx.onBluetoothAdapterStateChange(function(res) {
            that.showConnect = true
            wlTool.connect(5, that.connectResult, null)
          })
        } else {
          this.abnormalModalText = wlTool.getBleErrorMessage(errCode) + ",请重新配对设备再进行检测。"
          this.isAbnormalModal = true
        }
      },
      async uploadData() {
        const vuePro = this
        let newDataObj = {
          data_ecg: gOrigenDataAry16,
          sampleRate_ecg: 250,
          id: this.guid,
          ecg_type: 'JECGsingleWL',
          recordDate: new Date(),
          deviceSn: wlTool.getDeivceSN(),
          phone: uni.getStorageSync('phone'),
          patientCode: uni.getStorageSync('idCard')
        }
        console.log('上传参数', newDataObj);
        uni.showLoading({
          title: '上传中'
        })
        uni.request({
          url: "https://server.mindyard.cn:84/get_jingtai_single_manb",
          method: 'POST',
          header: {
            user: "zzu",
            password: "zzu123"
          },
          data: newDataObj,
          success(res) {
            uni.hideLoading()
            console.log('心电上传结果', res);
            if (res.data.code == 200) {
              console.log('传递的id', vuePro.guid);
              vuePro.$refs.uToast.show({
                message: '上传成功',
                type: 'success',
                position: 'top',
                duration: 1000,
                complete() {
                  uni.redirectTo({
                    url: '/pageCheck/ecgResult/pages/detail?id=' + vuePro.guid
                  })
                }
              })
            }
          },
          fail(err) {
            console.log(err);
          }
        })
      },
      confirmUpload(data) {
        this.isUploadModal = false
        if (data) {
          this.getRecord()
        } else {
          uni.switchTab({
            url: "/pages/index/index",
          });
        }
      },
      confirmAbnormal() {
        //非正常情况要关闭蓝牙
        wlTool.closeBLEConnection(null)
        uni.switchTab({
          url: "/pages/index/index",
        });
      },
      onUnload() {
        wlTool.closeBLEConnection(null)
      }
    },
  };
</script>

<style lang="scss">
  .btn-nav-box {
    z-index: 11;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 80rpx;
    border-radius: 40rpx;
  }

  .btn-nav-box:hover {
    background-color: rgba(0, 0, 0, .12);
  }

  .btn-nav {
    width: 24rpx;
    height: 36rpx;
  }

  .start-tip {
    z-index: 11;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .dev-connect {
    color: #FFF;
    font-size: 64rpx;
    font-weight: bold;
  }

  .count-down {
    color: #FFF;
    font-size: 360rpx;
    font-weight: bold;
  }
</style>