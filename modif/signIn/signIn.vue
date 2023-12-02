<template>
  <view class="container m20 w95 card">
    <u--form :model="userInfo" ref="uForm" :rules="rules">
      <u-form-item :required="true" label="姓名" borderBottom prop="name">
        <u-input placeholder="请输入姓名" v-model="userInfo.name" border="none" />
      </u-form-item>
      <u-form-item :required="true" label="证件号码" borderBottom prop="idCard">
        <u-input placeholder="请输入身份证号码" type="number" maxlength="18" v-model="userInfo.idCard" border="none" />
      </u-form-item>

      <u-form-item :required="true" @click="openBirth" label="出生日期" prop="birth" borderBottom>
        <u--input v-model="userInfo.birth" disabled disabledColor="#ffffff" placeholder="请选择生日" border="none">
        </u--input>
        <u-icon slot="right" name="arrow-right"></u-icon>
      </u-form-item>

      <u-form-item :required="true" @click="showSex = true" label="性别" prop="sex" borderBottom>
        <u--input v-model="userInfo.sex" disabled disabledColor="#ffffff" placeholder="请选择性别" border="none">
        </u--input>
        <u-icon slot="right" name="arrow-right"></u-icon>
      </u-form-item>
      <picker :value="multiIndex" :range="heightColumns" @change="heightChange">
        <u-form-item :required="true" label="身高" prop="height" borderBottom>
          <u--input v-model="userInfo.height" disabled disabledColor="#ffffff" placeholder="请选择身高" border="none">
          </u--input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </picker>

      <picker :value="multiIndex1" :range="weightColumns" @change="weightChange">
        <u-form-item :required="true" label="体重" prop="weight" borderBottom>
          <u--input v-model="userInfo.weight" disabled disabledColor="#ffffff" placeholder="请选择体重" border="none">
          </u--input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </picker>
      <!-- 地址选择 -->
      <u-form-item label="地址" borderBottom prop="address">
        <u-input placeholder="请输入省市县" type="text" v-model="userInfo.address" border="none" />
      </u-form-item>
      <u-form-item label="既往病史" borderBottom>
        <u--textarea v-model="userInfo.medical" placeholder="请输入既往病史" autoHeight></u--textarea>
      </u-form-item>
      <u-form-item label="过敏史">
        <u--textarea v-model="userInfo.allergy" placeholder="请输入过敏史" autoHeight></u--textarea>
      </u-form-item>
    </u--form>
    <!-- 性别选择 -->
    <u-action-sheet :show="showSex" :actions="actions" title="请选择性别" @close="showSex = false" @select="sexSelect"
      :safeAreaInsetBottom="true">
    </u-action-sheet>
    <!-- 生日选择 -->
    <u-datetime-picker ref="dateTime" :show="showBirth" itemHeight="100" @cancel="showBirth = false"
      @confirm="confirmBirth" mode="date" :minDate="-2208988800000">
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
  import {
    initUserInfo,
    getUserInfoByCode
  } from '@/request/request.js'
  export default {
    data() {
      const valiIdCard = (rule, value, callback) => {
        uni.$u.test.idCard(value) ? callback() : callback(new Error('请输入正确的身份证号'))
      }
      return {
        userInfo: {
          name: '',
          sex: '',
          idCard: '',
          height: '',
          weight: '',
          medical: '',
          birth: '',
          allergy: '',
          address: ''
        },
        multiIndex: 159,
        multiIndex1: 49,
        // 身高数组
        heightColumns: [],
        weightColumns: [],
        // 跳转的url
        url: '',
        // 是否弹出性别选择
        showSex: false,
        // 日期选择
        showBirth: false,

        // 校检规则
        rules: {
          name: [{
              type: 'string',
              required: true,
              message: '请填写姓名',
              trigger: ['blur', 'change']
            }, // 正则判断为字母或数字
            {
              pattern: /^[\u4e00-\u9fa5]+$/,
              // 正则检验前先将值转为字符串
              transform(value) {
                return String(value);
              },
              message: '姓名只能是中文'
            },
          ],
          birth: {
            type: 'string',
            required: true,
            message: '请选择出生日期',
            trigger: ['blur', 'change']
          },
          address: {
            type: 'string',
            message: '请选择地址',
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
              required: true,
              max: 18,
              message: '请输入身份证号',
              trigger: ['blur', 'change']
            },
            {
              // 自定义验证函数
              validator: valiIdCard,
              message: '身份证号码不正确',
              trigger: ['change', 'blur'],

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
    onReady() {
      this.$refs.uForm.setRules(this.rules);
    },
    onLoad(option) {
      if (option.url) {
        this.url = option.url
      }
      for (let i = 1; i <= 200; i++) {
        this.heightColumns.push(`${i}cm`)
      }
      for (let j = 1; j <= 200; j++) {
        this.weightColumns.push(`${j}kg`)
      }
      // 如果本地有身份证代表用户有信息
      if (uni.getStorageSync('idCard')) {
        this.getUserInfo()
      }
      console.log('身份证是', uni.getStorageSync('idCard'));
    },
    methods: {
      // 选择性别
      sexSelect(e) {
        this.userInfo.sex = e.name
      },
      // 打开日期
      openBirth() {
        this.showBirth = true
        if (this.userInfo.birth) {
          this.$refs.dateTime.innerValue = new Date(this.userInfo.birth).getTime()
        } else {
          this.$refs.dateTime.innerValue = new Date('1970-01-01').getTime()
        }
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
      // 初始化用户数据
      async getUserInfo() {
        const res = await getUserInfoByCode(uni.getStorageSync('idCard'))
        console.log(res);
        if (res.code === 200) {
          this.userInfo.name = res.data.patientName
          this.userInfo.address = res.data.patientAddress
          this.userInfo.birth = res.data.birthDay
          this.userInfo.height = res.data.patientHeight + 'cm'
          this.multiIndex = Number(res.data.patientHeight - 1)
          this.userInfo.weight = res.data.patientWeight + 'kg'
          this.multiIndex1 = Number(res.data.patientWeight - 1)
          this.userInfo.idCard = res.data.patientCode
          this.userInfo.sex = res.data.patientSex == 1 ? '男' : '女'
          this.userInfo.allergy = res.data.allergies
          this.userInfo.medical = res.data.patientMedicalHistory
        }
      },
      submit() {
        // 表单验证
        this.$refs.uForm.validate().then(async res => {
          // 解构赋值
          const {
            name,
            sex,
            idCard,
            height,
            weight,
            medical,
            birth,
            allergy,
            address
          } = this.userInfo
          // 组织信息用于提交表单
          const obj = {
            patientName: name,
            patientSex: sex === '男' ? 1 : 0,
            patientHeight: parseFloat(height.replace('cm', '')),
            patientWeight: parseFloat(weight.replace('kg', '')),
            birthDay: birth,
            patientMedicalHistory: medical ? medical : '',
            patientCode: idCard,
            allergies: allergy ? allergy : '',
            patientAddress: address ? address : '',
            patientPhone: uni.getStorageSync('phone')
          }
          const result = await initUserInfo(obj)
          console.log(result);
          if (result.code === 200) {
            uni.$showMsg('提交成功')
            uni.setStorageSync('idCard', this.userInfo.idCard)
            uni.redirectTo({
              url: this.url
            })
          }
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
        this.userInfo.address = ''
        this.userInfo.medical = ''
        this.userInfo.allergy = ''
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

  // /deep/ .u-picker__view__column {
  //   height: 280rpx !important;
  // }

  // /deep/ .u-picker__view__column__item {
  //   line-height: 34px !important;
  // }

  // /deep/ .u-picker {
  //   height: 500rpx;
  // }

  .btn_box {
    display: flex;
    justify-content: space-around;

    /deep/ .u-button--square {
      margin: 20rpx;
    }
  }
</style>