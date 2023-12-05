<template>
  <view>
    <u-toast ref="uToast"></u-toast>
    <view class="w95 boxSing p20 m20 card container">
      <!-- 添加药品按钮 -->
      <view class="add"><text @click="addMedicine">添加药品</text> </view>
      <!-- 患者用药列表计划列表 -->
      <medicineList :list="medicineList" @updateMedicine="updateMedicine" :show-card="false" v-if="!showAdd">
      </medicineList>

      <!-- 添加用药模块 -->
      <template v-else>
        <view class="title">药品信息</view>
        <view class="tip">请仔细核对药品的规格和剂量</view>
        <view class="flexBox m20">
          <view class="f32">药品名</view>
          <u--input placeholder="请输入药品名" border="none" clearable v-model="medicineName"></u--input>
        </view>
        <!-- 分割线 -->
        <u-line color="#ccc"></u-line>
        <view class="title m20">
          用法用量
        </view>
        <view class="tip">添加用量并按时服药</view>
        <view class="flexBox m20 pore" @click="openPicker">
          <view class="f32">频次</view>
          <u--input style="pointer-events: none;" border="none" v-model="frequency" disabled></u--input>
          <view class="iconfont icon-youjiantou"></view>
        </view>
        <view class="flexBox m20 pore" @click="openPicker1">
          <view class="f32">每次</view>
          <u--input style="pointer-events: none;" border="none" v-model="everyTime" disabled></u--input>
          <view class="iconfont icon-youjiantou"></view>
        </view>
        <u-line color="#ccc"></u-line>
        <view class="flexBox m20">
          <view class="title">用药提醒</view>
          <u-switch v-model="trunOnremind" :size="50" activeColor="#09f" @change="change"></u-switch>
        </view>
        <u-line></u-line>
        <view :style="trunOnremind ? 'opacity: 1;' : 'opacity: .5;'">
          <view class="" v-for="(item,i) in list" :key="i" @click="commHandler(item.value)">
            <view class="flexBox m20">
              <view class="f32" style="width: max-content;">{{item.title}}</view>
              <view class="flexBox">
                <u--input v-model="values[item.value]" inputAlign="right" disabled disabledColor="#ffffff"
                  border="none">
                </u--input>
                <view class="iconfont icon-youjiantou" style="right: 60rpx;"></view>
              </view>
            </view>
            <u-line v-if="list.length !== i + 1"></u-line>
          </view>
        </view>
        <!-- 底部按钮 -->
        <view style="display:flex; justify-content: flex-end;">
          <view class="flexBox" style="width: 55%; margin: 15rpx;">
            <u-button text="取消" size="mini" plain @click="cancel"></u-button>
            <u-button text="保存" size="mini" color="#09f" @click="saveMedicine"></u-button>
          </view>
        </view>

      </template>
    </view>

    <!-- 时间选择器 -->
    <u-datetime-picker ref="first" :itemHeight="100" :minHour="5" :show="showFirstTime" mode="time"
      @cancel="showFirstTime = false" @confirm="showFirstTimeConfirm"></u-datetime-picker>
    <u-datetime-picker ref="second" :itemHeight="100" :minHour="10" :show="showSecondTime" mode="time"
      @cancel="showSecondTime = false" @confirm="showSecondTimeConfirm"></u-datetime-picker>
    <u-datetime-picker ref="third" :itemHeight="100" :minHour="16" :show="showThirdTime" mode="time"
      @cancel="showThirdTime = false" @confirm="showThirdTimeConfirm"></u-datetime-picker>

    <!-- picker选项卡 -->
    <u-picker :show="showPicker" ref="picker" :columns="frequencyList" title="用药频次" :itemHeight="100"
      @cancel="showPicker = false" @confirm="confirm"></u-picker>
    <!-- 用量 -->
    <u-picker :show="showPicker1" :columns="everyTimeList" title="每次用量" :itemHeight="100" @cancel="showPicker1 = false"
      @confirm="confirm1"></u-picker>
  </view>
</template>

<script>
  import {
    addMedica,
    getMedica,
    updateMedica
  } from '@/request/request.js'
  import medicineList from '@/components/medicineList.vue'
  import {
    taleNumber
  } from '@/tools/tool.js'
  export default {
    data() {
      return {
        list: [{
          title: '第一次提醒',
          value: 'firstTime'
        }],
        pageNum: 1,
        total: 0,
        // 药品id，修改时需要用到
        medicineId: '',
        // 是否正在请求数据 节流阀
        isLoading: false,
        // 是否是修改药品
        isUpdateMedicine: false,
        medicineList: [],
        medicineName: '',
        frequency: '每天1次',
        everyTime: '1粒',
        // 是否显示添加药品模块
        showAdd: false,
        showPicker: false,
        showPicker1: false,
        // 打开时间选择器
        showFirstTime: false,
        showSecondTime: false,
        showThirdTime: false,
        // 是否开启提醒
        trunOnremind: true,
        firstTime: '7:00',
        secondTime: '12:00',
        thirdTime: '17:00',
        frequencyList: [
          ['每天1次', '每天2次', '每天3次']
        ],
        everyTimeList: [
          [
            '0.5粒', '1粒', '1.5粒', '2粒', '3粒', '4粒', '5粒', '6粒', '7粒', '8粒', '9粒', '10粒'
          ]
        ]
      };
    },
    components: {
      medicineList
    },
    onLoad() {
      this.getMedicineList()
    },
    computed: {
      values() {
        return {
          firstTime: this.firstTime,
          secondTime: this.secondTime,
          thirdTime: this.thirdTime
        };
      }
    },
    methods: {
      // 添加药品
      addMedicine() {
        this.showAdd = true
      },
      // 查询药品计划
      async getMedicineList() {
        // 如果正在请求数据，不执行后续逻辑
        if (this.isLoading) {
          return
        }
        if (this.list.length >= this.total && this.total !== 0) {
          return;
        }
        this.isLoading = true
        const res = await getMedica({
          patientCode: uni.getStorageSync('idCard'),
          pageSize: 10,
          pageNum: this.pageNum
        })
        console.log(res);
        if (res.code === 200) {
          this.medicineList.push(...res.rows);
          this.total = res.total;
          this.isLoading = false
        }
      },
      // 点击药品列表进入详情
      updateMedicine(item) {
        console.log(item);
        // 这是修改药品
        this.isUpdateMedicine = true
        this.medicineId = item.pharmacyId
        this.medicineName = item.planPharmacy
        this.frequency = `每天${item.frequency}次`
        this.confirm({
          value: [
            this.frequency
          ]
        })
        this.everyTime = `${item.everyTime}粒`
        this.trunOnremind = item.status == '1' ? true : false
        // 默认时间需变化
        if (item.morningTime) {
          this.firstTime = item.morningTime
        }
        if (item.noonTime) {
          this.secondTime = item.noonTime
        }
        if (item.nightTime) {
          this.thirdTime = item.nightTime
        }

        this.showAdd = true
      },
      // 取消编辑
      cancel() {
        this.isUpdateMedicine = false
        this.medicineId = ''
        this.medicineName = ''
        this.showAdd = false
      },
      // 用药提醒开关按钮变化
      change(e) {
        this.trunOnRemind = e
        if (e === true) {
          this.$refs.uToast.show({
            message: '已开启用药提醒',
            type: 'success',
            position: 'top',
            duration: 1000
          })
        } else {
          this.$refs.uToast.show({
            message: '已关闭用药提醒',
            type: 'warning',
            position: 'top',
            duration: 1000
          })
        }
      },
      openPicker() {
        this.showPicker = true
      },
      openPicker1() {
        this.showPicker1 = true
      },
      confirm(e) {
        switch (e.value[0]) {
          case '每天1次':
            this.list = [{
              title: '第一次提醒',
              value: 'firstTime'
            }]
            break;
          case '每天2次':
            this.list = [{
                title: '第一次提醒',
                value: 'firstTime'
              },
              {
                title: '第二次提醒',
                value: 'secondTime'
              }
            ]
            break;
          case '每天3次':
            this.list = [{
                title: '第一次提醒',
                value: 'firstTime'
              },
              {
                title: '第二次提醒',
                value: 'secondTime'
              },
              {
                title: '第三次提醒',
                value: 'thirdTime'
              }
            ]
            break;
        }
        this.frequency = e.value[0]
        this.showPicker = false
      },
      confirm1(e) {
        this.everyTime = e.value[0]
        this.showPicker1 = false
      },
      commHandler(field) {
        if (!this.trunOnremind) {
          return this.$refs.uToast.show({
            message: '请先开启用药提醒',
            type: 'warning',
            position: 'top',
            duration: 1000
          });
        }
        switch (field) {
          case 'firstTime':
            if (this.$refs.first.innerValue === '05:00') {
              this.$refs.first.innerValue = '07:00';
            }
            this.showFirstTime = true;
            break;
          case 'secondTime':
            if (this.$refs.second.innerValue === '10:00') {
              this.$refs.second.innerValue = '12:00';
            }
            this.showSecondTime = true;
            break;
          case 'thirdTime':
            if (this.$refs.third.innerValue === '15:00') {
              this.$refs.third.innerValue = '17:00';
            }
            this.showThirdTime = true;
            break;
          default:
            // 默认情况
            break;
        }
      },
      showFirstTimeConfirm(e) {
        this.firstTime = e.value
        this.showFirstTime = false
      },
      showSecondTimeConfirm(e) {
        this.secondTime = e.value
        this.showSecondTime = false
      },
      showThirdTimeConfirm(e) {
        this.thirdTime = e.value
        this.showThirdTime = false
      },
      // 用户保存药品到数据库
      async saveMedicine() {
        if (this.medicineName === '') {
          return this.$refs.uToast.show({
            message: '请输入药品名称',
            type: 'warning',
            position: 'top',
            duration: 1000
          });
        }
        const obj = {
          patientCode: uni.getStorageSync('idCard'),
          planPharmacy: this.medicineName,
          frequency: taleNumber(this.frequency),
          everyTime: taleNumber(this.everyTime),
          morningTime: this.firstTime,
          noonTime: this.secondTime,
          nightTime: this.thirdTime,
          status: this.trunOnremind ? '1' : '0'
        }
        // 这是修改药品
        if (this.updateMedicine) {
          console.log('6666');
          obj.pharmacyId = this.medicineId
          const res = await updateMedica(obj)
          if (res.data) {
            this.$refs.uToast.show({
              message: '修改成功',
              type: 'success',
              position: 'top',
              duration: 1500
            })
          }
        } else { // 新添加药品计划
          console.log('新增');
          const res = await addMedica(obj)
          console.log('新增', res);
          if (res.data) {
            this.$refs.uToast.show({
              message: '已成功添加该计划',
              type: 'success',
              position: 'top',
              duration: 1500
            })
          }
          // 重新查询列表
        }


      }
    },
    // 这里页面上拉触底进行新的数据请求
    onReachBottom() {
      this.pageNum += 1;
      this.getMedicineList()
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    font-size: 38rpx;
  }

  .tip {
    font-size: 26rpx;
    color: #999999;
  }

  .f32 {
    font-size: 32rpx;
    color: #333;
    width: 120rpx;
  }

  .pore {
    position: relative;
  }

  /deep/ .u-button--mini {
    margin: 15rpx;
    padding: 30rpx 65rpx !important;
  }

  .iconfont {
    font-size: 40rpx;
    position: absolute;
    right: 20rpx;
    z-index: 99;
  }

  .tip {
    color: #959595;
    font-size: 28rpx;
  }

  /deep/ .u-input__content__field-wrapper__field {
    background-color: #f2f4f6;
    padding: 20rpx;
    padding-right: 70rpx;
    font-size: 32rpx !important;
    border-radius: 10rpx;
  }

  .add {
    text-align: right;
    margin: 10rpx 0;
    color: #09f;
  }
</style>