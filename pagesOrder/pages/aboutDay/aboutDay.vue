<template>
  <view :style="{height: `${screenHeight}rpx`}" style="background-color: #fff;">
    <view class="item">
      <view class="flexBox">
        <view style="color: #646464;">就诊人</view>
        <view class="flexBox">
          <view style="color: #4087eb; margin: 0 15rpx;">
            {{userObj.patientName || ''}}【{{userObj.patientSex || ''}}】{{userObj.patientAge || ''}}岁
          </view>
          <view class="iconfont icon-youjiantou" style="font-size: 40rpx; color: #000;"></view>
        </view>
      </view>
    </view>
    <!-- 分割线 -->
    <u-line color="#ccc"></u-line>
    <view class="p20">
      <u-subsection :current="current" :fontSize="30" mode="subsection" :list="items" active-color="#09f"
        @change="onClickItem" />
      </u-subsection>
    </view>

    <view class="content">
      <view v-show="current === 0">
        <scroll-view v-show="list.length !== 0" class="scrollContent scroll-view-wrapper" scroll-y refresher-threshold
          :style="{height:scrollHeight+'px'}" @scrolltolower="getNewList()">
          <list :list="list" :showBtn="true" @delList="delListByChild"></list>
        </scroll-view>
      </view>
      <view v-show="current === 1">
        <scroll-view v-show="list.length !== 0" class="scrollContent scroll-view-wrapper" scroll-y refresher-threshold
          :style="{height:scrollHeight+'px'}" @scrolltolower="getNewList()">
          <list :list="list"></list>
        </scroll-view>
      </view>
      <view v-show="current === 2">
        <scroll-view v-show="list.length !== 0" class="scrollContent scroll-view-wrapper" scroll-y refresher-threshold
          :style="{height:scrollHeight+'px'}" @scrolltolower="getNewList()">
          <list :list="list"></list>
        </scroll-view>
      </view>
      <view v-show="current === 3">
        <scroll-view v-show="list.length !== 0" class="scrollContent scroll-view-wrapper" scroll-y refresher-threshold
          :style="{height:scrollHeight+'px'}" @scrolltolower="getNewList()">
          <list :list="list" :showStatus="true" @delList="delListByChild"></list>
        </scroll-view>
      </view>
    </view>
    <view class="icon" @click="gotoIndex">首页</view>

  </view>
</template>

<script>
  import {
    getAboutList,
    getUserInfoByCode
  } from '@/request/request.js'

  import list from '../../components/list.vue'
  export default {
    components: {
      list
    },
    computed: {

    },
    data() {
      return {
        current: 0,
        items: ['待就诊', '已就诊', '已取消', '超时未诊'],
        screenHeight: 0,
        scrollHeight: 0,
        // 是否正在请求数据
        isLoading: false,
        pageNum: 1,
        list: [],
        total: 0,
        userObj: {}
      };
    },
    onLoad() {
      this.getUser()
    },
    onShow() {
      this.list = []
      this.pageNum = 1
      this.getList()
    },
    onReady() {
      this.getHeight()
    },
    methods: {
      onClickItem(e) {
        if (this.current !== e) {
          this.current = e
          this.list = []
          this.pageNum = 0
          this.total = 0
          this.getList()
        }
      },
      async getUser() {
        const res = await getUserInfoByCode(uni.getStorageSync('idCard'))
        console.log('111', res);
        if (res.code !== 200) return uni.$showMsg(res.msg)
        this.userObj.patientName = res.data.patientName
        this.userObj.patientSex = res.data.patientSex == 1 ? '女' : '男'
        this.userObj.patientAge = res.data.patientAge
      },
      // 子元素传递id，父元素删除对应元素
      delListByChild(id) {
        this.list = this.list.filter(item => item.appointmentId !== id)
      },
      async getList() {
        // 如果正在请求数据，不执行后续逻辑
        if (this.isLoading) {
          return
        }
        this.isLoading = true
        if (this.list.length >= this.total && this.total !== 0) {
          return;
        }
        const
          res = await getAboutList({
            patientCode: uni.getStorageSync('idCard'),
            status: this.current,
            pageNum: this.pageNum,
            pageSize: 5
          })
        if (res.code !== 200) return uni.$showMsg(res.msg)
        this.list.push(...res.rows);
        this.total = res.total;
        this.isLoading = false
      },
      getNewList() {
        if (this.list.length >= this.total && this.total != 0) {
          return;
        }
        console.log("界面触底了");
        this.pageNum = this.pageNum + 1;
        this.getList();
      },
      gotoIndex() {
        uni.switchTab({
          url: '../../../pages/index/index'
        })
      },
      // 获取屏幕高度
      getHeight() {
        const vuePro = this
        uni.getSystemInfo({
          success: function(res) {
            let screenHeightPx = res.screenHeight;
            // 计算滚动层的高度
            console.log(res.screenHeight);
            vuePro.scrollHeight = res.screenHeight
            let windowWidthPx = res.windowWidth;
            let ratio = 750 / windowWidthPx; // 750 是 UniApp 中 rpx 的基准宽度
            vuePro.screenHeight = parseInt(screenHeightPx * ratio)
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  page {
    background-color: #fff;
  }

  .flexBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .icon {
    background-color: #09f;
    border-radius: 50%;
    width: 90rpx;
    height: 90rpx;
    color: #fff;
    text-align: center;
    line-height: 90rpx;
    position: fixed;
    bottom: 30rpx;
    right: 15rpx;
    z-index: 10;
  }

  .item {
    padding: 25rpx 15rpx;
    padding-left: 30rpx;
    background-color: #fff;
  }


  .content {
    padding: 0 20rpx 20rpx 20rpx;
    margin-top: 20rpx;
    background-color: #fff;
  }

  .scrollContent {
    height: calc(100vh - 250rpx);
    overflow-y: scroll;
    background-color: #fff;
  }
</style>