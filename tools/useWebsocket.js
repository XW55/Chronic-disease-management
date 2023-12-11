import Vue from 'vue';
import Store from '@/store/index.js';
import Socket from '@/tools/socket.js';

export function connectWebSocket(userid) {
  const socket = new Socket({
    url: `wss://chronic.mindyard.cn/ws/websocket/${userid}`,
    onOpen: (res) => {
      console.log('连接成功');
    },
    onClose: (res) => {
      console.log('关闭成功');
    },
    onReload: (res) => {
      console.log(`重连成功${res}`);
      uni.showToast({
        title: '聊天服务器连接成功',
        icon: 'none',
        duration: 2000,
      });
    },
    onMsg: (msg) => {
      console.log(`收到消息${msg}`);
      const data = JSON.parse(msg.data);
      console.log(data);
    },
    onError: (err) => {
      console.log(`错误${err}`);
      uni.showModal({
        title: '提示',
        content: '连接聊天服务器失败，是否尝试重连？',
        success(res) {
          if (res.confirm) {
            socket.reconnect();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
  });
  socket.eventPatch.onOpen((msg, sk) => {
    console.log('连接成功');
  });
  socket.eventPatch.onMsg((msg, sk) => {
    console.log('初始化时收到消息');
  });
  Vue.prototype.$socket = socket;
}
