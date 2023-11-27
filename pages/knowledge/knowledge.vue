<template>
  <view>
    <view class="card m20 w95">
      <kNowLedgeList @clickItem="clickItemByList"></kNowLedgeList>
    </view>
  </view>
</template>

<script>
  import kNowLedgeList from '@/components/kNowLedgeList.vue'
  export default {
    components: {
      kNowLedgeList
    },
    data() {
      return {
        list: [],
        pageSize: 7,
        pageNum: 1,
        total: 0,
        // 是否正在请求数据 节流阀
        isLoading: false,
      };
    },
    onLoad() {

    },
    methods: {
      // 请求知识列表的方法
      async getList() {
        // 如果正在请求数据，不执行后续逻辑
        // if (this.isLoading) {
        //   return
        // }
        // if (this.list.length >= this.total && this.total !== 0) {
        //   return;
        // }
        // this.isLoading = true
        // const {
        //   data: res
        // } = await getknowList({})
        // console.log(res);
        // if (res.code === 200) {
        // this.list.push(...res.rows);
        // this.total = res.total;
        // this.isLoading = false
        // }
      },

      // 点击子组件的方法
      clickItemByList(item) {
        uni.navigateTo({
          // ?id=' + item.id + '&title=' + item.title
          url: '../../detail/knowledgeDetail/knowledgeDetail'
        })
      }
    },
    // 这里页面上拉触底进行新的数据请求
    onReachBottom() {
      console.log('页面触底拉');
      // this.pageNum += 1;
      // this.getList()
    }
  }
</script>

<style lang="scss" scoped>

</style>