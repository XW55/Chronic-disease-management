<template>
  <view>
    <!-- 左侧边栏导航 -->
    <view class="floor_box" :style="{height: `${screenHeight}rpx`}">
      <view class="floor_left">
        <view v-for="(item, i) in dePartMentList" :key="i" :class="['floor_item', i === active ? 'active' : '']"
          @click="openChildren(i)">
          {{item.label}}
        </view>
      </view>
      <!-- 右侧边栏 -->
      <view class="floor_right">
        <view class="item" v-for="(activeItem,index) in activeList" :key="index" @click="gotoIndex">
          <view class="flexBox">
            <view>{{activeItem.label}}</view>
            <uni-icons type="forward" color="#000" size="26"></uni-icons>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        hotId: '',
        dePartMentList: [],
        activeList: [],
        screenHeight: '',
        active: 0
      };
    },
    onLoad(options) {
      // this.hotId = options.id
      // this.getHeight()
      // this.getDePartMentList()
    },
    methods: {
      async getDePartMentList() {
        const {
          data: res
        } = await uni.$http.get('hospital/subscribe/getHospitalIdFindList?hospitalId=' + this.hotId)
        if (res.code !== 200) return uni.$showMsg(res.msg)
        // console.log(res);
        this.dePartMentList = res.data
        this.activeList = res.data[0].children
      },
      // 获取屏幕高度
      getHeight() {
        const vuePro = this
        uni.getSystemInfo({
          success: function(res) {
            let screenHeightPx = res.screenHeight;
            let windowWidthPx = res.windowWidth;
            let ratio = 750 / windowWidthPx; // 750 是 UniApp 中 rpx 的基准宽度
            vuePro.screenHeight = parseInt(screenHeightPx * ratio)
          }
        });
      },
      // 给子元素数组赋值
      openChildren(i) {
        this.active = i
        this.activeList = this.dePartMentList[i].children
      },
      gotoIndex() {
        uni.navigateTo({
          url: '../../pages/index/index?id=' + this.hotId
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .item {
    padding: 21rpx 15rpx;
    padding-left: 30rpx;
    background-color: #fff;
    border-bottom: 2rpx solid #e9e9e9;
  }

  .flexBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .floor_box {
    display: flex;
    justify-content: space-between;
    z-index: -1;

    // 左侧分类
    .floor_left {
      width: 40%;
      background-color: #f7f7f7;
      height: 100%;

      .floor_item {
        line-height: 97rpx;
        text-align: center;
        padding: 0 15rpx;
        border-bottom: 2rpx solid #e9e9e9;

        // 激活项的样式
        &.active {
          position: relative;
          color: #09f;
          background-color: #ffffff;

          // 渲染激活项左侧的红色指示边线
          &::before {
            content: ' ';
            display: block;
            width: 8rpx;
            height: 80rpx;
            background-color: #09f;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }

    // 右侧盒子
    .floor_right {
      padding: 0 15rpx;
      width: 80%;
      height: 100%;
      background-color: #fff;
    }
  }
</style>
