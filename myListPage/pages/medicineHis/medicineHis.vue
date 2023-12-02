<template>
  <view>
    <view>
      <text>姓名：{{ patientName }}</text>
      <text>年龄：{{ patientAge }}</text>
      <text>性别：{{ patientSex === 1 ? '男' : '女' }}</text>
    </view>
    <view v-if="medicalAndPatientVOS.length > 0">
      <text>就诊记录：</text>
      <view v-for="(record, index) in medicalAndPatientVOS" :key="index">
        <text>就诊时间：{{ record.diagnosisStartTime }}</text>
        <text>主诉：{{ record.complaint }}</text>
        <text>医生：{{ record.doctor }}</text>
        <text>用药： {{record.medicineType}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    getMedicaHis
  } from '@/request/request.js'
  export default {
    data() {
      return {
        patientName: '',
        patientAge: '',
        patientSex: '',
        medicalAndPatientVOS: []
      };
    },
    onLoad() {
      this.initMediaHis()
    },
    methods: {
      async initMediaHis() {
        const res = await getMedicaHis(uni.getStorageSync('idCard'))
        if (res.code === 200) {
          this.patientName = res.data.patientName;
          this.patientAge = res.data.patientAge;
          this.patientSex = res.data.patientSex;
          this.medicalAndPatientVOS = res.data.medicalAndPatientVOS;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>