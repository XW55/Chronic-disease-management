<template>
  <view>
    <view v-for="(item, i) in 5" :key="item">
      <!-- item.hospital.hospitalId -->
      <view class="hos_item flexBox" @click="gotoDetail()">
        <u-avatar size="120" src="https://cdn.uviewui.com/uview/album/1.jpg" shape="circle"></u-avatar>
        <view class="tip">
          <view class="">XXXXXX医院<text class="tag">三级</text> </view>
          <u-gap height="20" bgColor="#fff"></u-gap>
          <view style="color: #ccc; font-size: 26rpx;">XXXXXX医院地址</view>
        </view>

      </view>
      <u-line></u-line>
    </view>
    <!-- 我的预约按钮 -->
    <view @click="gotoAbout" class="myAbout">我的预约</view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        hospitalList: [],
      }
    },
    onLoad() {
      // this.getHospitalList()
    },
    methods: {
      async getHospitalList() {
        const {
          data: res
        } = await uni.$http.get('/hospital/subscribe/list')
        if (res.code === 401) {
          this.$refs.uToast.show({
            message: '登录过期，请重新登录',
            type: 'warning',
            position: 'top',
            duration: 1000
          })
          // 跳转登录页
          setTimeout(() => {
            uni.navigateTo({
              url: '../../../pages/loading/loading'
            })
          }, 600)
        }
        if (res.code !== 200) return
        console.log(res);

        this.hospitalList = res.rows
      },
      gotoDetail() {
        uni.navigateTo({
          // ?id=' + id
          url: '../../pages/department/department'
        })
      },
      gotoAbout() {
        uni.navigateTo({
          url: '../../pages/aboutDay/aboutDay'
        })
      }
    },

  }
</script>

<style lang="scss" scoped>
  .hos_item {
    justify-content: start;
    padding: 20rpx;
    background-color: #fff;
  }

  .tip {
    margin-left: 30rpx;
  }

  .tag {
    width: max-content;
    padding: 3rpx 10rpx;
    border-radius: 5rpx;
    margin-left: 10rpx;
    font-size: 25rpx;
    color: #fff;
    background-color: #60c98a;
  }

  .myAbout {
    width: 100%;
    line-height: 100rpx;
    text-align: center;
    font-size: 34rpx;
    border-radius: 0rpx 0rpx 20rpx 20rpx;
    position: absolute;
    bottom: 0;
    z-index: 1;
    color: #fff;
    background-color: #09f;
    margin-bottom: constant(safe-area-inset-bottom);
    /* 兼容旧版iOS */
    margin-bottom: calc(env(safe-area-inset-bottom));
  }
</style>