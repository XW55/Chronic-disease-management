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
        list: []
      };
    },
    onLoad() {

    },
    methods: {
      // 请求知识列表的方法

      // 点击子组件的方法
      clickItemByList(val) {
        console.log('子组件传递过来的值是', val);
      }
    },
    // 这里页面上拉触底进行新的数据请求
    onReachBottom() {
      console.log('页面触底拉');
    }
  }
</script>

<style lang="scss">

</style>
