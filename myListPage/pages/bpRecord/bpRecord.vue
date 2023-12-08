<template>
  <view style="padding: 20rpx;">
    <!-- 血压 -->
    <view class="box card">
      <view class="title">
        <view style="font-size: 36rpx; font-weight: 700;">血压检测</view>
        <view class="jump" @click.once="jumpBlood" v-if="showOnce">
          没有设备？手动填写
        </view>
      </view>
      <view class="jump" style="color:green;text-align: center;" v-if="showState2===1&&showState===2">
        设备已再次连接，等待数据传输
      </view>

      <view class="content" v-if="showState===2">
        <view style="display: flex;justify-content: center ; width: 100%;">
          <view class="content_item">
            <input class="inputs" type="number" @input="checkButtonDisabled" maxlength="3" placeholder="0"
              v-model.number="bpObj.hp">
            </input>
            <view class="">
              收缩压/高压
            </view>
            <view class="tip">
              mmHg
            </view>
          </view>
          <view class="content_item">
            <input class="inputs" type="number" @input="checkButtonDisabled" maxlength="3" placeholder="0"
              selection-start="0" :selection-end="bpObj.hp.length" v-model.number="bpObj.lp"></input>
            <view class="">
              舒张压/低压
            </view>
            <view class="tip">
              mmHg
            </view>
          </view>
          <view class="content_item">
            <input class="inputs" type="number" @input="checkButtonDisabled" maxlength="3" placeholder="0"
              v-model.number="bpObj.bp">
            </input>
            <view class="">
              脉搏
            </view>
            <view class="tip">
              bpm
            </view>
          </view>
        </view>
        <view class="tips" v-show="showState3===1">测量数据不准确？您可以再次启动设备或手动更改数据</view>
      </view>

      <view class="content" v-else-if="showState===0" :style="{'color': titleTextColor}">{{ titleText }}</view>
      <view class="content" v-else-if="showState===1">
        <view class="content_item">
          当前血压
          <input class="inputs" type="number" :color="tipColor1" maxlength="3" placeholder="0"
            v-model.number="bpObj.hp">
          </input>
          mmHg
          <view class="">
            测量中
          </view>
        </view>
      </view>
      <view class="content" v-else-if="showState===3"
        style="flex-direction: column;justify-content: center;align-items: center">
        <view>蓝牙服务启动失败,请打开蓝牙和位置</view>
        <view>然后
          <text style="color: #39f; font-size: 40rpx;" @click="bleInit">点击此处</text>
          刷新页面
        </view>
      </view>
    </view>
    <view class="tips" @click="getData">数据传输失败？ 手动获取数据</view>
    <view class="tips" @click="showPop = true">测量过程中出现错误？</view>
    <!-- 错误原因弹出层 -->
    <u-popup :show="showPop" :round="20" mode="bottom">
      <view class="swiper_title">
        可能原因和处理方法
      </view>
      <scroll-view class="swiper" scroll-y>

        <view class="swiper_list" v-for="(item, i) in errList" :key="i">
          <view class="swiper_list_left">
            {{ item.title }}
          </view>
          <view class="swiper_list_right">
            <view class="">
              <text>原因：</text>
              {{ item.contentTop }}
            </view>
            <view class="">
              <text>解决方案：</text>
              {{ item.contentBottom }}
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="p_10_20 mt20" style="padding-bottom: 30rpx;">
        <view @click="showPop = false" style="background-color: #fe5153;" class="btn">我知道了</view>
      </view>
    </u-popup>
    <!-- 症状 -->
    <view class="box card">
      <view class="title">
        测量时有哪些不适
      </view>
      <view class="symptom_box">
        <view class="symptom_item card" v-for="(item,index) in symptomArr" :key="index"
          @click="selectValue(item.name, index)" :class="[selectArr.indexOf(item.name) !== -1?'active':'']">
          {{ item.name }}
        </view>
      </view>
      <view class="textarea_box p_10_20" v-if="showTextarea">
        <u--textarea count v-model.trim="otherAymptom" placeholder="请输入其他不适症状" maxlength="45">
        </u--textarea>
      </view>
    </view>
    <!-- 行为 -->
    <view class="box m20 card" v-if="showTip1">
      <view class="title">
        测量前做了什么，您的指标有些不正常
      </view>
      <view class="symptom_box">
        <view class="symptom_item card" v-for="(item,index) in doArr" :key="index"
          @click="select1Value(item.name, index)" :class="[select1Arr.indexOf(item.name) !== -1?'active':'']">
          {{ item.name }}
        </view>
      </view>
      <view class="textarea_box p_10_20" v-if="showDoTextarea">
        <u--textarea count v-model.trim="otherDo" placeholder="请输入其他行为" maxlength="45">
        </u--textarea>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="mt20" style="padding: 20rpx;">
      <view :class="[btnDisabled ? 'dis' : '']" @click="submitBp" style="background-color: #09f;" class="btn">完成检测
      </view>
    </view>

  </view>
</template>

<script>
  import * as wlBlood from '@/tools/wlBlood.js'
  import {
    upLoadBlood
  } from '@/request/request.js'

  export default {
    data() {
      return {
        titleText: '蓝牙服务启动中',
        titleTextColor: '',
        showState2: 0,
        showState3: 0,
        showOnce: true,
        showPop: false,
        bpObj: {
          // 高压
          hp: '',
          // 低压
          lp: '',
          // 脉搏
          bp: ''
        },
        setNav: {
          'isdisPlayNavTitle': true,
          'navTitle': '血压自测' //导航标题
        },
        // 错误提示数组
        errList: [{
            title: 'Err 3',
            contentTop: '4S内加压值未到5mmHg',
            contentBottom: '请系紧袖带后重新测量'
          },
          {
            title: 'Err 4',
            contentTop: '无法检测出高低压',
            contentBottom: '手臂或身体保持不动，重新测量'
          }, {
            title: 'Err 5',
            contentTop: '加压错误',
            contentBottom: '请系紧袖带后重新测量'
          }, {
            title: 'Err 6',
            contentTop: '手臂或身体运动引起加压不当',
            contentBottom: '手臂或身体保持不动，重新测量'
          }, {
            title: 'Err 7',
            contentTop: '袖带太松或松脱',
            contentBottom: '请系紧袖带后重新测量'
          }, {
            title: 'Err 8',
            contentTop: '压力超过300mmHg',
            contentBottom: '手臂或身体保持不动，重新测量'
          }, {
            title: '电量不足',
            contentTop: '电池电量耗尽',
            contentBottom: '请连接电源适配器进行充电'
          }
        ],
        showState: 0,
        // 选择症状数组
        selectArr: [],
        // 选择行为数组
        select1Arr: [],
        // 是否禁用提交按钮
        btnDisabled: true,
        // 行为的描述
        showTip1: false,
        otherAymptom: '',
        otherDo: '',
        doArr: [{
            name: '无',
          },
          {
            name: '剧烈运动',
          },
          {
            name: '压力大',
          },
          {
            name: '饭菜咸',
          },
          {
            name: '喝咖啡',
          },
          {
            name: '吸烟',
          },
          {
            name: '喝酒',
          },
          {
            name: '生气',
          },
        ],
        // 症状数组
        symptomArr: [{
            name: '无',
          },
          {
            name: '头晕目眩',
          }, {
            name: '心慌/心悸',
          },
          {
            name: '胸闷/胸痛',
          },
          {
            name: '上肢疼痛',
          },
          {
            name: '下肢水肿',
          },
          {
            name: '心跳不齐',
          },

          {
            name: '呼吸急促',
          },
          {
            name: '手脚麻木',
          },
          {
            name: '耳鸣',
          }, {
            name: '恶心',
          }, {
            name: '焦虑',
          }
        ],

      };
    },
    onLoad() {
      this.closeBleAndOpen()
    },
    mounted() {
      wlBlood.initialize(this.bleDispose)
    },
    watch: {
      selectArr() {
        if (this.showTip && this.selectArr.length !== 0) {
          this.btnDisabled = false
        }
      },
      otherAymptom() {
        if (this.showTip && this.otherAymptom) {
          this.btnDisabled = false
        }
      },
      otherDo() {
        if (this.showTip1 && this.otherDo) {
          this.btnDisabled = false
        }
      },
      select1Arr() {
        if (this.showTip1) {
          if (this.select1Arr.length !== 0) {
            this.btnDisabled = false
          }
        }
      }
    },
    computed: {
      showTextarea() {
        return this.selectArr.some(item => item.includes('无')) ? false : true
      },
      showDoTextarea() {
        return this.select1Arr.some(item => item.includes('无')) ? false : true
      }
    },
    methods: {
      // 关闭已连接的设备，开启另一台
      closeBleAndOpen() {
        uni.openBluetoothAdapter({
          success(res) {
            console.log('蓝牙状态正常', res)
            // 查询蓝牙连接列表
            uni.getConnectedBluetoothDevices({
              success(res) {
                console.log('查询蓝牙连接列表', res)
                // 循环遍历断开已连接的设备
                for (let i = 0; i < res.devices.length; i++) {
                  uni.closeBLEConnection({
                    deviceId: res.devices[i].deviceId,
                    success(res) {
                      console.log('断开蓝牙连接成功', res);
                    },
                    fail(err) {
                      console.log('断开蓝牙连接失败', err);
                    }
                  });
                }
              },
              fail(err) {
                console.log('查询蓝牙连接列表失败', err);
              }
            })
          },
          fail(err) {
            console.log('蓝牙状态异常', err);
          }
        })
      },
      getData() {
        uni.$showMsg('获取中...', 'loading')
        wlBlood.getLastData('0106')
      },
      selectValue(item, index) {
        // 如果传递的下标为0 也就是无，清空数组，只放无这个字段
        if (index === 0) {
          this.selectArr = []
          this.selectArr.push(item);
        } else {
          // 如果包含无 就删除该字段
          if (this.selectArr.includes('无')) {
            this.selectArr.splice(0, 1)
          }
          // 如果数组中已经有该字段 删除
          if (this.selectArr.includes(item)) {
            this.selectArr.splice(this.selectArr.indexOf(item), 1)
          } else {
            this.selectArr.push(item);
          }
        }
      },
      select1Value(item, index) {
        // 如果传递的下标为0 也就是无，清空数组，只放无这个字段
        if (index === 0) {
          this.select1Arr = []
          this.select1Arr.push(item);
        } else {
          // 如果包含无 就删除该字段
          if (this.select1Arr.includes('无')) {
            this.select1Arr.splice(0, 1)
          }
          // 如果数组中已经有该字段 删除
          if (this.select1Arr.includes(item)) {
            this.select1Arr.splice(this.select1Arr.indexOf(item), 1)
          } else {
            this.select1Arr.push(item);
          }
        }
      },
      // 输入框的input事件
      checkButtonDisabled() {
        this.showState3 = 0
        // 判断数据是否不正常
        // 是否禁用按钮
        if (this.bpObj.hp !== '' && this.bpObj.bp !== '' && this.bpObj.lp !== '') {
          this.btnDisabled = false
          if (this.bpObj.hp > 200 || this.bpObj.bp > 180 || this.bpObj.lp > 150) {
            this.showTip1 = true
          }
        } else {
          this.btnDisabled = true
        }
      },
      // 跳过血压步骤
      jumpBlood() {
        // uni.navigateBack()
        // this.bpObj.bp=0;
        // this.bpObj.hp=0;
        // this.bpObj.lp=0;
        this.showState = 2
        setTimeout(() => {
          this.showOnce = false
        }, 500)
      },
      // 提交表单
      submitBp() {
        if (this.btnDisabled) return
        if (!this.bpObj.hp || !this.bpObj.lp || !this.bpObj.lp) {
          return uni.$showMsg('请填写血压数据')
        }
        if (this.showTip1 && this.select1Arr.length === 0 && this.otherDo === '') {
          return uni.$showMsg('请填写测量前行为')
        }
        if (this.bpObj.hp > 400 || this.bpObj.lp > 400 || this.bpObj.hp < 40 || this.bpObj.lp < 20) {
          return uni.$showMsg('请输入正确的血压数据')
        }
        this.submitData()
      },
      // 提交数据
      async submitData() {
        const obj = {
          hp: this.bpObj.hp,
          lp: this.bpObj.lp,
          bp: this.bpObj.bp ? this.bpObj.bp : 0,
          otherAymptom: this.selectArr.length11 ? this.selectArr.join(',') + ',' + this.otherAymptom : '无',
          otherDo: this.selectArr.length ? this.selectArr.join(',') + ',' + this.otherDo : '无',
          patientCode: uni.getStorageSync('idCard')
        }
        // 检测字符串最后一个字符是否为逗号
        if (obj.otherAymptom.charAt(obj.otherAymptom.length - 1) === ',') {
          // 删除最后一个字符
          obj.otherAymptom = obj.otherAymptom.slice(0, -1);
        }
        if (obj.otherDo.charAt(obj.otherDo.length - 1) === ',') {
          // 删除最后一个字符
          obj.otherDo = obj.otherDo.slice(0, -1);
        }
        // 这里请求服务器保存 obj
        const res = await upLoadBlood(obj)
        console.log(res);
        if (res.code === 200) {
          uni.$showMsg('提交成功', 'success')
          setTimeout(() => {
            uni.navigateBack()
          }, 600)
        }
      },
      // 接收到数据的回调函数
      saveData(data, callback) {
        console.log('接收到了');
        this.bpObj.hp = parseInt(data.systolic) //收缩压
        this.bpObj.lp = parseInt(data.diastolic) //舒张压
        //data.mean//平均动脉压
        this.bpObj.bp = parseInt(data.pulse) //脉搏
        this.showState = 1
        if (this.bpObj.hp != 255 && this.bpObj.lp != 255 && this.bpObj.bp != 255) {
          this.timeOut()
        }
      },
      timeOut() {
        this.btnDisabled = false
        this.showState = 2
      },
      // 蓝牙未开启 重新初始化蓝牙
      bleInit() {
        this.showState = 0
        this.titleText = '蓝牙服务启动中'
        wlBlood.initialize(this.bleDispose)
      },
      // 蓝牙连接失败处理 函数
      noBlue() {
        this.showState = 3
      },
      bleConnect() {
        this.showState = 0
        this.titleText = '设备已连接，等待数据传输'
        this.titleTextColor = '#00b26a'
      },
      bleDispose(code, data) {
        if (code === 0x01) {
          //监听到数据
          let time = new Date()
          this.saveData(data.data, data.callback)
          this.showState2 = 0
          this.showState3 = 1
        } else if (code === 0x02) {
          //蓝牙连接失败
          this.noBlue()
        } else if (code === 0x03) {
          //蓝牙连接成功
          if (this.showState !== 2) {
            this.bleConnect()
            this.showState2 = 0
          }
        } else if (code === 0x04) {
          //蓝牙连接已断开
          console.log('0x04连接断开')
          if (this.showState !== 2) {
            this.showState = 0
          }
          this.titleText = '设备未连接,等待设备启动中'
          this.titleTextColor = ''
        } else if (code === 0x05) {
          //重新连接蓝牙设备
          this.showState2 = 1
          if (this.bpObj.hp != 0 && this.bpObj.hp != 255) {
            return
          }
          this.bleConnect()
        } else if (0x06) {
          //蓝牙服务启动成功
          this.titleText = '设备未连接,等待设备启动中'
        } else {
          console.log('其他选项')
        }
      },
      //卸载时
      onUnload() {
        // 销毁血压计的蓝牙连接
        wlBlood.closeBluetooth()
      },
    }
  }
</script>

<style lang="scss" scoped>
  $main-color: #09f;

  .card {
    box-shadow: 0rpx 0rpx 3rpx rgba(0, 0, 0, .1);
    background-color: #fff;
  }

  /deep/ .u-textarea {
    padding: 0 !important;
  }

  /deep/ .u-textarea__field {
    height: 70px !important;
    background-color: #f2f4f6;
    border-radius: 15rpx;
    padding: 20rpx;
  }

  .btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    color: #fff;
    font-size: 32rpx;
    border-radius: 50rpx;
    text-align: center;
  }

  .dis {
    opacity: .4;
  }


  // 输入框样式
  .inputs {
    height: 130rpx;
    line-height: 130rpx;
    font-size: 60rpx;
    width: 150rpx;
    border-radius: 15rpx;
    margin: 0 auto;
    margin-bottom: 10rpx;
    background: #f4f6fa;
  }


  .swiper_title {
    font-size: 35rpx;
    width: 50%;
    text-align: center;
    margin: 0 auto;
    padding-top: 20rpx;
  }

  .swiper {
    width: 92%;
    height: 800rpx;
    overflow: hidden;
    text-align: center;
    padding: 20rpx;


    &_list {
      width: 95%;
      height: 140rpx;
      margin: 20rpx auto;
      display: flex;

      &_left {
        flex: 15%;
        margin-right: 15rpx;
        line-height: 140rpx;
        border: 2rpx solid #d7d7d7;
        border-radius: 10rpx;
      }

      &_right {
        border-bottom: 2rpx solid #ccc;
        flex-direction: column;
        display: flex;
        font-size: 26rpx;
        justify-content: center;
        text-align: left;
        overflow: hidden;
        flex: 70%;

        view {
          white-space: nowrap;
          /* 不换行 */
          text-overflow: ellipsis;
          /* 文本溢出时显示省略号 */
        }

        text {
          color: #5da4d5;

        }
      }
    }
  }

  .tips {
    text-align: center;
    margin: 10rpx 0;
    padding: 15rpx;
  }

  .box {
    border-radius: 15rpx;
    font-size: 35rpx;
    padding-bottom: 15rpx;

    .title {
      display: flex;
      justify-content: space-between;
      padding: 25rpx;

      .jump {
        color: #c0c4cc;
      }
    }

    .content {
      width: 85%;
      margin: 10rpx auto 20rpx;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      min-height: 240rpx;

      .content_item {
        width: 32%;
        margin: 5rpx;
        text-align: center;

        .tip {
          color: #c0c4cc;
          font-size: 30rpx;
        }
      }

      .tips {
        width: 750rpx;
        display: flex;
        justify-content: center;
        color: #c0c4cc;
        font-size: 30rpx;
        flex: 1;
        margin-top: 20rpx;
      }
    }
  }

  // 隐藏元素并保留位置
  .vhidden {
    visibility: hidden;
  }

  .p_10_20 {
    padding: 10rpx 20rpx;
  }

  .m20 {
    margin: 20rpx 0;
  }

  .tip_no {
    height: 42rpx;
    margin: 10rpx 0;
    padding-left: 20rpx;
  }

  .symptom_box {
    width: 100%;
    margin: 20rpx 0;
    display: flex;
    flex: 33.33%;
    flex-wrap: wrap;
    padding: 0 10rpx;

    .symptom_item {
      width: 30%;
      margin: 8rpx;
      height: 65rpx;
      border-radius: 20rpx;
      line-height: 65rpx;
      text-align: center;
      border: 1px solid #ccc;
    }

    .active {
      background: #b7e1ff;
      color: #09f;
      border: 1px solid #094af7;
    }
  }

  .showData {
    display: block;
    background-color: #F4F6FA;
    font-size: 60rpx;
    text-align: center;
    border-radius: 15rpx;
    width: 60rpx;
    height: 77rpx;
    line-height: 77rpx;
    flex: 1;
  }
</style>