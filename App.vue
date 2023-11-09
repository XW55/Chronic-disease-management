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
  @import url(@/iconfont/iconfont.css);

  page {
    background-color: #f2f4f6;
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

  .m20 {
    margin: 20rpx auto;
  }

  .flexBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
