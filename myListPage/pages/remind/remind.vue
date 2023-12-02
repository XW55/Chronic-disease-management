<template>
  <view>
    <button type="default" @click="showTime = true">打开时间选择</button>
    <u-datetime-picker itemHeight="100" :show="showTime" mode="time"></u-datetime-picker>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        showTime: false,
      };
    }
  }
</script>

<style lang="scss" scoped>

</style>