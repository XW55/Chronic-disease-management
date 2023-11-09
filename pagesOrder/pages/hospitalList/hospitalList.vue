<template>
  <view>
    <view class="hos_box">
      <view class="hos_item" v-for="(item, i) in hospitalList" :key="i" @click="gotoDetail(item.hospital.hospitalId)">
        <view class="hos_item_img">
          <image :src="item.hospital.img"></image>
        </view>
        <view class="">
          {{item.hospital.hospitalName}}
        </view>
      </view>
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
          uni.$showMsg('登录过期，请重新登录')
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
      gotoDetail(id) {
        uni.navigateTo({
          url: '../../pages/department/department?id=' + id
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
  page {
    background-color: #f2f4f6;
  }

  .hos_box {
    margin: 25rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex: 50%;

    .hos_item {
      padding: 20rpx 12rpx;
      width: 42%;
      background-color: #fff;
      border-radius: 15rpx;
      box-shadow: 0rpx 0rpx 8rpx rgba(0, 0, 0, .3);

      .hos_item_img {
        text-align: center;

        image {
          width: 80%;
          height: 245rpx;
          margin: 20rpx 0;
        }
      }

    }
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
    background-color: #6296fc;
    margin-bottom: constant(safe-area-inset-bottom);
    /* 兼容旧版iOS */
    margin-bottom: calc(env(safe-area-inset-bottom));
  }
</style>
