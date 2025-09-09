<template>
  <view>
    <!-- @scrolltolower="scrolltolower" -->
    <u-list>
      <u-list-item v-for="(item, index) in list" :key="index" style="position: relative">
        <u-badge :absolute="true" style="z-index: 999" :offset="offset" :value="item.unReadCount" type="error"></u-badge>
        <u-cell :title="item.doctorName" :isLink="true" :label="item.msg || ''" @click="gotoDetail(item.doctorName, item.doctorId, item.unReadCount)">
          <u-avatar slot="icon" shape="square" size="95" :src="item.doctorImg || 'https://cdn.uviewui.com/uview/album/1.jpg'" style="margin-right: 20rpx"></u-avatar>
        </u-cell>
      </u-list-item>
    </u-list>
  </view>
</template>

<script>
import { getDoctorListChat } from '@/request/request.js'
// const text = {
//   "t": 2,
//   "uid": "GLU1000001",
//   "tid": 4023517,
//   "text": {
//     "type": "user",
//     "msg": {
//       "time": "2025-04-23 18:47:30",
//       "type": "text",
//       "userinfo": {
//         "uid": "GLU1000001",
//         "username": "管理员",
//         "face": "https://file.mindyard.cn/xindian/upload/resource/img/chatOrUser.png"
//       },
//       "content": {
//         "text": "你好\n"
//       }
//     }
//   },
//   "type": "text"
// }
export default {
  data() {
    return {
      list: [],
      // 小圆点偏移值
      offset: [10, 610],
    }
  },
  onLoad() {},
  onShow() {
    this.initList()
  },
  methods: {
    async initList() {
      const res = await getDoctorListChat()
      console.log(res)
      this.list = res
    },
    gotoDetail(name, id, status) {
      // uni.navigateTo({
      //   url: '/detail/chat/chat?name=' + name + '&id=' + id + '&status=' + status,
      // })
      uni.navigateTo({
        url: '/detail/newChat/newChat',
      })
    },
  },
}
</script>

<style>
page {
  background-color: #fff;
}
</style>
<style lang="scss" scoped>
::v-deep .u-list-item {
  position: relative;
}
</style>
