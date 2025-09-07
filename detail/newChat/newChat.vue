<template>
  <view class="chat-container">
    <!-- 聊天内容区域 -->
    <scroll-view @click="showExtra = false" class="messages-box" scroll-y :scroll-into-view="scrollToView" :scroll-with-animation="true">
      <view v-for="(msg, index) in messageList" :key="index" :id="'msg-' + index">
        <!-- 时间提示 -->
        <view class="time-tip">{{ msg.time }}</view>

        <!-- 我的消息（右） -->
        <view v-if="msg.type === 'my'" class="message-item my">
          <view class="bubble bubble-my">{{ msg.content }}</view>
          <view class="avatar">
            <image src="https://cdn.uviewui.com/uview/album/1.jpg" mode="aspectFill"></image>
          </view>
        </view>

        <!-- 对方消息（左） -->
        <view v-else class="message-item other">
          <view class="avatar">
            <image src="https://cdn.uviewui.com/uview/album/1.jpg" mode="aspectFill"></image>
          </view>
          <view class="bubble bubble-other">{{ msg.content }}</view>
        </view>
      </view>
      <!-- 空白占位，用于滚动到底部 -->
      <!-- <view style="height: 50px"></view> -->
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="input-area">
      <!-- 输入框 + 按钮 -->
      <view class="input-box">
        <!--        <view class="btn-plus" >
          <text>+</text>
        </view> -->
        <!-- <u-input class="input-field" v-model="inputMessage" @confirm="sendMessage" placeholder="请输入消息" @focus="onFocus" /> -->
        <u--textarea autoHeight v-model="inputMessage" :cursorSpacing="50" @confirm="sendMessage" @focus="onFocus" placeholder="请输入消息"></u--textarea>
        <u-transition :show="inputMessage != ''">
          <view class="btn-send" v-show="inputMessage != ''">
            <u-button type="primary" @click="sendMessage">发送</u-button>
          </view>
        </u-transition>
        <u-transition :show="inputMessage == ''">
          <u-icon v-show="inputMessage == ''" @click="toggleExtra" style="margin-left: 20rpx" name="plus-circle"></u-icon>
        </u-transition>
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
          <view class="extra-item" @click="sendLocation">
            <image src="/static/video-call.png"></image>
            <text>视频</text>
          </view>
        </view>
      </u-transition>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inputMessage: '', // 输入框内容
      showExtra: false, // 是否显示功能扩展
      messageList: [
        { time: '今天', type: 'other', content: '你好，今天过得怎么样？', time: '18:30' },
        { type: 'my', content: '挺好的，谢谢！你在忙吗？' },
        { type: 'other', content: '刚开完会，有点累 😩' },
      ],
      nextId: 3, // 消息 ID 计数器（用于 scroll-into-view）
    }
  },
  computed: {
    // 滚动到最新消息
    scrollToView() {
      return 'msg-' + (this.messageList.length - 1)
    },
  },
  methods: {
    onFocus() {
      this.showExtra = false // 输入框聚焦时隐藏扩展
    },
    toggleExtra() {
      this.showExtra = !this.showExtra
    },
    sendMessage() {
      if (!this.inputMessage.trim()) return

      this.messageList.push({
        type: 'my',
        content: this.inputMessage,
      })

      this.inputMessage = ''
      this.showExtra = false

      // 模拟对方回复（可选）
      setTimeout(() => {
        this.messageList.push({
          type: 'other',
          content: '收到，稍后回复你~',
        })
      }, 1000)
    },
    // 以下为扩展功能（仅演示）
    sendImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.messageList.push({
            type: 'my',
            content: '[图片]',
          })
        },
      })
    },
    sendVoice() {
      uni.showToast({ title: '语音发送', icon: 'none' })
    },
    sendLocation() {
      uni.getLocation({
        success: () => {
          this.messageList.push({
            type: 'my',
            content: '[位置]',
          })
        },
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
}

/* 消息列表 */
.messages-box {
  flex: 1;
  padding: 20rpx 0;
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
  margin-right: 20rpx;
}

.message-item .avatar image {
  width: 100%;
  height: 100%;
}

.bubble {
  max-width: 70%;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.5;
}

.bubble-my {
  background-color: #07c160;
  color: white;
  margin-right: 20rpx;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: -10rpx;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 15rpx solid transparent;
    border-left: 15rpx solid #07c160;
    border-bottom: 15rpx solid transparent;
  }
}

.bubble-other {
  background-color: white;
  color: #333;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -10rpx;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 15rpx solid transparent;
    border-right: 15rpx solid #fff;
    border-bottom: 15rpx solid transparent;
  }
}

/* 我的消息靠右 */
.my {
  justify-content: flex-end;
}

.my .bubble {
  margin-left: 20rpx;
}

/* 对方消息靠左 */
.other {
  justify-content: flex-start;
}

.other .bubble {
  margin-right: 20rpx;
}

/* 底部输入区 */
.input-area {
  background-color: #f7f7f7;
  border-top: 1rpx solid #d5d5d5;
  padding-bottom: env(safe-area-inset-bottom);
  // padding-bottom: 40rpx;
  // position: fixed;
  // bottom: 0;
}

/* 功能扩展区 */
.extra-box {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  background-color: #efefef;
  border-top: 1px solid #ddd;
}

.extra-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;
}

.extra-item image {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
}

.extra-item text {
  font-size: 14px;
  color: #333;
}

/* 输入框区域 */
.input-box {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #f5f5f5;
}

.btn-plus {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #666;
  margin-right: 10px;
}

.btn-send {
  margin-left: 20rpx;
}
</style>
