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
  @import "uview-ui/index.scss";

  .page {
    background-color: #f2f4f6;
  }

  /*每个页面公共css */
  .card {
    box-shadow: 0rpx 0rpx 10rpx rgba(0, 0, 0, .3);
    background-color: #fff;
    border-radius: 10rpx;
    padding: 20rpx;
    margin: 15rpx auto;
  }

  .m20 {
    margin: 20rpx auto;
  }

  .flexBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
