<template>
  <view>
    <view v-for="(item,i) in list" :key="item.pharmacyId">
      <view class="w95 boxSing p20 m20 flexBox" :class="showCard ? 'card' : ''">
        <view @click="updateDetail(item)">
          <view class="comm active" v-if="item.status == '1'">正在服用</view>
          <view class="comm stop" v-else>已停用</view>
          <view class="name">{{item.planPharmacy}}</view>
          <view class="tip">每天<text>{{item.frequency}}次</text> 每次<text>{{item.everyTime}}粒</text> </view>
        </view>
        <view class="btn flexBox" v-if="showBtn">
          <text style="font-size: 33rpx;">已服用</text>
          <text>1/{{item.frequency}}</text>
        </view>
      </view>
      <u-line color="#ccc" v-if="list.length !== i +1 && showCard===false"></u-line>
    </view>

  </view>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        default: function() {
          return []
        }
      },
      showBtn: {
        type: Boolean,
        default: true
      },
      showCard: {
        type: Boolean,
        default: true
      },
    },
    methods: {
      updateDetail(item) {
        this.$emit('updateMedicine', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  $main-color: #09f;

  .comm {
    width: max-content;
    border-radius: 5rpx;
    font-size: 34rpx;
    padding: 5rpx 15rpx;
  }

  .active {
    color: #02b258;
    background-color: #e2f9e6;
  }

  .stop {
    color: #333333;
    background-color: #d8d8d8;
  }

  .name {
    font-size: 32rpx;
    margin: 15rpx 0;
  }

  .tip text {
    color: $main-color;
  }

  .btn {
    width: 150rpx;
    height: 150rpx;
    box-shadow: 0 0 10rpx #09f;
    text-align: center;
    background-color: $main-color;
    border-radius: 50%;
    color: #fff;
    flex-direction: column;
    justify-content: space-evenly;
  }
</style>