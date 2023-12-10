<template>
  <view>
    <u-toast ref="uToast"></u-toast>
    <!-- 心率和血压采集采集 -->
    <view class="card m20 flexBox box boxSing">
      <view class="item" v-for="(item,i) in content" :key="i" @click="clickItem(item.url)">
        <view :class="item.icon" class="icon" :style="{'background-image': item.color}"></view>
        <view style="font-size: 32rpx;">{{item.title}}</view>
      </view>
    </view>

    <medicineList :list="medicineList" @clockMedicine="clockMedicine"></medicineList>

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
        content: [{
            title: '心率检测',
            icon: 'iconfont icon-iconkpxd',
            url: '../../pagebleConnect/pages/index',
            color: 'linear-gradient(to right, #54c7ae, #00ca99)'
          }, {
            title: '血压检测',
            icon: 'iconfont icon-ziyuan',
            url: '../../myListPage/pages/bpRecord/bpRecord',
            color: 'linear-gradient(to right, #13bee7, #09f)'
          },
          {
            title: '随访问卷',
            url: '../../detail/survey/survey',
            icon: 'iconfont icon-wenjuan',
            color: 'linear-gradient(to right, #e2b4e9, #c9a6e7)'
          },
        ],
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
      clickItem(url) {
        // 先查看是否登录，没有token先去登录页
        if (uni.getStorageSync('token')) {
          if (uni.getStorageSync('idCard')) {
            uni.navigateTo({
              url
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
  .box {
    width: 95%;
    height: 195rpx;
    justify-content: space-around;

    .item {
      padding: 10rpx;
      display: flex;
      font-size: 29rpx;
      flex-direction: column;
      align-items: center;

      .icon {
        padding: 20rpx;
        border-radius: 50%;
        color: #fff;
        // background-color: #f2f4f6;
        font-size: 80rpx;
        margin-bottom: 10rpx;
      }
    }
  }
</style>