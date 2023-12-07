<template>
  <view>
    <!-- 日历组件  -->
    <calendar :insert="true" :selected="dotsArr" :start-date="startYear" :end-date="endDay" @change="dayChange">
    </calendar>
    <!-- 列表展示 -->
    <scroll-view class="scroll_content" style="height: 600rpx;" :scroll-y="true">
      <faceList :recordsArr="recordsArr" @delBypId="delBypId"></faceList>
    </scroll-view>
  </view>
</template>

<script>
  import calendar from '../../components/uni-calendar/uni-calendar.vue'
  import faceList from '../../components/faceList.vue'
  import {
    getBloodList,
    getBloodTotal
  } from '@/request/request.js'
  export default {
    data() {
      return {
        // 日期选择从今年开始
        startYear: '',
        // 日期选择从今天结束
        endDay: '',
        nowDay: '',
        // 面部记录数组
        recordsArr: [],
        // 显示条数的数组
        dotsArr: [],
      };
    },
    onLoad() {
      // 将今天的时间赋值给 day 
      this.startYear = this.getYear()
      this.endDay = this.getDay()
      this.nowDay = this.getDay()
      if (!uni.getStorageSync('token')) {
        this.gotoLogin()
      }
    },
    onShow() {
      this.recordsArr = []
      this.dotsArr = []
      if (uni.getStorageSync('token')) {
        // 条数
        this.initDotsArr()
        // 初始化数组
        this.initRecordsArr()
      }
    },
    components: {
      calendar,
      faceList
    },
    methods: {
      // 获取今天时间的函数 也就是结束日期
      getDay() {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1; // 注意月份是从0开始计数的，所以要加1
        let year = today.getFullYear();
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        return year + '-' + month + '-' + day
      },
      // 获取今年的开始日期
      getYear() {
        const now = new Date();
        const year = now.getFullYear();
        return `${year}-01-01`;
      },
      // 跳转登录页
      gotoLogin() {
        uni.$showMsg('请登录后查看列表')
        setTimeout(() => {
          uni.navigateTo({
            url: '../../modif/login/login'
          })
        }, 500)
      },
      // 日期发生变化的处理函数
      dayChange(val) {
        if (uni.getStorageSync('token')) {
          this.nowDay = val.fulldate
          // 进行数据请求
          this.initRecordsArr()
        } else {
          this.gotoLogin()
        }
      },
      // 血压问诊记录
      async initRecordsArr() {
        const res = await getBloodList({
          startTime: this.nowDay,
          endTime: this.nowDay,
          patientCode: uni.getStorageSync('idCard')
        })
        console.log(res);
        if (res.code === 200) {
          this.recordsArr = res.rows
          // this.filterRecords()
        }
      },
      // 循环遍历查看记录中是否有空的数据
      // async filterRecords() {
      //   for (let i = 0; i < this.recordsArr.length; i++) {
      //     if (this.recordsArr[i].faceImg === null && this.recordsArr[i].patientBlood === null && this.recordsArr[i]
      //       .patientManagement === null) {
      //       console.log('有重复的数据');
      //       const {
      //         data: res
      //       } = await uni.$http.delete('/connect_patient/delById?pId=' + this.recordsArr[i].pid)
      //       this.recordsArr = this.recordsArr.filter(x => x.pid !== this.recordsArr[i].pid)
      //       this.initDotsArr()
      //     }
      //   }
      // },
      // 获取检测日期(日历中选定的图标的绿点)
      async initDotsArr() {
        const res = await getBloodTotal(uni.getStorageSync('idCard'))
        console.log('小点是', res);
        if (res.code === 200) {
          this.dotsArr = res.data
        }
      },

      // 子组件已删除，父元素数组删除
      delBypId(id) {
        this.recordsArr = this.recordsArr.filter(x => x.pid !== id)
        this.initDotsArr()
        this.initRecordsArr()
      }

    },


  }
</script>

<style lang="scss" scoped>
  .scroll_content {
    width: 100%;
    flex-grow: 1;
    overflow: scroll;
  }

  /deep/ .u-swipe-action-item__right__button {
    border-radius: 20rpx !important;
  }

  /deep/ .u-swipe-action-item__content {
    border-radius: 20rpx;
  }

  /deep/ .u-swipe-action-item {
    margin: 15rpx auto;
  }
</style>