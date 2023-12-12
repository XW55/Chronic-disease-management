<template>
  <view>
    <view class="card m20 w95">
      <kNowLedgeList :list="list" @clickItem="clickItemByList"></kNowLedgeList>
    </view>
  </view>
</template>

<script>
  import kNowLedgeList from '@/components/kNowLedgeList.vue'
  import {
    getknowList
  } from '@/request/request.js'
  export default {
    components: {
      kNowLedgeList
    },
    data() {
      return {
        list: [],
        pageSize: 10,
        pageNum: 1,
        // total: 0,
        // // 是否正在请求数据 节流阀
        // isLoading: false,
      };
    },
    onShow() {
      this.getList()
    },
    methods: {
      clickItemByList(item) {
        // console.log(item);
        uni.navigateTo({
          url: '/detail/knowledgeDetail/knowledgeDetail?id=' + item.propagandaId + '&title=' + item.articleType
        })
      },
      // 请求知识列表的方法
      async getList() {
        // console.log('走');
        // // 如果正在请求数据，不执行后续逻辑
        // if (this.isLoading) {
        //   return
        // }
        // console.log('没加载');
        // if (this.list.length >= this.total && this.total !== 0) {
        //   return;
        // }
        // console.log('走了啊');

        // this.isLoading = true

        const res = await getknowList({
          pageSize: this.pageSize,
          pageNum: this.pageNum
        })
        console.log(res);
        if (res.code === 200) {
          this.list = res.rows
          // this.list.push(...res.rows);
          // this.total = res.total;
          // this.isLoading = false
        }
      }
    },
    // 这里页面上拉触底进行新的数据请求
    onReachBottom() {
      // if (this.list.length >= this.total && this.total !== 0) {
      //   return;
      // }
      // console.log('页面触底拉');
      // this.pageNum += 1;
      // this.getList()
    }
  }
</script>

<style lang="scss" scoped>

</style>