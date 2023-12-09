<template>
  <view>
    <u-toast ref="uToast"></u-toast>
    <u-loading-page loading-text="加载中..." :loading="showLoading" icon-size="80" font-size="40" color="#b3b4b5"
      loading-color="#09f"></u-loading-page>
    <view class="p20" style="line-height: 1.9;">
      <view class="card p20 boxSing" style="width: 100%;font-size: 33rpx;">
        <!-- <view class="title"></view>
        <view class="header"></view>
        <u-gap height="10" bgColor="#fff"></u-gap>
        <u-line dashed color="#ccc"></u-line>
        <u-gap height="15" bgColor="#fff"></u-gap> -->
        <!-- 循环遍历出问卷 -->
        <view class="m20" v-for="(item,i) in list" :key="i">
          <view class="m20"><text style="color: #e35958;">*</text>{{item.label}}</view>
          <view class="textarea_box p_10_20">
            <u--textarea count v-model="item.value" placeholder="请输入内容" autoHeight></u--textarea>
          </view>
        </view>
        <!-- <view class="p20"> -->
        <u-button text="提交问卷" color="#09f" shape="circle" @click="submit" v-if="list.length !== 0"></u-button>
        <!-- </view> -->
      </view>
    </view>

  </view>
</template>

<script>
  import {
    getSurveyDetailById,
    upLoadSurvey
  } from '@/request/request.js'
  export default {
    data() {
      return {
        // 问卷的id
        id: '',
        title: '',
        list: [],
        showLoading: true
      };
    },
    onLoad(option) {
      this.id = option.id
      this.title = option.title
      this.initList()
    },
    onReady() {
      uni.setNavigationBarTitle({
        title: this.title
      });
    },
    methods: {
      // 请求问卷内容
      async initList() {
        const vuePro = this
        const res = await getSurveyDetailById(this.id)
        console.log(res);
        if (res.code === 200) {
          let tempArr = JSON.parse(res.data.jsonData)
          for (let i = 0; i < tempArr.length; i++) {
            tempArr[i].value = ''
          }
          this.list = tempArr
          setTimeout(() => {
            vuePro.showLoading = false
          }, 300)
        }
      },
      // 提交问卷内容
      async submit() {
        // 问卷非空判断
        for (let i = 0; i < this.list.length; i++) {
          if (!this.list[i].value) {
            return this.$refs.uToast.show({
              message: '还有内容未填写',
              type: 'warning',
              position: 'top',
              duration: 1000
            })
          }
        }
        const res = await upLoadSurvey({
          questionnairePatientId: this.id,
          answer: JSON.stringify(this.list)
        })
        console.log(res);
        if (res.data) {
          this.$refs.uToast.show({
            message: '提交成功',
            type: 'warning',
            position: 'top',
            duration: 1000,
            complete() {
              uni.switchTab({
                url: '/pages/index/index'
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    font-size: 38rpx;
    color: #09f;
    text-align: center;
  }

  .header {
    margin-bottom: 20rpx;
  }


  /deep/ .u-textarea {
    padding: 0 !important;
  }

  /deep/ .u-textarea__field {
    height: 50px !important;
    background-color: #f2f4f6;
    border-radius: 15rpx;
    padding: 20rpx;
  }

  /deep/ .u-icon__icon--warning {
    font-size: 38rpx !important;
  }
</style>