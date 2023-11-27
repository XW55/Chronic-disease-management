<template>
  <view>
    <doctor></doctor>
  </view>
</template>

<script>
  import {
    login
  } from '@/request/request.js'
  import doctor from '@/components/doctor.vue'
  export default {
    components: {
      doctor
    },
    data() {
      return {}
    }

  }
</script>

<style lang="scss" scoped>

</style>