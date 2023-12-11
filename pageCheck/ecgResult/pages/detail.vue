<template>
  <view class="page" style="background-color: #f2f4f6; padding: 20rpx;">
    <!-- 加载页 -->
    <u-loading-page loading-text="正在分析中..." :loading="showLoading" icon-size="80" font-size="40" color="#b3b4b5"
      loading-color="#09f"></u-loading-page>
    <view class="titleBox card">
      <view class="title">个人信息</view>
      <view class="item">
        <view>姓名：{{ userObj.name}}</view>
        <view>年龄：{{userObj.age }}</view>
        <view>性别：{{ userObj.sex == 1 ? '女' : '男'}}</view>
        <view style="width: max-content;">设备号：{{stateData['设备编号']}}</view>
      </view>
    </view>
    <view class="content">
      <view class="box">
        <view class="consult card">
          <view style="padding: 20rpx;" v-if="diagnosisStatus==0|| diagnosisStatus==3 ||diagnosisStatus==2">
            <view class="res">AI分析结果</view>
            <view style="text-align: justify;">
              心率{{stateData['平均心率']}}次/分钟
            </view>
          </view>
          <view style="margin-top: 30rpx;">
          </view>
          <view class="consult">
            <image style="width: 620rpx;center;display: flex; margin: auto;" mode="scaleToFill" :src="imagePath"
              @click="previewImage" />
            <scroll-view v-if="imagePath == ''" :scroll-y="true">
              <canvas class="report" canvas-id="report"
                :style="{'width':canvasWidth+'px','height':canvasHeight+'px'}"></canvas>
            </scroll-view>
            <view>
              <text style="color: darkred;justify-content: center;display: flex;">点击预览大图</text>
            </view>
          </view>
          <view class="font">心脏健康需要实时防护，您正在养成良好的检测习惯，
            趋势统计将帮您实现健康管理，降低潜在疾病带来的风险。
          </view>
          <view v-if="diagnosisStatus==0|| diagnosisStatus==3|| diagnosisStatus==2" class="fonts">
            注：本报告由互联网医疗与健康服务河南省协同创新中心人工智能平台自动生成，未经临床验证，
            仅供参考，请根据医生临床诊断进一步确诊。
          </view>
          <view v-if="diagnosisStatus==1&&ecgtype == 'JECGsingleWL'" class="fonts">
            提示：该心电图片段为模拟单导联心电图，其诊断限于窦性心律、部分异位心律包括阵发性心房颤动、
            扑动、部分早搏、房室传导阻滞，以及初步判定长RR间期。
          </view>
          <view v-if="diagnosisStatus==1&&ecgtype == 'JECG12YXD'" class="fonts">
            提示：该心电图片段为模拟十二导联心电图，其诊断限于窦性心律、部分异位心律包括阵发性心房颤动、
            扑动、部分早搏、房室传导阻滞，以及初步判定长RR间期。
          </view>
        </view>
      </view>


      <!-- 指标 -->
      <view class="stateList card">
        <view class="stateList-hand">
          <view class="stateList-hand-left">
            <text class="iconfont icon-baogaochaxun"></text>
            <text>ECG 医学指标</text>
            <text class="stateList-hand-left-tips">(共6项)</text>
          </view>
          <view class="stateList-hand-tips">
            <view class="stateList-hand-tips-left">以下心电参数为医学专用术语，如有疑问可查看说明</view>
            <view class="stateList-hand-tips-right" @click="jumpTips()"><text
                class="iconfont icon-changjianwentixiangguanwenti"></text>
            </view>
          </view>
        </view>
        <view class="stateList-list" v-if="!!stateData">
          <view class="stateList-list-item">
            <view class="list-item-left">
              <view class="item-left-name">
                <view>心率</view>
                <view>参考值：</view>
              </view>
              <view class="item-left-value">
                <view>{{ filtration(stateData['平均心率'],'bpm')|| "暂无数据" }}</view>
                <view>{{bloodMin}} bpm ~ {{bloodMax}} bpm</view>
              </view>
            </view>
            <view class="list-item-right" :class="{orange:computeState(stateData['平均心率'],bloodMax,bloodMin)!=='正常'}">
              {{ computeState(stateData['平均心率'],bloodMax,bloodMin) }}
            </view>

            <view class="list-item-tips" style="color:#666">该项会根据年龄不同出现不同的结果，若您的年龄填写有误，可能会得到错误的结果</view>
          </view>

          <view class="stateList-list-item">
            <view class="list-item-left">
              <view class="item-left-name">
                <view>P波</view>
                <view>参考值：</view>
              </view>
              <view class="item-left-value">
                <view>{{ filtration(stateData['P波时限'])|| "暂无数据" }}</view>
                <view>小于等于110 ms</view>
              </view>
            </view>
            <view class="list-item-right" :class="{orange:computeState(stateData['P波时限'],110)!=='正常'}">
              {{ computeState(stateData['P波时限'],110) }}
            </view>
          </view>
          <view class="stateList-list-item">
            <view class="list-item-left">
              <view class="item-left-name">
                <view>PR间期</view>
                <view>参考值：</view>
              </view>
              <view class="item-left-value">
                <view>{{ filtration(stateData['PR间期'])|| "暂无数据" }}</view>
                <view>120 ms ~ 200 ms</view>
              </view>
            </view>
            <view class="list-item-right" :class="{orange:computeState(stateData['PR间期'],200,120)!=='正常'}">
              {{ computeState(stateData['PR间期'],200,120) }}
            </view>
          </view>
          <view class="stateList-list-item">
            <view class="list-item-left">
              <view class="item-left-name">
                <view>QRS波群</view>
                <view>参考值：</view>
              </view>
              <view class="item-left-value">
                <view>{{ filtration(stateData['QRS波时限'])|| "暂无数据" }}</view>
                <view>60 ms ~ 110 ms</view>
              </view>
            </view>
            <view class="list-item-right" :class="{orange:computeState(stateData['QRS波时限'],110,60)!=='正常'}">
              {{ computeState(stateData['QRS波时限'],110,60) }}
            </view>
          </view>
          <view class="stateList-list-item">
            <view class="list-item-left">
              <view class="item-left-name">
                <view>QTc</view>
                <view>参考值：</view>
              </view>
              <view class="item-left-value">
                <view>{{ filtration(stateData['QTc'])|| "暂无数据" }}</view>
                <view>小于431 ms</view>
              </view>
            </view>
            <view class="list-item-right" :class="{orange:computeState(stateData['QTc'],431)!=='正常'}">
              {{ computeState(stateData['QTc'],431) }}
            </view>
          </view>
          <view class="stateList-list-item">
            <view class="list-item-left">
              <view class="item-left-name">
                <view>HRV</view>
                <view>参考值：</view>
              </view>
              <view class="item-left-value">
                <view>{{ filtration(stateData['RMSSD'])|| "暂无数据" }}</view>
                <view>20 ms ~ 89 ms</view>
              </view>
            </view>
            <view class="list-item-right" :class="{orange:computeState(stateData['RMSSD'],89,20)!=='正常'}">
              {{ computeState(stateData['RMSSD'],89,20) }}
            </view>
            <view class="list-item-tips" @click="jumpHRV()">什么是心率变异性？HRV能告诉你什么?</view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
  import {
    drawGraph
  } from "../components/drawECG.js"
  import {
    getUserInfoByCode
  } from '@/request/request.js'

  export default {
    data() {
      return {
        bloodMax: 100,
        bloodMin: 60,
        canvasWidth: 600,
        showLoading: true,
        canvasHeight: 550,
        mainData: [],
        graphic: [],
        diagnosisStatus: '',
        id: '',
        meanHR: "",
        imagePath: '',
        // 心电分析数据
        stateData: null,
        userObj: {
          name: '',
          age: '',
          sex: ''
        }
      }
    },
    onLoad(option) {
      this.getUser()
      this.id = option.id
      console.log('心电id', this.id);
      this.getdetail2()
    },
    methods: {
      previewImage() {
        const images = [this.imagePath];
        uni.previewImage({
          current: 0,
          urls: images,
          longPressActions: {
            itemList: ["保存图片"],
            success: (data) => {
              uni.saveImageToPhotosAlbum({
                //保存图片到相册
                filePath: this.imagePath,
                success: function() {
                  uni.showToast({
                    icon: "success",
                    title: "保存成功",
                  });
                },
                fail: (err) => {
                  uni.showToast({
                    icon: "none",
                    title: "保存失败，请重新尝试",
                  });
                },
              });
            },
          },
        });
      },

      filtration(val, type = 'ms') {
        if (val == 'nan' || !val || val == 'null' || val == null) {
          return ''
        } else {
          return val + ' ' + type
        }
      },

      //计算医学指标
      computeState(val, max, min = 0) {
        if (val == 'nan') {
          return ''
        }
        if (val > max) {
          return '偏高'
        } else if (val < min) {
          return '偏低'
        } else {
          return '正常'
        }
      },
      jumpHRV() {
        uni.navigateTo({
          url: '/pageCheck/ecgResult/pages/whatHRV'
        })
      },
      jumpTips() {
        uni.navigateTo({
          url: '/pageCheck/ecgResult/pages/tips'
        })
      },

      initData(sig) {
        try {
          //this.canvasDraw(sig);
          if (sig.length > 100) {
            //this.changeCanvas(sig); //先定义canvas大小
            this.canvasDraw(sig); //再画单导心电图
          } else {
            this.canvasDraw_12(sig);
          }
        } catch (e) {
          uni.showToast({
            title: "绘制图形数据失败：" + JSON.stringify(e),
            icon: "none",
            duration: 2000,
          });
        }
      },
      canvasDraw(sig) {
        try {
          const ctx = wx.createCanvasContext("report");

          drawGraph(ctx, sig)
          ctx.draw(true, this.saveDraw);
        } catch (e) {
          //TODO handle the exception
          uni.showToast({
            title: "绘制图形数据失败",
            icon: "none",
            duration: 2000,
          });
        }
      },
      saveDraw() {
        let that = this;
        wx.canvasToTempFilePath({
          canvasId: "report",
          success: function(res) {
            let tempFilePath = res.tempFilePath;
            that.imagePath = res.tempFilePath;
          }
        });
      },

      arrTrans(num, arr) { // 一维数组转换为二维数组
        const iconsArr = []; // 声明数组
        arr.forEach((item, index) => {
          const page = Math.floor(index / num); // 计算该元素为第几个素组内
          if (!iconsArr[page]) { // 判断是否存在
            iconsArr[page] = [];
          }
          iconsArr[page].push(item);
        });
        return iconsArr;
      },
      async getUser() {
        const res = await getUserInfoByCode(uni.getStorageSync('idCard'))
        if (res.code === 200) {
          this.userObj.name = res.data.patientName
          this.userObj.age = res.data.patientAge
          this.userObj.sex = res.data.patientSex
        }
      },

      getdetail2() {
        uni.request({
          url: 'https://screen.mindyard.cn/get_jecg_single_manb',
          method: 'POST',
          header: {
            'Authorization': uni.getStorageSync('token'),
            'content-type': 'application/json',
          },
          data: {
            pid: this.id
          },
          dataType: 'json',
          success: res => {
            console.log("静态单导res,", res)
            this.stateData = res.data.ecg_analysis_data;
            this.mainData = this.arrTrans(1000, res.data.II);
            for (var i in this.mainData) {
              for (var j in this.mainData[i]) {
                this.mainData[i][j] = this.mainData[i][j] + (-4) * i
              }
            }
            var dataj = [];
            for (var i in this.mainData) {
              var s_temp = {
                lineStyle: {
                  color: '#333333',
                  type: 'solid',
                  width: 1,
                },
                type: 'line',
                symbol: 'none',
                data: this.mainData[i]
              };
              dataj.push(s_temp)
            }
            this.meanHR = res.data.ecg_analysis_data["平均心率"]

            let sig = []
            for (let item of res.data.II) {
              sig.push(item * 20000)
            }
            this.initData(sig);
            this.mainData = dataj
            var s_temps = {
              type: 'text',
              left: '2%',
              top: '5%',
              z: 999,
              style: {
                text: '增益:10 mm/mV 走速:25 mm/s',
                fill: '#333',
                fontWeight: 400,
                fontSize: 14
              },

            };
            this.graphic.push(s_temps)
            setTimeout(() => {
              this.showLoading = false
            }, 500)
          },
          fail: res2 => {

          },

        });
      },


    }
  }
</script>

<style lang="scss" scoped>
  .orange {
    color: #61afef !important;
  }

  $main-color: #06cc9c;

  .tipText {
    color: $main-color !important;
    text-decoration: underline;
    font-size: 30rpx;
  }

  .res {
    font-size: 35rpx !important;
    font-weight: 700;
    margin-bottom: 10rpx;
  }

  // 顶部个人信息区域
  .titleBox {
    background-color: #fff;
    border-radius: 15rpx;
    padding: 15rpx;
    margin-bottom: 20rpx;

    .title {
      font-style: 35rpx;
      font-weight: 700;
      margin-bottom: 10rpx;
    }

    .item {
      display: flex;
      flex-wrap: wrap;

      view {
        width: 43%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        height: 65rpx;
        line-height: 65rpx;
        font-size: 30rpx;
        font-family: Microsoft YaHei;
        color: #333333;
      }
    }
  }


  .box {
    padding-bottom: 30rpx;
  }

  .iconfont {
    font-size: 45rpx;
    color: #27a2f2;
  }

  .box .name {
    display: flex;
    justify-content: space-between;
    font-size: 30rpx;
    color: #999999;
    padding: 20rpx;
    width: 100%;
  }

  .box .consult {
    background: #FFFFFF;
    border-radius: 15rpx;
    padding: 10rpx 15rpx;
  }

  .box .consult view {
    font-size: 30rpx;
    color: #333333;
  }

  .box .consult view text {
    color: rgba(0, 0, 0, 1.0);
  }

  .box .consult .font {
    font-size: 28rpx;
    margin-top: 20rpx;
    color: #666666;
  }

  .list-item {
    width: 90%;
    height: 100rpx;
    background: #FFFFFF;
    line-height: 100rpx;
    box-shadow: 0px 3rpx 9rpx 0px rgba(51, 51, 51, 0.05);
    border-radius: 15rpx;
    padding: 0 35rpx 0 45rpx;
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 20rpx;
  }

  .list-item text:nth-of-type(2) {
    color: #18B5EA;
  }

  .fonts {
    font-size: 24rpx;
    margin: 40rpx 0;
    color: #999999;
  }

  .stateList {
    padding-bottom: 25rpx;
    background-color: #fff;

    &-hand {
      padding: 20rpx;
      background-color: #fff;

      &-left {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        font-size: 36rpx;
        flex: 0;

        &-tips {
          font-size: 24rpx;
          color: #999999;
        }

        text {
          margin-left: 10rpx;
        }
      }

      &-tips {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-left {
          font-size: 24rpx;
          margin-left: 10rpx;
        }

        &-right {
          color: #27a2f2 !important;
        }
      }
    }

    &-list {
      padding: 0 20rpx;

      &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1rpx solid #9ea9b8;
        background-color: #fff;
        padding: 20rpx 40rpx 20rpx 20rpx;
        margin: 20rpx 0;
        border-radius: 20rpx;
        flex-wrap: wrap;

        .list-item-left {
          display: flex;

          .item-left-name {
            margin-left: 10rpx
          }

          .item-left-value {
            margin-left: 20rpx;
          }
        }

        .list-item-right {}

        .list-item-tips {
          //父元素是flex布局，自身另起一行并独占一行
          display: block;
          width: 100%;
          margin-top: 10rpx;
          margin-left: 10rpx;
          font-size: 24rpx;
          color: #27a2f2;
          flex-shrink: 0;
        }
      }
    }
  }

  .lists .uni-list-cell {
    width: 220rpx;
    height: 60rpx;
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    border-radius: 30rpx;
    font-size: 24rpx;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #333333;
    box-sizing: border-box;
    margin: 0 12rpx 14rpx 0;
  }

  .lists .uni-list-cell.active {
    background: linear-gradient(90deg, #00D6DC 0%, #27A2F2 100%);
    color: #fff;
  }

  .lists .uni-list-cell:nth-of-type(3n) {
    margin-right: 0;
  }

  .lists checkbox {
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  .lists {
    margin: 0 30rpx 20rpx;
  }

  .lists>text {
    font-size: 30rpx;
    display: block;
    margin-bottom: 30rpx;
    color: #999999;
  }

  .listtext text {
    display: block;
    font-size: 30rpx;

    margin: 20rpx 0;
    color: #18B5EA;
  }

  .listtext text:last-child {
    font-size: 30rpx;
    color: #333;
    margin-bottom: 40rpx;

  }

  .preview {
    width: 600rpx;
    height: 580rpx;
    margin: 0;
  }

  .report {
    position: absolute;
    top: 0;
    left: 0;
  }

  .lists .uni-list-cell {
    width: 220rpx;
    height: 60rpx;
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    border-radius: 30rpx;
    font-size: 24rpx;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #333333;
    box-sizing: border-box;
    margin: 0 12rpx 14rpx 0;
  }

  .lists .uni-list-cell.active {
    background: linear-gradient(90deg, #00D6DC 0%, #27A2F2 100%);
    color: #fff;
  }

  .lists .uni-list-cell:nth-of-type(3n) {
    margin-right: 0;
  }

  .lists checkbox {
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  .lists {
    margin: 0 30rpx 20rpx;
  }

  .lists>text {
    font-size: 30rpx;
    display: block;
    margin-bottom: 30rpx;
    color: #999999;
  }

  .marginBottom10 {
    margin-bottom: 10rpx;
  }
</style>