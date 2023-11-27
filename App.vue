<script>
  export default {
    onLaunch: function() {
      // console.log('App Launch')
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
  }

  // uniapp 按钮样式穿透
  /deep/ .u-button__text {
    font-size: 35rpx !important;
  }

  .w95 {
    width: 95%;
  }

  /*每个页面公共css */
  .card {
    box-shadow: 0rpx 0rpx 5rpx rgba(0, 0, 0, .2);
    background-color: #fff;
    border-radius: 20rpx;
  }

  image {
    display: block;
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

  .flexBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>