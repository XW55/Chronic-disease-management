<template>
  <view class="page">
    <view class="top"></view>
    <u-toast ref="uToast"></u-toast>
    <!-- 手机号登录 -->
    <!-- <view v-if="!showCodeLogin">
      <view class="title">手机号登录</view>
      <button class="btn" v-if="show1" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号一键登录 </button>
      <button class="btn" v-else @click="tip">手机号一键登录 </button>
      <view class="btn" style="color:#09f; background-color: #c6e2ff;" @click="showCodeLogin = true">其他手机号/账号登录
      </view>
    </view> -->

    <!-- 验证码登录 -->
    <!-- <view v-else> -->
    <view class="title">验证码登录</view>
    <view class="btn inputBox"> <text class="iconfont icon-shouji"></text> <input type="number" style="width: 90%;"
        placeholder="请输入手机号" v-model="userPhone" />
    </view>
    <view class="btn inputBox"> <text style="font-size: 45rpx;" class="iconfont icon-yanzhengma"></text> <input
        type="number" style="width: 380rpx;" placeholder="请输入验证码" v-model="userPwdPhone" /><text class="getCodeBtn"
        @click="getPhonecode">{{codeBtn.codeText}}</text> </view>
    <button class="btn" @click="login">登录 </button>
    <!-- </view> -->
    <!-- 隐私协议 -->
    <view class="xy">
      <checkbox-group @change="checkboxChange">
        <checkbox value="1" style="transform:scale(1);transform-origin: left center; margin-left: 70rpx;" />
        <view>我已阅读并同意
          <navigator url="../xy/xy" style="color:#09f">
            《服务协议》</navigator>
          与<navigator url="../ys/ys" style="color:#09f">
            《隐私政策》</navigator>
        </view>
      </checkbox-group>
    </view>
    <!-- 底部logo -->
    <view class="title logo">
      <!-- <image src="../../static/images/logo.png" class="logoImg"></image> -->
      医护患
    </view>
  </view>
</template>

<script>
  import {
    getCode,
    userLogin
  } from '@/request/request.js'
  export default {
    data() {
      return {
        userPhone: '',
        userPwdPhone: '',
        userPhone2: '',
        userPsd: '',
        ty: '',
        smsCode: '',
        uuid: '',
        showCodeLogin: false,
        show1: false,
        rules: {
          userPhone: {
            rule: /^1[3456789]\d{9}$/,
            msg: "请正确输入手机号"
          },
          userPwdPhone: {
            rule: /^[1-9][0-9]{0,3}$/,
            msg: "请输入4位以内数字验证码"
          },
          userPhone2: {
            rule: /^1[3456789]\d{9}$/,
            msg: "请正确输入手机号"
          },
          userPsd: {
            rule: /\S/,
            msg: "请输入验证码"
          }
        },
        codeBtn: {
          codeTime: 60,
          codeText: "获取验证码",
          codeStatus: true
        },
      }
    },
    onLoad() {
      this.show1 = false;

    },
    methods: {
      tip() {
        return uni.$showMsg('请勾选下面协议')
      },

      // 勾选框
      checkboxChange: function(e) {
        var _this = this
        var ss = e.detail.value.length;
        if (ss > 0) {
          _this.ty = 1;
          this.show1 = true
        } else {
          _this.ty = 0;
          this.show1 = false
        }
      },

      validate(key) {
        let bool = true;
        if (!this.rules[key].rule.test(this[key])) {
          //提示信息

          this.$refs.uToast.show({
            message: this.rules[key].msg,
            type: 'warning',
            position: 'top',
            duration: 1000
          })
          //取反
          bool = false;
          return false;
        }
        return bool;
      },

      // 获取验证码
      async getPhonecode() {
        console.log('确实点击了');
        if (!this.codeBtn.codeStatus) return
        // 判断验证码按钮是否可点击
        this.codeBtn.codeStatus = false
        const res = await getCode({
          username: this.userPhone
        })
        console.log(res);
        if (res.code === 200) {
          this.uuid = res.uuid
        }
        let timerId = setInterval(() => {
          let codetime = this.codeBtn.codeTime
          codetime--
          this.codeBtn.codeTime = codetime
          this.codeBtn.codeText = codetime + "s后重新获取"
          if (codetime < 1) {
            clearInterval(timerId)
            this.codeBtn.codeText = "重新获取"
            this.codeBtn.codeTime = 60
            this.codeBtn.codeStatus = true
          }
        }, 1000)
      },
      async login() {
        if (this.validate('userPhone') && this.validate('userPwdPhone')) {
          if (this.ty == 0) {
            this.$refs.uToast.show({
              message: '请勾选下方条款',
              type: 'warning',
              position: 'top',
              duration: 1000
            })
            return;
          }
          const res = await userLogin({
            username: this.userPhone,
            code: this.userPwdPhone,
            uuid: this.uuid
          })
          if (res.code === 200) {
            console.log(res);
            uni.setStorageSync('token', res.token)
            uni.setStorageSync('phone', this.userPhone)
            if (res.patientCode) {
              uni.setStorageSync('idCard', res.patientCode)
            }
            // if (res.BindingState) {
            this.$refs.uToast.show({
              message: '登录成功',
              type: 'success',
              position: 'top',
              duration: 1000,
              complete() {
                uni.switchTab({
                  url: '/pages/index/index'
                })
              }
            })
            // } 
            // else {
            //   uni.navigateTo({
            //     url: '/modif/signIn/signIn'
            //   })
            // }
          } else {
            this.$refs.uToast.show({
              message: res.msg,
              type: 'warning',
              position: 'top',
              duration: 1000,
            })
          }
        }
      },
    },


  }
</script>

<style lang="scss" scoped>
  $main-color: #09f;

  .top {
    width: 100%;
    height: 220rpx;
  }

  .iconfont {
    margin-left: 30rpx;
    font-size: 45rpx;
    color: $main-color;
  }

  .title {
    font-size: 52rpx;
    color: $main-color;
    font-weight: 700;
    width: max-content;
    margin: 0 auto 100rpx;
    font-family: "PingFang SC";
  }

  .xy {
    width: 80%;
    text-align: center;
    margin: 40rpx auto;
    color: #4f544f;
    font-size: 22rpx;
    white-space: nowrap;


    /deep/ checkbox-group {
      display: flex;
      align-items: center;
    }

    navigator {
      display: inline-block;
    }
  }

  .page {
    height: 100vh;
    overflow: hidden;
  }

  .text {
    font-size: 28rpx;
    color: #666666;
    opacity: 0.8;
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .btn {
    width: 90%;
    height: 90rpx;
    background-color: $main-color;
    margin: 30rpx auto;
    border-radius: 40rpx;
    font-size: 32rpx;
    line-height: 90rpx;
    color: #FFFFFF;
    text-align: center;
  }

  .inputBox {
    border: 1rpx solid $main-color;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    input {
      color: #000;
      color: #000;
      height: 100%;
      text-align: left;
      margin-left: 20rpx;
    }

    .getCodeBtn {
      width: 200rpx;
      height: 60rpx;
      line-height: 55rpx;
      font-size: 28rpx;
      text-align: center;
      padding: 5rpx 10rpx;
      margin-right: 10rpx;
      border-radius: 25rpx;
      background-color: $main-color;
      color: #fff;
    }
  }

  .logo {
    position: fixed;
    display: flex;
    align-items: center;
    bottom: 10rpx;
    left: 50%;
    transform: translateX(-50%);
    font-size: 33rpx;
    font-weight: 700;
    color: #000;

    .logoImg {
      display: block;
      width: 40rpx;
      height: 40rpx;
      margin-right: 15rpx;
      vertical-align: middle;
    }
  }
</style>