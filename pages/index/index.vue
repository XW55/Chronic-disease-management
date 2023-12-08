<template>
  <view>
    <u-toast ref="uToast"></u-toast>
    <medicineList :list="medicineList" @clockMedicine="clockMedicine"></medicineList>
    <navigator url="../../modif/signIn/signIn">去往信息页</navigator>
    <navigator url="../../modif/login/login">去往登录页</navigator>
    <!-- <navigator url="../../myListPage/pages/bpRecord/bpRecord">血压自测</navigator> -->
  </view>
</template>

<script>
  import {
    getMedica,
    clockInMedicine
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

    },
    onShow() {
      this.getMedicineList()
    },
    methods: {
      // 查询药品计划
      async getMedicineList() {
        const res = await getMedica({
          patientCode: uni.getStorageSync('idCard'),
          status: '1'
        })
        console.log(res);
        if (res.code === 200) {
          this.medicineList = res.rows
        }
      },
      loginStatus() {
        if (uni.getStorageSync('token')) {
          if (!uni.getStorageSync('idCard')) {
            uni.navigateTo({
              url: '../../modif/signIn/signIn'
            })
          }
        } else {
          uni.navigateTo({
            url: '../../modif/login/login'
          })
        }
      },
      // 用药打卡
      async clockMedicine(item) {
        this.loginStatus()
        if (item.sum >= item.frequency) {
          return this.$refs.uToast.show({
            message: '该药品已打卡完毕',
            type: 'warning',
            position: 'top',
            duration: 1000
          })
        }
        const vuePro = this
        const res = await clockInMedicine({
          patientCode: uni.getStorageSync('idCard'),
          pharmacyId: item.pharmacyId
        })
        if (res.code === 200) {
          this.$refs.uToast.show({
            message: '服药打卡成功',
            type: 'success',
            position: 'top',
            duration: 1000,
            complete() {
              // vuePro.medicineList = []
              // vuePro.pageNum = 1
              vuePro.getMedicineList()
            }
          })
        }
      },
    }

  }
</script>

<style lang="scss" scoped>

</style>