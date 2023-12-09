<template>
  <view>
    <!-- 顶部切换 -->
    <view class="p20" style="background-color: #fff; padding-bottom: 0;">
      <u-subsection :current="current" :fontSize="30" mode="subsection" :list="items" active-color="#09f"
        @change="onClickItem" />
      </u-subsection>
    </view>
    <template v-if="current === 0">
      <!-- 日历组件  -->
      <calendar :insert="true" :selected="dotsArr" :start-date="startYear" :end-date="endDay" @change="dayChange">
      </calendar>
      <!-- 列表展示 -->
      <scroll-view class="scroll_content" style="height: 600rpx;" :scroll-y="true">
        <faceList :recordsArr="recordsArr" @delBypId="delBypId"></faceList>
      </scroll-view>
    </template>
    <template v-else>
      <!-- 日历组件  -->
      <calendar :insert="true" :selected="ecgDotsArr" :start-date="startYear" :end-date="endDay" @change="dayEcgChange">
      </calendar>
      <!-- 列表展示 -->
      <scroll-view class="scroll_content" style="height: 600rpx;" :scroll-y="true">
        <faceList :ecgArr="ecgArr" :showBlood="false" @delEcgBypId="delEcgBypId"></faceList>
      </scroll-view>
    </template>

  </view>
</template>

<script>
  import calendar from '../../components/uni-calendar/uni-calendar.vue'
  import faceList from '../../components/faceList.vue'
  import {
    getBloodList,
    getBloodTotal,
    getEcgTotal,
    getEcgList
  } from '@/request/request.js'
  export default {
    data() {
      return {
        // 日期选择从今年开始
        startYear: '',
        // 日期选择从今天结束
        endDay: '',
        nowDay: '',
        ecgNowDay: '',
        // 面部记录数组
        recordsArr: [],
        // 显示条数的数组
        dotsArr: [],
        // 心电记录数组
        ecgArr: [],
        // 显示心电条数
        ecgDotsArr: [],
        current: 0,
        items: ['血压记录', '心电记录'],
      };
    },
    onLoad() {
      // 将今天的时间赋值给 day 
      this.startYear = this.getYear()
      this.endDay = this.getDay()
      this.nowDay = this.getDay()
      this.ecgNowDay = this.getDay()
    },
    onShow() {
      // 请求血压数据
      if (this.current === 0) {
        this.initBlood()
      } else {
        this.initEcg()
      }
    },
    components: {
      calendar,
      faceList
    },
    methods: {
      onClickItem(e) {
        this.nowDay = this.getDay()
        this.ecgNowDay = this.getDay()
        if (this.current !== e) {
          this.current = e
          if (this.current === 0) {
            this.initBlood()
          } else {
            this.initEcg()
          }
        }
      },
      // 初始化血压
      initBlood() {
        this.recordsArr = []
        this.dotsArr = []
        // 请求血压数据
        this.initDotsArr()
        this.initRecordsArr()
      },
      // 初始化心电结果
      initEcg() {
        this.ecgArr = []
        // 显示心电条数
        this.ecgDotsArr = []
        // 请求心电小点数组
        this.initEcgDotsArr()
        // 请求心电数据
        this.initEcgArr()
      },
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
        uni.$showMsg('请先登录')
        setTimeout(() => {
          uni.navigateTo({
            url: '../../modif/login/login'
          })
        }, 500)
      },
      // 日期发生变化的处理函数
      dayChange(val) {
        if (uni.getStorageSync('token')) {
          if (uni.getStorageSync('idCard')) {
            this.nowDay = val.fulldate
            // 进行数据请求
            this.initBlood()
          } else {
            uni.navigateTo({
              url: '../../modif/signIn/signIn'
            })
          }

        } else {
          this.gotoLogin()
        }
      },
      dayEcgChange(val) {
        if (uni.getStorageSync('token')) {
          if (uni.getStorageSync('idCard')) {
            this.ecgNowDay = val.fulldate
            // 进行数据请求
            this.initEcg()
          } else {
            uni.navigateTo({
              url: '../../modif/signIn/signIn'
            })
          }

        } else {
          this.gotoLogin()
        }
      },
      // 血压记录
      async initRecordsArr() {
        const res = await getBloodList({
          startTime: this.nowDay,
          endTime: this.nowDay,
          patientCode: uni.getStorageSync('idCard')
        })
        console.log(res);
        if (res.code === 200) {
          this.recordsArr = res.rows
        }
      },
      // 心电记录
      async initEcgArr() {
        const res = await getEcgList({
          patientCode: uni.getStorageSync('idCard'),
          endReportTime: this.ecgNowDay
        })
        console.log('请求心电得结果是', res);
        if (res.code === 200) {
          this.ecgArr = res.rows
        }
      },
      // 获取心电小点
      async initEcgDotsArr() {
        const res = await getEcgTotal(uni.getStorageSync('idCard'))
        console.log('心电小点是', res);
        if (res.code === 200) {
          this.ecgDotsArr = res.data
        }
      },
      // 获取血压检测日期(日历中选定的图标的绿点)
      async initDotsArr() {
        const res = await getBloodTotal(uni.getStorageSync('idCard'))
        console.log('血压小点是', res);
        if (res.code === 200) {
          this.dotsArr = res.data
        }
      },
      // 子组件已删除，父元素数组删除
      delBypId(id) {
        this.recordsArr = this.recordsArr.filter(x => x.pid !== id)
        this.initBlood()
      },
      delEcgBypId(id) {
        this.ecgArr = this.ecgArr.filter(x => x.pId !== id)
        this.initEcg()
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

  /deep/ .u-subsection--subsection {
    height: 70rpx !important;
  }

  /deep/ .u-subsection__bar {
    height: 70rpx !important;
    border-radius: 20rpx !important;
  }

  /deep/ .u-subsection__item {
    border: #fff !important;
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