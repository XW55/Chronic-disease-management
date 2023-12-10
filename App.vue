<script>
  import {
    connectWebSocket
  } from '@/tools/useWebsocket.js'
  import {
    getUserInfoByCode
  } from '@/request/request.js'
  export default {
    onLaunch: function() {
      getUserInfoByCode(uni.getStorageSync('idCard')).then(
        res => {
          console.log('app', res);
          if (res.code === 200) {
            uni.setStorageSync('userid', res.data.patientId)
            connectWebSocket(res.data.patientId)
            this.$socket.onOpen((msg) => {
              console.log('聊天连接成功');
            })
          } else {
            uni.clearStorageSync()
          }
        }
      )
    },
    onShow: function() {
      // console.log('App Show')
    },
    onHide: function() {
      // console.log('App Hide')
    }
  }
</script>

<style lang="scss">
  @import "@/node_modules/uview-ui/index.scss";
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
  /deep/ .u-button__text {
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

  /deep/ .u-picker__view__column__item {
    line-height: 68rpx !important;
  }


  /*每个页面公共css */
  .card {
    box-shadow: 0rpx 0rpx 5rpx rgba(0, 0, 0, .2);
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

  /deep/ .u-icon__icon {
    font-size: 38rpx !important;
  }

  .flexBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>