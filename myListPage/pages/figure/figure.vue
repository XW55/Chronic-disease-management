<template>
  <view>
    <!-- 一周血压记录 -->
    <view class="result card">
      <view class="result_title flexBox ">
        <view style="font-size: 40rpx; font-weight: 700;">心率血压</view>
        <view class="dateBox" @click="openBloodCalendar">{{startBloodTime}} ~ {{endBloodTime}} <text
            style="margin-left: 10rpx;" class="iconfont icon-rili"></text>
        </view>
      </view>
      <view class="chart">
        <view class="todayCar">
          <qiun-data-charts class="charts" :canvas2d="true" canvasId="xwCharts" type="line" :opts="opts"
            :chartData="chartData" />
        </view>
      </view>
    </view>

    <!-- 血压日历 -->
    <uni-calendar ref="bloodCalendar" :range="true" :insert="false" @confirm="bolldConfirm" />


  </view>
</template>

<script>
  import qiunDataCharts from '@/node_modules/uview-ui/components/qiun-data-charts/components/qiun-data-charts/qiun-data-charts'
  import {
    getThisWeekDates
  } from '@/tools/tool.js'
  export default {
    components: {
      qiunDataCharts
    },
    data() {
      return {
        chartData: {},
        //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
        opts: {
          color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
          padding: [15, 10, 0, 5],
          enableScroll: false,
          fontSize: 11,
          legend: {},
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            gridType: "dash",
            dashLength: 1,
          },
          extra: {
            line: {
              type: "curve",
              width: 1,
              activeType: "hollow"
            }
          }
        },
        startBloodTime: '',
        endBloodTime: '',
      };
    },
    onLoad() {
      const thisWeek = getThisWeekDates();
      this.startBloodTime = thisWeek.startDate
      this.endBloodTime = thisWeek.endDate
    },
    onReady() {
      // 图标数据
      this.getServerData();
    },
    methods: {

      async getServerData() {
        // 生成一周的时间
        // 定义起始日期和结束日期
        const startDate = new Date(this.startBloodTime);
        const endDate = new Date(this.endBloodTime);
        // 生成日期数组
        const dateArray = [];
        let currentDate = startDate;
        while (currentDate <= endDate) {
          dateArray.push(currentDate.getDate().toString());
          currentDate.setDate(currentDate.getDate() + 1);
        }
        let res = {
          categories: dateArray,
          series: [{
              name: "高压/收缩压",
              data: [110, 108, 115, 112, 125, 120, 115]
            },
            {
              name: "低压/舒张压",
              data: [80, 85, 83, 88, 86, 90, 82]
            },
            {
              name: "心率",
              data: [74, 79, 76, 75, 69, 73, 77]
            }
          ]
        };

        // 配置项数组
        // let res = {
        //   categories: dateArray,
        //   series: [{
        //       name: "高压/收缩压",
        //       data: []
        //     },
        //     {
        //       name: "低压/舒张压",
        //       data: []
        //     },
        //     {
        //       name: "脉搏",
        //       data: []
        //     }
        //   ]
        // };
        // 请求血压数据
        // const {
        //   data: result
        // } = await getWeekBlood({
        //   patientPhone: this.barUser.tel,
        //   startTime: this.startBloodTime,
        //   endTime: this.endBloodTime,
        // })
        // for (let i = 0; i < result.data.length; i++) {
        //   res.series[0].data.push(result.data[i].hp)
        //   res.series[1].data.push(result.data[i].bp)
        //   res.series[2].data.push(result.data[i].lp)
        // }
        // 配置数据
        this.chartData = res;
      },

      // 血压日期
      bolldConfirm(e) {
        if (e.range.data.length === 7) {
          // 将日期字符串转换为 Date 对象
          const date1 = new Date(e.range.before);
          const date2 = new Date(e.range.after);
          // 使用比较运算符来比较日期先后
          if (date1 < date2) {
            this.startBloodTime = e.range.before
            this.endBloodTime = e.range.after
          } else if (date1 > date2) {
            this.startBloodTime = e.range.after
            this.endBloodTime = e.range.before
          }
          this.getServerData()
        } else {
          return uni.$showMsg('请选择一周的开始结束日期')
        }
      },
      // 打开血压日历
      openBloodCalendar() {
        this.$refs.bloodCalendar.open();
      },
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .uni-calendar__header-text {
    font-size: 40rpx !important;
  }

  /deep/ .uni-calendar-item__weeks-box {
    border-radius: 20% !important;
  }

  .flexBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .result {
    font-size: 30rpx;
    width: 95%;
    margin: 15rpx auto;
    background-color: #fff;
    border-radius: 10rpx;

    .result_title {
      margin: 10rpx 0 20rpx;
      padding: 30rpx 30rpx 10rpx;
    }

    .dateBox {
      border-radius: 8rpx;
      border: 2rpx solid #d9d9d9;
      padding: 8rpx 15rpx;
      font-size: 25rpx;
      color: #8c8c8c;
      width: max-content;
    }
  }
</style>