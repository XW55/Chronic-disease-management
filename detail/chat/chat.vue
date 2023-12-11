<template>
  <view>
    <view class="tips color_fff size_12 align_c" :class="{ 'show':ajax.loading }" @tap="getHistoryMsg">
      {{ ajax.loadText }}
    </view>
    <view class="box-1" id="list-box">
      <view class="talk-list">
        <view v-for="(item,index) in talkList" :key="index" :id="`msg-${item.id}`">
          <view class="item flex_col" :class=" item.sender == doctorId || item.senderId == doctorId ? 'pull':'push' ">
            <image :src="pic" mode="aspectFill" class="pic"></image>
            <uni-icons :type=" item.sender == doctorId || item.senderId == doctorId ? 'contact-filled':'contact'"
              size="92rpx"></uni-icons>
            <view class="content">{{ item.content }}</view>
          </view>
        </view>
      </view>
    </view>

    <view :style="{height:safeHeight}+'px'"></view>

    <view class="box-2">
      <view class="flex_col">
        <view class="flex_grow">
          <input type="text" class="content" v-model="content" placeholder="请输入聊天内容" placeholder-style="color:#DDD;"
            :cursor-spacing="6">
        </view>
        <button class="send" @tap="send">发送</button>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from "vuex";
  import {
    getChatHis,
    updateChatStatus
  } from '@/request/request.js'
  export default {
    data() {
      return {
        pic: 'https://cdn.uviewui.com/uview/album/1.jpg',
        doctorId: '',
        id: '',
        safeHeight: 0,
        time: '',
        name: "",
        // 消息已读状态
        chatStatus: '',
        talkList: [],
        pageSize: 20,
        pageNum: 1,
        ajax: {
          rows: 20, //每页数量
          page: 1, //页码
          flag: true, // 请求开关
          loading: true, // 加载中
          loadText: '正在获取消息'
        },
        content: '',
        patientList: []
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getHistoryMsg();
      });
    },
    onPageScroll(e) {
      if (e.scrollTop < 5) {
        this.getHistoryMsg();
      }
    },
    computed: {
      ...mapState('chatStore', ['msgList'])
    },
    methods: {
      //引入SETMSGLIST方法,重命名为setMsgList
      ...mapMutations({
        setMsgList: 'chatStore/SETMSGLIST'
      }),
      // 获取历史消息
      getHistoryMsg() {
        if (!this.ajax.flag) {
          return; //
        }
        let date = new Date()
        // yyyy-MM-dd HH:mm:ss,月日时分秒小于10时前面补0
        let time = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) :
            date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
          ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' +
          (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
          (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
        let get = async () => {
          this.ajax.flag = false;
          let res = await getChatHis({
            senderId: this.id,
            receiverId: this.doctorId
          })
          console.log("请求来的东西")
          console.log(res)
          this.hideLoadTips();
          if (res.rows.length == 0) {
            this.hideLoadTips(true);
            return
          }
          // 获取待滚动元素选择器，解决插入数据后，滚动条定位时使用
          let selector = '';
          let data = res.rows.reverse()
          if (this.ajax.page > 1) {
            // 非第一页，则取历史消息数据的第一条信息元素
            selector = `#msg-${this.talkList[0].id}`;
          } else {
            // 第一页，则取当前消息数据的最后一条信息元素
            selector = `#msg-${data[data.length - 1].id}`;
          }
          this.talkList = [...data, ...this.talkList];

          this.$nextTick(() => {
            // 设置当前滚动的位置
            this.setPageScrollTo(selector);
            this.hideLoadTips(true);

            if (data.length < this.ajax.rows) {
              // 当前消息数据条数小于请求要求条数时，则无更多消息，不再允许请求。
              // 可在此处编写无更多消息数据时的逻辑
            } else {
              this.ajax.page++;

              setTimeout(() => {
                this.ajax.flag = true;
              }, 200)
            }

          })
        }
        get();
      },
      // 设置页面滚动位置
      setPageScrollTo(selector) {
        let view = uni.createSelectorQuery().in(this).select(selector);
        view.boundingClientRect((res) => {
          uni.pageScrollTo({
            scrollTop: res.top - 30, // -30 为多显示出大半个消息的高度，示意上面还有信息。
            duration: 0
          });
        }).exec();
      },
      // 隐藏加载提示
      hideLoadTips(flag) {
        if (flag) {
          this.ajax.loadText = '消息获取成功';
          setTimeout(() => {
            this.ajax.loading = false;
          }, 300);
        } else {
          this.ajax.loading = true;
          this.ajax.loadText = '正在获取消息';
        }
      },
      // 发送信息
      send() {
        if (!this.content) {
          uni.showToast({
            title: '请输入有效的内容',
            icon: 'none'
          })
          return;
        }
        uni.hideLoading()
        let msg = {
          content: this.content,
          serverId: this.doctorId,
          senderId: this.id,
          messageType: "0",
          patientId: this.id,
          doctorId: this.doctorId
        }
        console.log(msg);
        this.$socket.nsend(JSON.stringify(msg));

        this.talkList.push(msg);
        //
        this.$nextTick(() => {
          this.content = '';
          uni.pageScrollTo({
            scrollTop: 999999, // 设置一个超大值，以保证滚动条滚动到底部
            duration: 0
          });
        })
      },
      // 更改已读消息
      async updateStatus() {
        const res = await updateChatStatus({
          senderId: this.doctorId,
          receiverId: this.id
        })
        console.log('更改已读消息', res);
      },
      reviseTitle(name) {
        uni.setNavigationBarTitle({
          title: name
        })
      },
      getMsg(msg, sk) {
        console.log('在对话中收到消息')
        console.log(msg)
        msg = JSON.parse(msg.data)
        if (msg.senderId == this.id) {
          this.talkList.push({
            "id": new Date().getTime(), // 消息的ID
            "content": msg.content, // 消息内容
            "type": 0, // 此为消息类别，设 1 为发出去的消息，0 为收到对方的消息,
            // "pic": "/static/logo.png" // 头像
          })
          this.$nextTick(() => {
            uni.pageScrollTo({
              scrollTop: 999999, // 设置一个超大值，以保证滚动条滚动到底部
              duration: 0
            });
          })
        }
      }
    },
    onLoad(options) {
      this.doctorId = options.id
      this.name = options.name
      this.reviseTitle(this.name);
      this.id = uni.getStorageSync('userid');
      this.$socket.eventPatch.onMsg(this.getMsg)
      let info = uni.getSystemInfoSync()
      this.safeHeight = info.safeAreaInsets.bottom
      //设置苹果系统底部黑条安全区高度
      // 如果未读请求更改已读数据
      console.log(options.status);
      if (options.status == 1) {
        console.log('未读请求更改已读数据');
        this.updateStatus()
      }
    },
    onShow() {
      if (this.msgList) {
        let msgList = JSON.parse(JSON.stringify(this.msgList))
        msgList[this.id].isRead = true
        this.setMsgList(msgList)
        uni.setStorageSync('msgList', msgList)
      }
    },
    onUnload() {
      if (this.msgList) {
        try {
          let msgList = JSON.parse(JSON.stringify(this.msgList))
          msgList[this.id].isRead = true
          console.log(msgList)
          this.setMsgList(msgList)
          uni.setStorageSync('msgList', msgList)
        } catch (e) {
          console.log(e)
        }
      }
      this.$socket.eventPatch.clearEvent("onMsg", this.getMsg)
    },
  }
</script>
<style>
  page {
    background-color: #F3F3F3;
    font-size: 28rpx;
  }
</style>
<style lang="scss" scoped>
  @import "../../detail/global.scss";

  /* 加载数据提示 */
  .tips {
    position: fixed;
    left: 0;
    top: var(--window-top);
    width: 100%;
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.15);
    height: 72rpx;
    line-height: 72rpx;
    transform: translateY(-80rpx);
    transition: transform 0.3s ease-in-out 0s;

    &.show {
      transform: translateY(0);
    }
  }

  .box-1 {
    width: 100%;
    height: auto;
    padding-bottom: 50px;
    box-sizing: content-box;

    /* 兼容iPhoneX */
    margin-bottom: 0;
    margin-bottom: calc(constant(safe-area-inset-bottom) + 50px);
    margin-bottom: calc(env(safe-area-inset-bottom) + 50px)
  }

  .box-2 {
    position: fixed;
    left: 0;
    width: 100%;
    bottom: 0;
    height: auto;
    z-index: 2;
    border-top: #e5e5e5 solid 1px;
    box-sizing: content-box;
    background-color: #F3F3F3;

    /* 兼容iPhoneX */
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    >view {
      padding: 0 20rpx;
      height: 100rpx;
    }

    .content {
      background-color: #fff;
      height: 64rpx;
      padding: 0 20rpx;
      border-radius: 32rpx;
      font-size: 28rpx;
    }

    .send {
      background-color: #42b983;
      color: #fff;
      height: 64rpx;
      margin-left: 20rpx;
      border-radius: 32rpx;
      padding: 0;
      width: 120rpx;
      line-height: 62rpx;

      &:active {
        background-color: #5fc496;
      }
    }
  }

  .talk-list {
    padding-bottom: 50px;

    /* 消息项，基础类 */
    .item {
      padding: 20rpx 20rpx 0 20rpx;
      align-items: flex-start;
      align-content: flex-start;
      color: #333;

      .pic {
        width: 92rpx;
        height: 92rpx;
        border-radius: 50%;
        border: #fff solid 1px;
      }

      .content {
        padding: 20rpx;
        border-radius: 4px;
        max-width: 500rpx;
        word-break: break-all;
        line-height: 52rpx;
        position: relative;
      }

      /* 收到的消息 */
      &.pull {
        .content {
          margin-left: 32rpx;
          background-color: #fff;

          &::after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-top: 16rpx solid transparent;
            border-bottom: 16rpx solid transparent;
            border-right: 20rpx solid #fff;
            position: absolute;
            top: 30rpx;
            left: -18rpx;
          }
        }
      }

      /* 发出的消息 */
      &.push {
        /* 主轴为水平方向，起点在右端。使不修改DOM结构，也能改变元素排列顺序 */
        flex-direction: row-reverse;

        .content {
          margin-right: 32rpx;
          background-color: #a0e959;

          &::after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-top: 16rpx solid transparent;
            border-bottom: 16rpx solid transparent;
            border-left: 20rpx solid #a0e959;
            position: absolute;
            top: 30rpx;
            right: -18rpx;
          }
        }
      }
    }
  }
</style>