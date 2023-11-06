<template>
  <view class="page">
    <image src="https://ecg.mindyard.cn:84/uploadPath/index/bg2.png" class="bg"></image>
    <view class="content">
      <view class="tab">
        <view class="titleCenter loginText">
          登录
        </view>
        <view class="titleCenter welcome">
          欢迎登录使用迈雅科技！
        </view>
        <view>
          <input type="text" placeholder="手机号" class="input-code" v-model="userPhone">
          <view class="input-code">
            <input type="text" placeholder="验证码" v-model="userPwdPhone" style="width:50%">
            <view class="phone-code" @tap="getPhonecode">{{codeBtn.codeText}}</view>
          </view>
          <view class="btn1" @tap="login">确认</view>

          <!-- 微信一键登录 用户勾选时 -->
          <!--          <button v-if="show1" class="wxBtn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            <view style="text-align: center;" @getphonenumber="getPhoneNumber">
              <view class="wxLogo">
                <image src="../../static/images/pay.png"></image>
              </view>
              <view class="">
                微信一键登录
              </view>
            </view>
          </button>
          <button v-else class="wxBtn" @click="tip">
            <view style="text-align: center;">
              <view class="wxLogo">
                <image src="../../static/images/pay.png"></image>
              </view>
              <view class="">
                微信一键登录
              </view>
            </view>
          </button> -->
        </view>
      </view>
      <view class="xy">
        <checkbox-group @change="checkboxChange">
          <checkbox value="1" style="transform:scale(1);transform-origin: left center;" />
          <view>我已阅读并同意
            <navigator url="../xy/xy">
              《服务协议》</navigator>
            与<navigator url="../ys/ys">
              《隐私政策》</navigator>
          </view>
        </checkbox-group>
      </view>
      <!-- #ifdef APP-PLUS -->
      <view class="switchLoginState">
        <view class="icon" @click="otherLogin('weixin')">
          <image src="@/static/images/wx.png"></image>
        </view>
      </view>
      <!-- #endif -->
    </view>
  </view>
</template>

<script>
  // import {
  //   getUserInfo
  // } from "@/common/request.js";
  // import {
  //   mapMutations
  // } from 'vuex'
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
        show1: false,
        tabCurrentIndex: 0,
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

        phone_code: '',
        phone_encryptedData: '',
        phone_iv: ''
      }
    },
    onLoad(res) {
      this.getuserNew();
      if (res.flag) {
        uni.showToast({
          title: '身份认证失败,请先登录',
          icon: 'none'
        }, 1000)
      }
      this.show1 = false;
      if (uni.getStorageSync('tel2') && uni.getStorageSync('password')) {
        this.userPhone2 = uni.getStorageSync('tel2')
        this.userPsd = uni.getStorageSync('password')
      }


    },
    methods: {
      // ...mapMutations('m_user', ['updateToken']),
      // ...mapMutations({
      //   setBarUser: 'SET_BAR_USER',
      //   setIsDoctor: 'SET_IS_DOCTOR'
      // }),
      tip() {
        return uni.$showMsg('请勾选下面协议')
      },
      // 获取code
      otherLogin(type) {
        if (this.ty == 0) {
          uni.showToast({
            title: "请先查看并同意条款后勾选",
            icon: 'none'
          })
          return;
        }
        //使用uni的微信登陆
        uni.getProvider({
          service: 'oauth',
          success: function(res) {
            console.log(res)
          }
        });
        uni.login({
          provider: type,
          success: res => {
            console.log(res)
            this.phone_code = res.code
          }
        });
      },
      getuserNew() {
        let that = this
        uni.getProvider({
          service: 'oauth',
          success: function(res) {}
        });
        uni.login({
          provider: 'weixin',
          success: res => {
            that.phone_code = res.code
          }
        });
      },

      // 获取用户手机号
      getPhoneNumber(res) {
        console.log('确实是点到了')
        const vuePro = this
        this.phone_encryptedData = res.detail.encryptedData; //用于解密
        this.phone_iv = res.detail.iv; // 用于解密
        console.log(this.phone_code, this.phone_encryptedData, this.phone_iv)
        if (this.show1 == true) {
          uni.request({
            url: this.$apiurl + "wxLogin",
            data: {
              code: this.phone_code,
              encryptedIv: this.phone_iv,
              encryptedData: this.phone_encryptedData,
            },
            method: 'POST',

            dataType: 'json',
            success(res) {
              if (res.data.phone.length == 11) {
                uni.showToast({
                  title: "登录成功",
                  icon: "none",
                  duration: 2000
                })
                var token = res.data.token;
                // uni.setStorageSync('token', token)
                vuePro.updateToken(token)
                getUserInfo(res.data.phone).then(data => {
                  vuePro.setBarUser({
                    name: data.data.data.userName,
                    tel: data.data.data.patientPhone
                  })
                })
                uni.setStorageSync('tel', res.data.phone)
                uni.setStorageSync('username', res.data.phone)
                uni.setStorageSync('isDoctor', res.data.IsDoctor)
                vuePro.setIsDoctor(res.data.IsDoctor)
                if (res.data.BindingState) {
                  uni.switchTab({
                    url: '/pages/index/index',
                  })
                } else {
                  uni.redirectTo({
                    url: '/pages/index/info',
                  })
                }
              } else {
                uni.showToast({
                  title: "太频繁，请等一分钟",
                  icon: "none",
                  duration: 1000
                })
              }

            },
            fail(res) {

            },
          });
        } else {
          uni.showToast({
            title: '请勾选下面条款',
            icon: 'none',
            duration: 2000
          })
        }
      },

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
      tabClick(index) {
        this.tabCurrentIndex = index;
      },

      validate(key) {
        let bool = true;

        if (!this.rules[key].rule.test(this[key])) {
          //提示信息

          uni.showToast({
            title: this.rules[key].msg,
            icon: 'none'
          })
          //取反
          bool = false;
          return false;
        }
        return bool;
      },

      getPhonecode() {
        var _this = this;
        if (this.validate('userPhone') && this.codeBtn.codeStatus) {
          this.codeBtn.codeStatus = false
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
          _this.hqsjyzm()
        }
      },
      hqsjyzm: function() {
        var _this = this;
        var apiurl = _this.$apiurl;

        uni.request({
          url: apiurl + "/sms/code",
          data: {
            mobile: this.userPhone,

          },
          method: 'POST',

          dataType: 'json',
          success: res => {
            if (res.data.code == 200) {
              console.log('获取验证码成功')
              uni.showToast({
                title: '获取验证码成功',
                icon: 'none'
              })
              this.smsCode = res.data.smsCode
              this.uuid = res.data.uuid
              uni.setStorageSync('uuid', this.uuid)
            } else {
              console.log(res.data.msg);
            }
          },
          fail: res2 => {
            console.log(res2);
          },
        });
      },
      login() {
        if (this.validate('userPhone') && this.validate('userPwdPhone')) {
          if (this.ty == 0) {
            uni.showToast({
              title: "请勾选条款",
              icon: 'none'
            })
            return;
          }
          var apiurl = this.$apiurl;

          uni.request({
            url: apiurl + "/sms/login",
            data: {
              mobile: this.userPhone,
              smsCode: this.userPwdPhone,
              uuid: this.uuid
            },
            method: 'POST',
            dataType: 'json',
            success: res => {
              if (res.data.code == 200) {
                uni.showToast({
                  title: '登录成功',
                  icon: 'none'
                })
                var token = res.data.token;
                uni.setStorageSync('token', token)
                uni.setStorageSync('tel', this.userPhone)
                uni.setStorageSync('username', this.userPhone)
                if (res.data.BindingState) {
                  setTimeout(() => {
                    uni.switchTab({
                      url: '/pages/index/index',
                    })
                  }, 2000)
                } else {
                  setTimeout(() => {
                    uni.redirectTo({
                      url: '/pages/index/info',
                    })
                  }, 2000)
                }
              } else {
                if (res.data.code == '500') {
                  uni.redirectTo({
                    url: '/pages/index/regist',
                  })
                }
              }
            },
            fail: res2 => {
              if (res.data.code == '500') {
                uni.redirectTo({
                  url: '/pages/index/regist',
                })
              }
            },
          });
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .xy {
    color: #4f544f;
    padding: 20rpx 0 20rpx 65rpx;
    margin-top: 80rpx;
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

  .wxBtn {
    background-color: transparent;
  }

  .wxBtn::after {
    border: none;
  }


  .wxLogo {
    margin: 20rpx auto;
    width: 100rpx;
    line-height: 135rpx;
    height: 100rpx;
    border-radius: 50%;
    background-color: #f8f8f8;

    image {
      width: 60rpx;
      height: 60rpx;
    }

  }

  .bg {
    width: 100%;
    height: 100vh;
  }

  .content {
    position: absolute;
    top: 34%;
    width: 83%;
    left: 8.5%;
    border-radius: 30rpx;
  }

  .content .tab {
    background: #fff;
    padding: 50rpx;
    border-radius: 30rpx;

    .titleCenter {
      text-align: center;
    }

    .loginText {
      font-size: 42rpx;
      font-weight: 700;
    }

    .welcome {
      font-size: 33rpx;
      margin: 40rpx 0;
    }
  }

  .content .tab .input-code {
    height: 90rpx;
    line-height: 90rpx;
    padding-left: 50rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f2f5fa;
    border-radius: 15rpx;
    font-size: 31rpx;
  }

  .content .title {
    height: 75rpx;
    line-height: 75rpx;
    background: rgba(255, 255, 255, 0.35);
    display: flex;
    width: 95%;
  }

  .text {
    font-size: 28rpx;
    color: #666666;
    opacity: 0.8;
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .text navigator {
    color: rgba(36, 165, 241, 1);
  }

  .content .title>text {
    flex: 1;
    font-size: 28rpx;
    color: #333333;
    opacity: 0.78;
    display: block;
    position: relative;
    text-align: center;
    border-radius: 24rpx 24rpx 24rpx 0;
    background: rgba(255, 255, 255, 0.35);
  }

  .content .title>text:nth-of-type(2) {
    border-radius: 0 24rpx 0 24rpx;
  }

  .content .title>text.active {
    color: #24A5F1;
    font-size: 32rpx;
    opacity: 1;
    background: rgba(255, 255, 255, 1);
  }

  .content .title>text.active i {
    width: 28rpx;
    height: 3rpx;
    background: #24A5F1;
    border-radius: 2rpx;
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -14rpx;
  }

  .phone-code {
    width: auto;
    padding: 0 15rpx;
    height: 60rpx;
    background: $uni-color-primary;
    color: #fff;
    border-radius: 20rpx;
    font-size: 21rpx;
    text-align: center;
    line-height: 60rpx;
    margin-right: 20rpx;
  }

  .btn1 {
    height: 80rpx;
    background: $uni-color-primary;
    margin: 30rpx 0;
    border-radius: 20rpx;
    font-size: 30rpx;
    line-height: 75rpx;
    color: #FFFFFF;
    text-align: center;
  }

  .switchLoginState {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20rpx;

    .icon {
      width: 100rpx;
      height: 100rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
