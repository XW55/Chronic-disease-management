<template>
  <view class="chat-container">
    <!-- 聊天内容区域 -->
    <scroll-view @click="closeExtra" class="messages-box" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true" :style="{ height: scrollViewHeight + 'px' }">
      <view class="official-content">
        <view v-for="(msg, index) in messageList" :key="index" :id="'msg-' + index">
          <!-- 时间提示 -->
          <view v-if="msg.showTime" class="time-tip">{{ msg.time }}</view>

          <!-- 我的消息（右） -->
          <view v-if="msg.type === 'my'" class="message-item my">
            <view class="bubble bubble-my">
              <text v-if="msg.contentType === 'text'">{{ msg.content }}</text>
              <image v-else-if="msg.contentType === 'image'" :src="msg.content" mode="widthFix" class="msg-image"></image>
            </view>
            <view class="avatar">
              <image src="/static/my-active.png" mode="aspectFill"></image>
            </view>
          </view>

          <!-- 对方消息（左） -->
          <view v-else class="message-item other">
            <view class="avatar">
              <image src="/static/my-active.png" mode="aspectFill"></image>
            </view>
            <view class="bubble bubble-other">
              <text v-if="msg.contentType === 'text'">{{ msg.content }}</text>
              <image v-else-if="msg.contentType === 'image'" :src="msg.content" mode="widthFix" class="msg-image"></image>
            </view>
          </view>
        </view>
        <u-gap height="20"></u-gap>
      </view>
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="input-area" :style="{ bottom: keyboardHeight + 'px' }">
      <!-- 输入框 + 按钮 -->
      <view class="input-box">
        <u--textarea v-model="inputMessage" :cursorSpacing="50" :autoHeight="true" @confirm="sendMessage" @focus="onFocus" placeholder="请输入消息" :adjustPosition="false"></u--textarea>

        <view class="btn-send" v-if="inputMessage">
          <u-button type="primary" @click="sendMessage">发送</u-button>
        </view>

        <view class="btn-plus" v-else>
          <u-icon @click="toggleExtra" name="plus-circle" size="26"></u-icon>
        </view>
      </view>

      <!-- 功能扩展区 -->
      <u-transition :show="showExtra" mode="fade-up">
        <view v-show="showExtra" class="extra-box">
          <view class="extra-item" @click="sendImage">
            <image src="/static/photo.png"></image>
            <text>图片</text>
          </view>
          <view class="extra-item" @click="sendVoice">
            <image src="/static/phone.png"></image>
            <text>语音</text>
          </view>
          <view class="extra-item" @click="VideoCall">
            <image src="/static/video-call.png"></image>
            <text>视频</text>
          </view>
          <view class="extra-item" @click="sendFile">
            <image src="/static/file.png"></image>
            <text>文件</text>
          </view>
        </view>
      </u-transition>
    </view>
  </view>
</template>

<script>
let doctorInfo = {}
let systemInfo = null
export default {
  data() {
    return {
      inputMessage: '', // 输入框内容
      showExtra: false, // 是否显示功能扩展
      keyboardHeight: 0, // 键盘高度
      scrollViewHeight: 0, // 滚动区域高度
      messageList: [
        {
          time: '18:30',
          showTime: true,
          type: 'other',
          contentType: 'text',
          content: '你好，今天过得怎么样？',
        },
        {
          type: 'my',
          contentType: 'text',
          content: '挺好的，谢谢！你在忙吗？',
        },
        {
          type: 'other',
          contentType: 'text',
          content: '刚开完会，有点累 😩',
        },
        {
          time: '18:30',
          showTime: true,
          type: 'other',
          contentType: 'text',
          content: '你好，今天过得怎么样？',
        },
        {
          type: 'my',
          contentType: 'text',
          content: '挺好的，谢谢！你在忙吗？',
        },
        {
          type: 'other',
          contentType: 'text',
          content: '刚开完会，有点累 😩',
        },
        {
          time: '18:30',
          showTime: true,
          type: 'other',
          contentType: 'text',
          content: '你好，今天过得怎么样？',
        },
        {
          type: 'my',
          contentType: 'text',
          content: '挺好的，谢谢！你在忙吗？',
        },
        {
          type: 'other',
          contentType: 'text',
          content: '刚开完会，有点累 😩',
        },
        {
          time: '18:30',
          showTime: true,
          type: 'other',
          contentType: 'text',
          content: '你好，今天过得怎么样？',
        },
        {
          type: 'my',
          contentType: 'text',
          content: '挺好的，谢谢！你在忙吗？',
        },
        {
          type: 'other',
          contentType: 'text',
          content: '刚开完会，有点累 😩',
        },
      ],
      scrollTop: 0, //滚动条位置
      invitee: {
        userID: '',
      },
      config: {
        sdkAppID: '',
        userID: '',
        userSig: '',
        type: 1, // 语音通话(callMediaType = 1)、视频通话(callMediaType = 2)
      },
    }
  },
  onReady() {
    uni.setNavigationBarTitle({
      title: doctorInfo.doctorName,
    })
  },
  onLoad(option) {
    this.initCallKit()
    systemInfo = uni.getSystemInfoSync()
    doctorInfo = JSON.parse(option.doctorInfo)
    // this.invitee.userID = doctorInfo.patientId + ''
    this.invitee.userID = '10004023718'
    // 查询 push 信息
    // this.searchUser()
    console.log('聊天对象', doctorInfo)
    this.calculateScrollViewHeight()
    // 监听键盘高度变化
    uni.onKeyboardHeightChange((res) => {
      this.keyboardHeight = res.height
      if (res.height > 0) {
        this.scrollViewHeight = systemInfo.windowHeight - res.height - 60
        // console.log('滚动区域', this.scrollViewHeight)
        this.showExtra = false
      } else {
        // 键盘收起时恢复滚动区域高度
        this.calculateScrollViewHeight()
      }
    })
  },
  watch: {
    messageList() {
      this.scrollToBottom()
    },
    scrollViewHeight() {
      setTimeout(() => {
        this.scrollToBottom()
      }, 400)
    },
    showExtra() {
      this.$nextTick(() => {
        setTimeout(() => {
          uni
            .createSelectorQuery()
            .in(this)
            .select('.input-area')
            .boundingClientRect((data) => {
              if (data) {
                this.scrollViewHeight = systemInfo.windowHeight - data.height
              }
            })
            .exec()
        }, 100)
      })
    },
  },
  methods: {
    initCallKit() {
      this.config = {
        sdkAppID: getApp().globalData.SDKAppID,
        userID: getApp().globalData.userID,
        userSig: getApp().globalData.userSig,
      }
      console.log(this.config)
    },
    calculateScrollViewHeight() {
      // 计算滚动区域高度（窗口高度 - 输入区域高度 - 状态栏高度等）
      this.scrollViewHeight = systemInfo.windowHeight - 60
      // console.log('滚动区域', this.scrollViewHeight)
    },
    scrollToBottom() {
      // console.log('触发滚动底部')
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .in(this)
          .select('.official-content')
          .boundingClientRect((data) => {
            if (data) {
              let top = data.height + 10 - this.scrollViewHeight
              if (top > 0) {
                this.scrollTop = top
              }
            }
          })
          .exec()
      })
    },
    closeExtra() {
      this.showExtra = false
    },
    onFocus() {
      this.showExtra = false // 输入框聚焦时隐藏扩展
    },
    toggleExtra() {
      this.showExtra = !this.showExtra
      if (this.showExtra) {
        // 展开扩展区域时隐藏键盘
        uni.hideKeyboard()
      }
    },
    sendMessage() {
      if (!this.inputMessage.trim()) return

      this.messageList.push({
        type: 'my',
        contentType: 'text',
        content: this.inputMessage,
      })

      this.inputMessage = ''
      this.showExtra = false

      // 模拟对方回复（可选）
      setTimeout(() => {
        this.messageList.push({
          type: 'other',
          contentType: 'text',
          content: '收到，稍后回复你~',
        })
      }, 1000)
    },
    // 发送图片
    sendImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.messageList.push({
            type: 'my',
            contentType: 'image',
            content: res.tempFilePaths[0],
          })
          this.showExtra = false
        },
      })
    },
    sendVoice() {
      this.config.type = 1
      this.call()
      this.showExtra = false
    },
    VideoCall() {
      this.config.type = 2
      this.call()
      this.showExtra = false
    },
    sendFile() {
      uni.chooseMessageFile({
        count: 1,
        type: 'all',
        success: (res) => {
          this.messageList.push({
            type: 'my',
            contentType: 'text',
            content: '[文件]',
          })
          this.showExtra = false
        },
      })
    },
    searchUser() {
      // 去掉前后空格
      const newSearch = this.invitee.userID.trim()
      uni.$TUIKit
        .getUserProfile({
          userIDList: [newSearch],
        })
        .then((imResponse) => {
          console.log('搜索到的', imResponse)
          if (imResponse.data.length === 0) {
            uni.showToast({
              title: this.$t('User not found'),
              icon: 'none',
            })
            return
          }
          this.invitee = {
            ...imResponse.data[0],
          }
        })
    },
    call() {
      if (this.config.userID === this.invitee.userID) {
        uni.showToast({
          icon: 'none',
          title: this.$t('Do not call local'),
        })
        return
      }
      try {
        // type：通话的媒体类型，比如：语音通话(callMediaType = 1)、视频通话(callMediaType = 2)
        const callParams = {
          userIDList: [this.invitee.userID],
          callMediaType: this.config.type,
        }
        console.log('--> ', JSON.stringify(callParams))
        uni.$TUICallKit.calls(callParams, (res) => {
          console.log(JSON.stringify(res))
        })
      } catch (error) {
        uni.showToast({
          title: this.$t('call failure'),
          icon: 'none',
        })
      }
    },
    // 手动挂断
    handleHangup() {
      uni.$TUICallEngine.hangup()
    },
    // 设置渲染模式参数
    handleSetVideoRenderParams() {
      const params = {
        userID: this.config.userID,
        fillMode: 0, // 0-填充模式，1一适应模式
        rotation: 1, // 0~3分别对应值：Rotation_0, Rotation_90, Rotation_180, Rotation_270;
      }
      uni.$TUICallEngine.setVideoRenderParams(params, (res) => {
        console.warn('渲染设置回调 = ', JSON.stringify(res))
      })
    },
    // 设置采集参数
    handleSetVideoEncoderParams() {
      const params = {
        resolution: 110,
        resolutionMode: 0, // 0-Landscape(横屏)，1一Portrait(竖屏)
      }
      uni.$TUICallEngine.setVideoEncoderParams(params, (res) => {
        console.warn('采集参数回调 = ', JSON.stringify(res))
      })
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .u-icon__icon span {
  font-size: 60rpx;
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ededed;
  position: relative;
}

/* 消息列表 */
.messages-box {
  overflow: hidden;
  transition: height 0.3s ease;
}

.time-tip {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin: 20rpx 0;
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 16rpx 30rpx;
}

.message-item .avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  overflow: hidden;
  flex-shrink: 0;
}

.message-item .avatar image {
  width: 100%;
  height: 100%;
}

.bubble {
  max-width: 70%;
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 32rpx;
  word-break: break-all;
  line-height: 1.5;
}

.msg-image {
  max-width: 300rpx;
  border-radius: 8rpx;
}

.bubble-my {
  background-color: #07c160;
  color: white;
  margin-right: 20rpx;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -16rpx;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 16rpx solid transparent;
    border-left: 16rpx solid #07c160;
    border-bottom: 16rpx solid transparent;
  }
}

.bubble-other {
  background-color: white;
  color: #333;
  margin-left: 20rpx;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -16rpx;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 16rpx solid transparent;
    border-right: 16rpx solid #fff;
    border-bottom: 16rpx solid transparent;
  }
}

/* 我的消息靠右 */
.my {
  justify-content: flex-end;
}

/* 对方消息靠左 */
.other {
  justify-content: flex-start;
}

/* 底部输入区 */
.input-area {
  background-color: #f7f7f7;
  border-top: 1rpx solid #d5d5d5;
  padding: 20rpx;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  transition: bottom 0.3s ease;
  z-index: 10;
}

/* 功能扩展区 */
.extra-box {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 0;
  background-color: #fff;
  // border-top: 1rpx solid #ddd;
  margin-top: 20rpx;
}

.extra-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;
}

.extra-item image {
  background-color: #f2f4f6;
  padding: 20rpx;
  border-radius: 20rpx;
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
}

.extra-item text {
  font-size: 24rpx;
  color: #333;
}

/* 输入框区域 */
.input-box {
  display: flex;
  align-items: center;
}

.btn-plus {
  margin-left: 20rpx;
}

.btn-send {
  margin-left: 20rpx;
}
</style>
