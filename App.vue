<script>
import { getUserInfoByCode } from '@/request/request.js'
import TIM from '@tencentcloud/chat'
import { genTestUserSig } from './debug/GenerateTestUserSig.js'

// 首先需要通过 uni.requireNativePlugin("ModuleName") 获取 module
const TUICallKit = uni.requireNativePlugin('TencentCloud-TUICallKit')
console.error(TUICallKit, 'TencentCloud-TUICallKit ｜ ok')
const TUICallKitEvent = uni.requireNativePlugin('globalEvent')
const TUICallEngine = uni.requireNativePlugin('TencentCloud-TUICallKit-TUICallEngine')
export default {
  globalData: {
    SDKAppID: genTestUserSig('').sdkAppID,
    userID: '',
    userSig: '',
  },
  async onLaunch() {
    uni.$TUIKit = TIM.create({
      SDKAppID: this.globalData.SDKAppID,
    })
    // 将原生插件挂载在 uni 上
    uni.$TUICallKit = TUICallKit
    uni.$TUICallKitEvent = TUICallKitEvent
    uni.$TUICallEngine = TUICallEngine
    // const res = await getUserInfoByCode()
    // if (res && Object.keys(res).length) {
    //   this.$store.commit('user/SET_USERINFO', res)
    // }
    this.loginHandler()
  },
  methods: {
    loginHandler(res) {
      const userID = 'xw555'
      const userSig = genTestUserSig(userID).userSig
      const sdkAppId = genTestUserSig('').sdkAppID

      uni.$TUICallKit.login(
        {
          SDKAppID: sdkAppId,
          userID: userID,
          userSig: userSig,
        },
        (res) => {
          if (res.code === 0) {
            // 开启悬浮窗
            uni.$TUICallKit.enableFloatWindow(true)
            // 开启虚拟背景
            uni.$TUICallKit.enableVirtualBackground(true)
            // 屏幕旋转 0-Portrait, 1-LandScape, 2-Auto;   default value: 0
            uni.$TUICallKit.setScreenOrientation(2)
            console.log('---------------聊天登录成功-----------------')
            uni.showToast({
              title: 'login success',
              icon: 'none',
            })
          } else {
            console.error('login failed, failed message = ', res.msg)
          }
        }
      )

      uni.$TUIKit.login({ userID, userSig })

      this.globalData.userID = userID
      this.globalData.userSig = userSig
    },
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  },
}
</script>

<style lang="scss">
@import '@/node_modules/uview-ui/index.scss';
@import url(@/iconfont/iconfont.css);

page {
  background-color: #f2f4f6;
  /*每个页面公共css */
  padding-bottom: constant(safe-area-inset-bottom);
  /* 兼容旧版iOS */
  padding-bottom: calc(env(safe-area-inset-bottom));
  font-size: 30rpx;
}

// uniapp 按钮样式穿透
::v-deep .u-button__text {
  font-size: 35rpx !important;
}

.w95 {
  width: 95%;
}

.f38 {
  font-size: 38rpx;
}

.fNormal {
  font-size: 30rpx;
}

::v-deep .u-picker__view__column__item {
  line-height: 68rpx !important;
}

/*每个页面公共css */
.card {
  box-shadow: 0rpx 0rpx 5rpx rgba(0, 0, 0, 0.2);
  background-color: #fff;
  border-radius: 20rpx;
}

.boxSing {
  box-sizing: border-box;
}

.m20 {
  margin: 20rpx auto;
}

.p20 {
  padding: 20rpx;
}

::v-deep .u-icon__icon {
  font-size: 38rpx !important;
}

.flexBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
