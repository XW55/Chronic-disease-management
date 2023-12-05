<template>
  <view>
    <medicineList :list="medicineList"></medicineList>

    <navigator url="../../modif/signIn/signIn">去往信息页</navigator>
    <navigator url="../../modif/login/login">去往登录页</navigator>
  </view>
</template>

<script>
  import {
    getMedica
  } from '@/request/request.js'
  import medicineList from '@/components/medicineList.vue'
  export default {
    data() {
      return {
        medicineList: [],
      }
    },
    components: {
      medicineList
    },
    onLoad() {
      this.getMedicineList()
    },
    methods: {
      // 查询药品计划
      async getMedicineList() {
        const res = await getMedica(uni.getStorageSync('idCard'))
        if (res.code === 200) {
          this.medicineList = res.data
        }
      },
    }

  }
</script>

<style lang="scss" scoped>

</style>