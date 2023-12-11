<template>
  <view>
    <u-list @scrolltolower="scrolltolower">
      <u-list-item v-for="(item, index) in list" :key="index" style="position: relative;">
        <u-badge v-if="item.msgState" :absolute="true" :offset="offset" :isDot="true" type="error"></u-badge>
        <u-cell :title="item.doctorName" :label="item.msg || ''"
          @click="gotoDetail(item.doctorName,item.doctorId,item.msgState)">
          <u-avatar slot="icon" shape="square" size="95" src="https://cdn.uviewui.com/uview/album/1.jpg"
            customStyle="margin: -3px 5px -3px 0"></u-avatar>
        </u-cell>
      </u-list-item>

    </u-list>
  </view>
</template>

<script>
  import {
    getDoctorListChat
  } from '@/request/request.js'
  export default {
    data() {
      return {
        list: [],
        // 小圆点偏移值
        offset: [10, 510]
      };
    },
    onLoad() {

    },
    onShow() {
      this.initList()
    },
    methods: {
      async initList() {
        const res = await getDoctorListChat(uni.getStorageSync('idCard'))
        console.log(res);
        if (res.code === 200) {
          this.list = res.data
        }
      },
      gotoDetail(name, id, status) {
        uni.navigateTo({
          url: '/detail/chat/chat?name=' + name + '&id=' + id + '&status=' + status
        })
      }
    }
  }
</script>

<style>
  page {
    background-color: #fff;
  }
</style>
<style lang="scss" scoped>
  /deep/ .u-list-item {
    position: relative;
  }
</style>