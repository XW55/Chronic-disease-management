const noop = () => {
};
//导出一个class
class Socket {
  static stopTime = 0;
  static concatCount = 0;

  constructor({
                url = '',
                onOpen = noop,
                onMsg = noop,
                onClose = noop,
                onError = noop,
                onReload = noop,
                onRdFinsh = noop,
                maxInterValCount = 10,
                interValTime = 2000,
                SocketState = {},
                ...args
              } = {}) {
    this.isRconnectIng = false;//是否处于重连状态
    this.waitTime = Promise.resolve(false);//心跳检测使用异步使得处于重连之后
    this.waitDep = [];//等待队列收集依赖容器
    this.SocketTask = {
      nsend: noop,
      nclose: noop,
      nrconnect: noop,
      isConnect: false,
      uniColse: noop,
      maxInterValCount,
      interValTime,
      eventPatch: null,
      url,
      onOpen,
      onMsg,
      onClose,
      onError,
      onReload,
      onRdFinsh,
      extra: args
    };
    this._EventDispath(this.SocketTask);
    this.initChat(this.SocketTask, this.SocketTask.extra);
    return this.SocketTask;
  }

  set CONCATCOUNT(val) {
    Socket.concatCount = val;
    if (Val > 0) this._notify();
  }

  get CONCATCOUNT() {
    return Socket.concatCount;
  }

  //通知依赖
  _notify() {
    for (let i = 0; i < this.waitDep.length; i++) {
      this.waitDep[i].call(this.SocketTask);
    }
    this.waitDep = [];
  }

  //收集依赖
  _chunkConnect(fn) {
    if (Socket.concatCount > 0) {
      fn()
    } else {
      this.waitDep.push(fn);
    }
  }

  //事件注册
  _EventDispath({
                  onReload
                } = {}) {
    let SocketTask = this.SocketTask;
    let events = {
      onOpen: [],
      onMsg: [],
      onClose: [],
      onError: [],
      onReload: [],
      onRdFinsh: []
    }
    SocketTask.nsend = (data) => {
      this._chunkConnect(() => {
        console.log('发送消息')
        console.log(data)
        uni.sendSocketMessage({
          data: data,
          success: res => {
            console.log("socket消息发送成功")
          },
          fail: err => {
            console.log("socket消息发送失败")
            console.log(err)
          }
        })
      })
    }
    SocketTask.nclose = t => {
      this._chunkConnect(() => {
        SocketTask.uniColse = true;
        uni.closeSocket();
      })
    }
    SocketTask.nrconnect = t => {
      this._chunkConnect(() => {
        this.waiting = new Promise(async (resolve) => {
          uni.closeSocket();
          let reloadStatus = false;
          try {
            const res = await this.initChat(SocketTask, SocketTask.extra);
            reloadStatus = res;
          } catch (e) {
          }
          onReload.call(SocketTask, reloadStatus, SocketTask);
          SocketTask.eventPatch.dispatchEvent('onReload', reloadStatus);
          resolve(reloadStatus);
        })
      })
    }

    function EventDispatcher() {
      this.events = events;
    }

    for (let key in events) {
      EventDispatcher.prototype[key] = function (handler) {
        if (typeof handler != 'function') return
        this.events[key].push(handler);
      }
    }
    EventDispatcher.prototype.dispatchEvent = function (type, msg) {
      let evenArr = this.events[type];
      if (evenArr.length > 0) {
        for (let i = 0; i < evenArr.length; i++) {
          evenArr[i].call(SocketTask, msg, SocketTask);
        }
      }
    }
    EventDispatcher.prototype.clearEvent = function(type,handler){
      let eventArr = this.events[type];
      if(eventArr.length > 0){
        let index = eventArr.indexOf(handler);
        if(index > -1){
          eventArr.splice(index,1);
        }
      }
    }
    SocketTask.eventPatch = new EventDispatcher();
  }

  /**
   * 心跳检测
   */
  async hbDetection() {
    const SocketTask = this.SocketTask;
    if (SocketTask.uniColse) return false;
    clearTimeout(Socket.stopTime);

    if (!SocketTask.isconnect) { //未连接则启动连接
      if (SocketTask.maxInterValCount > SocketTask.InterValCount) {
        Socket.stopTime = setTimeout(async () => {
          try {
            const R_result = await this.waiting;
            if (R_result) return;
            this.isRconnectIng = true;
            const openResult = await this.initChat(SocketTask, SocketTask.extra);
            if (openResult) return;
            SocketTask.InterValCount++;
            return this.hbDetection();
          } catch (e) {
            return this.hbDetection();
          }
        }, SocketTask.interValTime)
      } else {
        SocketTask.onRdFinsh.call(SocketTask, SocketTask.maxInterValCount, SocketTask);
        SocketTask.eventPatch.dispatchEvent('onRdFinsh', SocketTask.maxInterValCount);
      }
    }

  }

  /**
   * ws监听事件
   */
  SocketEvents({
                 onOpen,
                 onMsg,
                 onClose,
                 onError,
                 onReload
               } = {}) {
    return new Promise((resolve, reject) => {
      const SocketTask = this.SocketTask;
      uni.onSocketOpen(res => {
        this.CONCATCOUNT += 1;
        this.isRconnectIng = false;
        SocketTask.isconnect = true;
        SocketTask.InterValCount = 0;
        SocketTask.uniColse = false;
        resolve(true);
        onOpen.call(SocketTask, res, SocketTask);
        SocketTask.eventPatch.dispatchEvent('onOpen', res);
      })
      uni.onSocketMessage(res => {
        onMsg.call(SocketTask, res, SocketTask);
        SocketTask.eventPatch.dispatchEvent('onMsg', res);
      })
      uni.onSocketClose(async err => {
        SocketTask.isconnect = false;
        resolve(false);
        if (!this.isRconnectIng) {
          this.hbDetection();
          onClose.call(SocketTask, err, SocketTask);
          SocketTask.eventPatch.dispatchEvent('onClose', err);
        }
      })
      uni.onSocketError(err => {
        uni.closeSocket();
        onError.call(SocketTask, err, SocketTask);
        SocketTask.eventPatch.dispatchEvent('onError', err);
      })
    })
  }

  /**
   * 初始化chat
   */
  initChat({
             url,
             onOpen,
             onMsg,
             onClose,
             onError,
             onReload
           } = {}, args) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.connectSocket(url, args);
        let res = await this.SocketEvents({
          onOpen,
          onMsg,
          onClose,
          onError,
          onReload
        })
        resolve(res);
      } catch (e) {
        console.log(e)
        reject();
      }
    })
  }

  /**
   * 连接webSocket
   */
  connectSocket(url, args) {
    return new Promise((resolve, reject) => {
      uni.connectSocket({
        url: url,
        success: res => {
          resolve();
        },
        fail: err => {
          reject(err);
        },
        ...args
      })
    })
  }
}

export default Socket;
