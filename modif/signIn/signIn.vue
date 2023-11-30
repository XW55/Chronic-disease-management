<template>
  <view class="container m20 w95 card">
    <u--form :model="userInfo" ref="uForm" :rules="rules">
      <u-form-item required="true" label="姓名" borderBottom prop="name">
        <u-input placeholder="请输入姓名" v-model="userInfo.name" border="none" />
      </u-form-item>
      <u-form-item required="true" label="证件号码" borderBottom prop="idCard">
        <u-input placeholder="请输入身份证号码" type="number" maxlength="18" v-model="userInfo.idCard" border="none" />
      </u-form-item>

      <u-form-item required="true" @click="showBirth = true" label="出生日期" prop="birth" borderBottom>
        <u--input v-model="userInfo.birth" disabled disabledColor="#ffffff" placeholder="请选择生日" border="none">
        </u--input>
        <u-icon slot="right" name="arrow-right"></u-icon>
      </u-form-item>

      <u-form-item required="true" @click="showSex = true" label="性别" prop="sex" borderBottom>
        <u--input v-model="userInfo.sex" disabled disabledColor="#ffffff" placeholder="请选择性别" border="none">
        </u--input>
        <u-icon slot="right" name="arrow-right"></u-icon>
      </u-form-item>
      <picker :value="multiIndex" :start="startDate" :end="endDate" :range="heightColumns" @change="heightChange">
        <u-form-item required="true" label="身高" prop="height" borderBottom>
          <u--input v-model="userInfo.height" disabled disabledColor="#ffffff" placeholder="请选择身高" border="none">
          </u--input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </picker>

      <picker :value="multiIndex1" :range="weightColumns" @change="weightChange">
        <u-form-item required="true" label="体重" prop="weight" borderBottom>
          <u--input v-model="userInfo.weight" disabled disabledColor="#ffffff" placeholder="请选择体重" border="none">
          </u--input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </picker>
      <u-form-item label="既往病史" borderBottom>
        <u--textarea v-model="userInfo.medical" placeholder="请输入既往病史" autoHeight></u--textarea>
      </u-form-item>
    </u--form>
    <!-- 性别选择 -->
    <u-action-sheet :show="showSex" :actions="actions" title="请选择性别" @close="showSex = false" @select="sexSelect"
      :safeAreaInsetBottom="true">
    </u-action-sheet>
    <!-- 生日选择 -->
    <u-datetime-picker :show="showBirth" @cancel="showBirth = false" @confirm="confirmBirth" mode="date"
      :minDate="-880031123200">
    </u-datetime-picker>
    <!-- 提交重置 -->
    <view class="btn_box">
      <u-button color="#f9ae3d" @click="reset" text="重置"></u-button>
      <u-button color="#09f" @click="submit" text="提交"></u-button>
    </view>

  </view>
</template>

<script>
  import {
    formatTimeStamp
  } from '@/tools/formatTime.js'
  export default {
    data() {
      return {
        userInfo: {
          name: '',
          sex: '',
          idCard: '',
          height: '',
          weight: '',
          medical: '',
          birth: '',
        },
        multiIndex: 159,
        multiIndex1: 49,
        // 身高数组
        heightColumns: [],
        weightColumns: [],
        // 是否弹出性别选择
        showSex: false,
        // 日期选择
        showBirth: false,
        // 校检规则
        rules: {
          name: {
            type: 'string',
            required: true,
            message: '请填写姓名',
            trigger: ['blur', 'change']
          },
          birth: {
            type: 'string',
            required: true,
            message: '请选择出生日期',
            trigger: ['blur', 'change']
          },
          height: {
            type: 'string',
            required: true,
            message: '请选择身高',
            trigger: ['blur', 'change']
          },
          weight: {
            type: 'string',
            required: true,
            message: '请选择体重',
            trigger: ['blur', 'change']
          },
          idCard: [{
              type: 'string',
              required: true,
              max: 18,
              message: '请输入身份证号',
              trigger: ['blur', 'change']
            },
            {
              // 自定义验证函数，见上说明
              validator: (rule, value, callback) => {
                return uni.$u.test.idCard(value);
              },
              message: '身份证号码不正确',
            }
          ],
          sex: {
            type: 'string',
            max: 1,
            required: true,
            message: '请选择男或女',
            trigger: ['blur', 'change']
          },
        },
        radio: '',
        switchVal: false,
        // 性别参数
        actions: [{
            name: '男'
          },
          {
            name: '女'
          }
        ],
      }
    },
    onLoad() {
      for (let i = 1; i <= 200; i++) {
        this.heightColumns.push(`${i}cm`)
      }
      for (let j = 1; j <= 200; j++) {
        this.weightColumns.push(`${j}kg`)
      }
    },
    methods: {
      // 选择性别
      sexSelect(e) {
        this.userInfo.sex = e.name
      },
      // 身高变化
      heightChange(e) {
        this.multiIndex = e.detail.value
        this.userInfo.height = this.heightColumns[e.detail.value]
      },
      // 出生日期
      confirmBirth(e) {
        this.userInfo.birth = formatTimeStamp(e.value)
        this.showBirth = false
      },
      // 体重
      weightChange(e) {
        this.multiIndex = e.detail.value
        this.userInfo.weight = this.weightColumns[e.detail.value]
      },
      submit() {
        // 表单验证
        this.$refs.uForm.validate().then(async res => {
          console.log(res);
          // 解构赋值
          const {
            name,
            sex,
            birth
          } = this.userInfo
          // 组织信息用于提交表单
          const obj = {
            patientName: name,
            patientSex: sex,
            patientBirthdayTime: birth,
          }
          // const {
          //   data: result
          // } = await uni.$http.post('/zhongyi/patientInfo/patientAddOrUpdate', obj)
          // console.log(result);
          // if (result.code === 200) {}
        }).catch(errors => {
          console.log(errors);
          uni.$showMsg('还有信息未填写')
        })
      },
      // 重置表单
      reset() {
        this.userInfo.name = ''
        this.userInfo.sex = ''
        this.userInfo.idCard = ''
        this.userInfo.height = ''
        this.userInfo.weight = ''
        this.userInfo.birth = ''
        // 重置校检信息
        this.$refs.uForm.clearValidate();
      },

    },
  }
</script>

<style lang="scss" scoped>
  .container {
    padding: 10rpx 30rpx;
    box-sizing: border-box;
    background-color: #fff;
  }

  /deep/ .u-form-item__body__left {
    width: 160rpx !important;
  }

  /deep/ .u-picker__view__column {
    height: 280rpx !important;
  }

  /deep/ .u-picker__view__column__item {
    line-height: 34px !important;
  }

  /deep/ .u-picker {
    height: 500rpx;
  }

  .btn_box {
    display: flex;
    justify-content: space-around;

    /deep/ .u-button--square {
      margin: 20rpx;
    }
  }
</style>