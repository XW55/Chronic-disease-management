<template>
  <view class="page">
    <view class="top"></view>
    <!-- 手机号登录 -->
    <view v-if="!showCodeLogin">
      <view class="title">手机号登录</view>
      <button class="btn" v-if="show1" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号一键登录 </button>
      <button class="btn" v-else @click="tip">手机号一键登录 </button>
      <view class="btn" style="color: #00ca99; background-color: #b5ffed;" @click="showCodeLogin = true">其他手机号/账号登录
      </view>
    </view>

    <!-- 验证码登录 -->
    <view v-else>
      <view class="title">验证码登录</view>
      <view class="btn inputBox"> <text class="iconfont icon-shouji"></text> <input type="number" style="width: 90%;"
          placeholder="请输入手机号" v-model="userPhone" />
      </view>
      <view class="btn inputBox"> <text style="font-size: 45rpx;" class="iconfont icon-suozhu"></text> <input
          type="number" style="width: 380rpx;" placeholder="请输入验证码" v-model="userPwdPhone" /><text class="getCodeBtn"
          @click="getPhonecode">{{codeBtn.codeText}}</text> </view>
      <button class="btn" @click="login">登录 </button>
    </view>
    <!-- 隐私协议 -->
    <view class="xy">
      <checkbox-group @change="checkboxChange">
        <checkbox value="1" style="transform:scale(1);transform-origin: left center; margin-left: 70rpx;" />
        <view>我已阅读并同意
          <navigator url="../xy/xy" style="color: #00ca99">
            《服务协议》</navigator>
          与<navigator url="../ys/ys" style="color: #00ca99">
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
      // this.getuserNew();
      if (res.flag) {
        uni.showToast({
          title: '请先登录',
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

<style>
  page {
    background-color: #fff;
  }
</style>
<style lang="scss" scoped>
  .top {
    width: 100%;
    height: 220rpx;
  }

  .iconfont {
    margin-left: 30rpx;
    color: #00ca99;
    font-size: 40rpx;
  }

  .title {
    font-size: 52rpx;
    color: #00ca99;
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
    background-color: #00ca99;
    margin: 30rpx auto;
    border-radius: 40rpx;
    font-size: 32rpx;
    line-height: 90rpx;
    color: #FFFFFF;
    text-align: center;
  }

  .inputBox {
    border: 1rpx solid #00ca99;
    background-color: transparent;
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
      border-radius: 40rpx;
      background-color: #00ca99;
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