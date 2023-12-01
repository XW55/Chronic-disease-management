<template>
  <view>
    <!-- 中间主要功能区域 -->
    <view class="card m20 flexBox box">
      <view class="item" v-for="(item,i) in content" :key="i" @click="clickItem(item.url)">
        <view :class="item.icon" class="icon" :style="{color: item.color}"></view>
        <view>{{item.title}}</view>
      </view>
    </view>
    <!-- 底部导航区区域 -->
    <myList :list="list" @clickItem="clickItem"></myList>
  </view>
</template>

<script>
  import myList from '@/components/myList.vue'
  export default {
    components: {
      myList
    },
    data() {
      return {
        // 中间主要功能区域
        content: [{
          title: '我的问诊',
          icon: 'iconfont icon-wenzhen',
          url: '',
          color: '#ff8631'
        }, {
          title: '预约挂号',
          icon: 'iconfont icon-yuyueguahao',
          url: '/pagesOrder/pages/hospitalList/hospitalList',
          color: '#09f'
        }, {
          title: '病历查看',
          icon: 'iconfont icon-juecebaogao',
          url: '',
          color: '#8b5cfd'
        }, {
          title: '服药计划',
          icon: 'iconfont icon-time',
          url: '../../myListPage/pages/medicine/medicine',
          color: '#00b386'
        }],
        // 底部列表数据
        list: [{
            title: '我的收藏',
            url: '../../myListPage/pages/collect/collect',
            icon: 'iconfont icon-shoucang'
          },
          {
            title: '提醒管理',
            url: '../../myListPage/pages/remind/remind',
            icon: 'iconfont icon-xiaoxizhongxin'
          },
          {
            title: '常见问题',
            url: '',
            icon: 'iconfont icon-changjianwentixiangguanwenti'
          },
          {
            title: '设置',
            url: '',
            icon: 'iconfont icon-31shezhi'
          },
        ],
      };
    },
    methods: {
      // 点击每一项的事件处理函数
      clickItem(url) {
        // 先查看是否登录，没有token先去登录页
        if (uni.getStorageSync('token')) {
          uni.navigateTo({
            url
          })
        } else {
          uni.navigateTo({
            url: '../../modif/login/login'
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box {
    width: 95%;
    height: 180rpx;
    justify-content: space-around;

    .item {
      padding: 10rpx;
      display: flex;
      font-size: 29rpx;
      flex-direction: column;
      align-items: center;

      .icon {
        padding: 20rpx;
        border-radius: 15rpx;
        background-color: #f2f4f6;
        font-size: 55rpx;
        margin-bottom: 10rpx;
      }
    }
  }
</style>