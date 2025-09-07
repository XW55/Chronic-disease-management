// utils/websocket.js
import {
  MyWebSocket,
  Message
} from './socket.js'

class WebSocketManager {
  constructor() {
    this.instance = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 3000
    this.messageHandlers = new Map()
  }

  // 初始化WebSocket连接
  init(options) {
    return new Promise((resolve, reject) => {
      if (this.instance && this.isConnected) {
        resolve('WebSocket已经连接')
        return
      }

      // 创建MyWebSocket实例
      this.instance = new MyWebSocket((message) => {
        console.log('收到消息:', message)
        this.handleMessage(message)
      }, true) // 开启日志

      this.instance.init(options)
        .then(res => {
          this.isConnected = true
          this.reconnectAttempts = 0
          resolve(res)

        })
        .catch(err => {
          this.tryReconnect(options)
          reject(err)
        })
    })
  }

  // 重连机制
  tryReconnect(options) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('达到最大重连次数，停止重连')
      return
    }

    this.reconnectAttempts++
    console.log(`尝试第${this.reconnectAttempts}次重连...`)

    setTimeout(() => {
      this.init(options)
        .catch(err => {
          console.error('重连失败:', err)
        })
    }, this.reconnectInterval)
  }

  // 发送消息
  send(event, data, validate = true) {
    if (!this.isConnected) {
      return Promise.reject('WebSocket未连接')
    }

    const message = new Message(event, data)
    return this.instance.send(message, validate)
  }

  // 处理接收到的消息
  handleMessage(message) {
    const {
      event,
      data
    } = message

    // 全局消息处理
    if (event === 'welcome') {
      console.log('欢迎消息:', data)
    }

    // 调用特定事件的处理函数
    if (this.messageHandlers.has(event)) {
      const handlers = this.messageHandlers.get(event)
      handlers.forEach(handler => handler(data))
    }
  }

  // 注册消息处理器
  on(event, handler) {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, [])
    }
    this.messageHandlers.get(event).push(handler)
  }

  // 移除消息处理器
  off(event, handler) {
    if (this.messageHandlers.has(event)) {
      const handlers = this.messageHandlers.get(event)
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  // 关闭连接
  close() {
    this.messageHandlers.clear()
    this.reconnectAttempts = this.maxReconnectAttempts // 停止重连

    if (this.instance) {
      return this.instance.close()
        .then(() => {
          this.isConnected = false
          console.log('WebSocket连接已关闭')
        })
        .catch(err => {
          console.error('关闭连接失败', err)
          throw err
        })
    }

    return Promise.resolve()
  }

  // 获取连接状态
  getStatus() {
    return this.isConnected ? 'connected' : 'disconnected'
  }
}

// 创建单例实例
const webSocketManager = new WebSocketManager()

export default webSocketManager
export {
  Message
}