<template>
  <view>
    <template v-if="list.length !== 0">
      <view class="card m20 w95">
        <kNowLedgeList :list="list" @clickItem="clickItemByList"></kNowLedgeList>
      </view>
    </template>

    <!-- 用户没有收藏的展示页面 -->
    <view class="box" v-else>
      <view class="tip">暂无收藏</view>
      <u-button text="发现更多" color="#09f" :throttleTime="500" @click="gotoKnowLedge"></u-button>
    </view>

  </view>
</template>

<script>
  import kNowLedgeList from '@/components/kNowLedgeList.vue'
  import {
    getCollectList
  } from '@/request/request.js'

  export default {
    components: {
      kNowLedgeList
    },
    data() {
      return {
        // 用户收藏的列表
        list: [],
        pageSize: 7,
        pageNum: 1,
        total: 0,
        // 是否正在请求数据 节流阀
        isLoading: false,
      };
    },
    // 这里用户取消收藏后不能继续触发请求的函数
    onShow() {
      this.list = []
      this.pageNum = 1
      this.getList()
    },
    methods: {
      // 获取收藏列表
      async getList() {
        // 如果正在请求数据，不执行后续逻辑
        if (this.isLoading) {
          return
        }
        if (this.list.length >= this.total && this.total !== 0) {
          return;
        }
        this.isLoading = true
        const res = await getCollectList({
          pageSize: this.pageSize,
          pageNum: this.pageNum
        })
        console.log(res);
        if (res.code === 200) {
          this.list.push(...res.rows);
          this.total = res.total;
          this.isLoading = false
        }
      },
      // 获取更多知识
      gotoKnowLedge() {
        uni.switchTab({
          url: '/pages/knowledge/knowledge'
        })
      },
      // 点击子组件的方法
      clickItemByList(item) {
        uni.navigateTo({
          url: '../../../detail/knowledgeDetail/knowledgeDetail?id=' + item.propagandaId + '&title=' + item
            .articleType
        })
      }
    },
    // 这里页面上拉触底进行新的数据请求
    onReachBottom() {
      console.log('页面触底拉');
      this.pageNum += 1;
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
  .box {
    text-align: center;
    margin: 300rpx auto;

    .tip {
      color: #979797;
      margin: 150rpx 0 150rpx 0;
      font-size: 35rpx;
    }

    /deep/ .u-button {
      width: 60%;
      height: 80rpx;
      border-radius: 25rpx;
    }
  }
</style>