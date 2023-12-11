<template>
  <view class="">
    <view class="img_box" v-if="showBlood">
      <!-- <u-swipe-action style="width: 100%;">
        <u-swipe-action-item :options="options" v-for="(item,index) in recordsArr" :key="item.bloodId"
          @click.stop="delBypId(item.bloodId)"> -->
      <!-- @click.stop="delBypId(item.bloodId)" -->
      <view style="margin:10rpx 0;" v-for="(item,index) in recordsArr" :key="item.bloodId">
        <view class="img_item card" @click="gotoFaceRes(item,true)">
          <view class="img_item_content">
            <view class="left">
              <view class="img_item_content_top">
                <view class="">姓名：{{item.patient.patientName}}</view>
                <view class="">性别:{{item.patient.patientSex == '1' ? '女' : '男'}}</view>
              </view>
              <view class="">时间：{{strToDate(item.createTime)}}</view>
            </view>
            <view class="icon-list">
              <text class="">收缩压：{{item.hp}}</text>
              <text class="">舒张压：{{item.bp}}</text>
              <text class="">脉搏：{{item.lp}}</text>
            </view>
            <view class="">
              <u-icon name="arrow-right" size="30"></u-icon>
            </view>
          </view>
        </view>
      </view>
      <!-- </u-swipe-action-item>
      </u-swipe-action> -->
    </view>
    <view class="img_box" v-else>
      <!--      <u-swipe-action style="width: 100%;">
        <u-swipe-action-item :options="options" v-for="(item,index) in ecgArr" :key="item.pId"
          @click.stop="delEcgBypId(item.pId)"> -->
      <!-- @click.stop="delEcgBypId(item.pId)" -->
      <view style="margin:10rpx 0;" v-for="(item,index) in ecgArr" :key="item.pId">
        <view class="img_item card" @click="gotoFaceRes(item,false)">
          <view class="img_item_content" style="padding: 20rpx; font-size: 27rpx;">
            <view class="left">
              <view class="img_item_content_top">
                <view class="">
                  心电类型：{{item.ecgType}}
                </view>
              </view>
              <view class="">采集时间：{{item.connectionTime}}</view>
            </view>
            <view class="">
              <u-icon name="arrow-right" size="30"></u-icon>
            </view>
          </view>
        </view>
      </view>
      <!--        </u-swipe-action-item>
      </u-swipe-action> -->
    </view>

  </view>
</template>

<script>
  import {
    strToDate
  } from '@/tools/tool.js'
  export default {
    props: {
      recordsArr: {
        type: Array,
        default: function() {
          return []
        }
      },
      showBlood: {
        type: Boolean,
        default: true
      },
      ecgArr: {
        type: Array,
        default: function() {
          return []
        }
      },
    },
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#f56c6c'
          }
        }],
      }
    },
    methods: {
      strToDate,
      // 图片详情
      gotoFaceRes(item, flag) {
        if (flag) {
          uni.navigateTo({
            url: '../../myListPage/pages/bpResult/bpResult?id=' + item.bloodId
          })
        } else {
          uni.navigateTo({
            url: '../../pageCheck/ecgResult/pages/detail?id=' + item.pId
          })
        }
      },
      // 删除对应的列
      delBypId(id) {
        const vuePro = this
        uni.showModal({
          title: '提示',
          content: '确定删除吗',
          success: async function(res) {
            if (res.confirm) {
              const {
                data: result
              } = await uni.$http.delete('/connect_patient/delById?pId=' + id)
              console.log(result);
              if (result.code === 200) {
                uni.$showMsg('删除成功')
                // 向父组件发送被删除id进行删除操作
                vuePro.$emit('delBypId', id)
              }
            } else {
              return
            }
          }
        })
      },
      delEcgBypId(id) {
        const vuePro = this
        uni.showModal({
          title: '提示',
          content: '确定删除吗',
          success: async function(res) {
            if (res.confirm) {
              const res = await
              console.log(result);
              if (result.code === 200) {
                uni.$showMsg('删除成功')
                // 向父组件发送被删除id进行删除操作
                vuePro.$emit('delEcgBypId', id)
              }
            } else {
              return
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .img_box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10rpx 20rpx;


    .img_item {
      width: 700rpx;
      height: 150rpx;
      border: 2rpx solid #ccc;
      display: flex;
      align-items: center;

      .img_item_content {
        padding: 0 18rpx;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 30rpx;


        .left {
          height: 150rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
        }

        .img_item_content_top {
          display: flex;
          justify-content: space-between;
        }

        .img_item_container {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }

  .icon-list {
    display: flex;
    justify-content: space-between;
    font-size: 25rpx;
    flex-wrap: wrap;
    width: 150rpx;
  }
</style>