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
        pageSize: 7,
        pageNum: 1,
        total: 0,
        // 是否正在请求数据 节流阀
        isLoading: false,
      };
    },
    onLoad() {
      this.getList()
    },
    methods: {
      // 请求知识列表的方法
      async getList() {
        // 如果正在请求数据，不执行后续逻辑
        if (this.isLoading) {
          return
        }
        if (this.list.length >= this.total && this.total !== 0) {
          return;
        }

        this.isLoading = true
        const res = await getknowList({
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
      // 点击子组件的方法
      clickItemByList(item) {
        if (uni.getStorageSync('token')) {
          if (uni.getStorageSync('idCard')) {
            uni.navigateTo({
              url: '../../detail/knowledgeDetail/knowledgeDetail?id=' + item.propagandaId + '&title=' + item
                .articleType
            })
          } else {
            uni.navigateTo({
              url: '../../modif/signIn/signIn'
            })
          }
        } else {
          uni.navigateTo({
            url: '../../modif/login/login'
          })
        }
      }
    },
    // 这里页面上拉触底进行新的数据请求
    onReachBottom() {
      if (this.list.length >= this.total && this.total !== 0) {
        return;
      }
      console.log('页面触底拉');
      this.pageNum += 1;
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>

</style>