<template>
  <view style="background-color: #f9f9f9;overflow-x:hidden" :style="connectDeviceStyle">
    <view class="btn-nav-box" @click="backHome" :style="{top: `${systemInfo.statusBarHeight}px`, left: `4px`}">
      <image class="btn-nav" src="@/pageCheck/static/back-btn.png" />
    </view>
    <wl-ecg-check :isHolter="true" :testTime="testMin" :tipShowText="tipShowText" ref="wlecgcheckref" />
    <view class="holterbtn" @tap="clickHolterCheck">结束</view>
    <wl-tip-modal :isShow="isAbnormalModal" noCancel :tip="abnormalModalText" sureText="返回重新检测"
      @confirm="confirmAbnormal" />
    <wl-tip-modal :isShow="isShowFail" noCancel tip="请打开蓝牙,用于设备的连接" @confirm="isShowFail = false" />
    <view class="start-tip" v-if="showConnect">
      <text class="dev-connect">{{'设备连接中...'}}</text>
    </view>
    <view class="start-tip" v-if="show321">
      <text class="count-down">{{10 - threeSecond}}</text>
    </view>
  </view>
</template>

<script>
  import {
    requestPostProxySetHead,
    GUID
  } from "@/tools/tool.js"

  import {
    mapState,
    mapActions
  } from "vuex"
  import wlEcgCheck from "../components/wl-ecg-check.vue"
  import wlTipModal from '../components/wl-tip-modal.vue'
  import * as wlTool from "@/tools/wlToolReApp.js"

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
        height: 750,

        //异常情况处理
        isAbnormalModal: false,
        abnormalModalText: "",
        systemInfo: null,

        isShowFail: false,
        isUploadModal: false,
        uploadModalText: '',
        guid: "",
        holeterTime: ''
      };
    },
    onUnload() {
      this.num = 0
    },
    onLoad(options) {
      wx.setKeepScreenOn({
        keepScreenOn: true,
      });

      //判断是否接着上次测试
      let guid = uni.getStorageSync('holeterGUID')
      if (guid) {
        this.guid = guid
        this.holeterTime = uni.getStorageSync('holeterTime')
        if (!this.holeterTime) {
          this.holeterTime = 0
        }
      } else {
        this.guid = GUID()
        uni.setStorageSync('holeterGUID', this.guid)
      }

      this.initAndConnect();
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
      connectDeviceStyle() {
        return "height:" + this.height + "rpx";
      },
      tipShowText() {
        if (this.show321) {
          return "请放好 测试即将开始";
        } else {
          if (this.isSigunsteady) {
            return "信号不平稳 请保持平稳";
          }
          return "信号质量好 请保持";
        }
      },
      testMin() {
        return Number(this.holeterTime / 3).toFixed(0)
      }
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
          if (this.threeSecond === 10) {
            this.show321 = false;
            this.num = 0;
            gOrigenDataAry16 = []
          }
        } else {
          this.isSigunsteady = resultObj.isSigunsteady
          if (this.num < 20) {
            this.num += 1;
          } else {
            this.num = 0
            let dataAry = gOrigenDataAry16
            this.uploadData(dataAry)
            gOrigenDataAry16 = []
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
      async uploadData(OrigenDataAry) {
        let newDataObj = {
          data_ecg: OrigenDataAry,
          sampleRate_ecg: 250,
          id: this.guid,
          ecg_type: 'DECGsingleWL',
          recordDate: new Date(),
          deviceSn: wlTool.getDeivceSN(),
          phone: uni.getStorageSync('username')
        }
        let url = "https://server.mindyard.cn:84/get_json_single"
        let head = {
          user: "zzu",
          password: "zzu123"
        }
        console.log(newDataObj)
        requestPostProxySetHead(url, newDataObj, head).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.holeterTime++
            uni.setStorageSync('holeterTime', this.holeterTime)
          } else if (res.code == 201) {
            uni.showToast({
              title: '请求参数错误',
              icon: 'none',
              duration: 5000
            })
          } else if (res.code == 202) {
            uni.showToast({
              title: '采集数据无效',
              icon: 'none',
              duration: 5000
            })
          }
        }).catch(err => {
          console.log(err)
          uni.showToast({
            title: '数据无法上传',
            icon: 'none',
            duration: 5000
          })
        })
      },
      clickHolterCheck() {
        uni.removeStorageSync("holeterGUID")
        uni.removeStorageSync("holeterTime")

        let url = "/pagesRecord/pages/detail?id=" + uni.getStorageSync('username') + "&&pid=" + this.guid +
          "&&type=DECGsingleWL"
        uni.navigateTo({
          url: url,
        });
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

  .holterbtn {
    position: absolute;
    bottom: 100rpx;
    margin: 30rpx 30rpx;
    width: 690rpx;
    height: 90rpx;
    background: linear-gradient(-84deg, #00D6DC, #27A2F2);
    border-radius: 45rpx;
    font-size: 34rpx;
    line-height: 90rpx;
    color: #FFFFFF;
    text-align: center;
  }
</style>