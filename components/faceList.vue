<template>
  <view class="">
    <!-- 社区版不展示滑块操作 -->

    <!-- <view class="img_box" v-if="isCommunity">
      <view :options="options" v-for="(item,index) in recordsArr" :key="item.pid">
        <view class="img_item card" @click="gotoFaceRes(item)">
          <view class="img_item_content">
            <view class="">
              <view class="img_item_content_top">
                <view style="white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;">姓名：{{item.patient.patientName}}</view>
                <view class="">性别：{{item.patient.patientSex}}</view>
              </view>
              <view class="">时间：{{item.createTime}}</view>
            </view>
            <view class="icon-list">
              <text class="iconfont icon-mian" v-if="!!item.faceImg"></text>
              <text class="iconfont icon-mai" v-if="!!item.patientBlood"></text>
              <text class="iconfont icon-xin" v-if="!!item.patientManagement"></text>
            </view>
            <view class="">
              <u-icon name="arrow-right" size="25"></u-icon>
            </view>
          </view>
        </view>
      </view>
    </view> -->
    <!-- v-else -->
    <view class="img_box">
      <u-swipe-action style="width: 100%;">
        <u-swipe-action-item :options="options" v-for="(item,index) in recordsArr" :key="item.pid"
          @click.stop="delBypId(item.pid)">
          <view class="img_item card" @click="gotoFaceRes(item)">
            <!-- <image :src="item.frontImg"></image> -->
            <view class="img_item_content">
              <view class="">
                <view class="img_item_content_top">
                  <view class="">姓名：{{item.patient.patientName}}</view>
                  <view class="">性别:{{item.patient.patientSex == '1' ? '男' : '女'}}</view>
                </view>
                <view class="">时间：{{strToDate(item.createTime)}}</view>
              </view>
              <view class="icon-list">
                <text class="">高压：{{item.hp}}</text>
                <text class="">低压：{{item.bp}}</text>
                <text class="">脉搏：{{item.lp}}</text>
              </view>
              <view class="">
                <u-icon name="arrow-right" size="25"></u-icon>
              </view>
            </view>
          </view>
        </u-swipe-action-item>
      </u-swipe-action>
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
      isCommunity: {
        type: Boolean,
        default: false
      }
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
      gotoFaceRes(obj) {
        if (obj.faceImg) {
          let faceResFlag = obj.faceImg.frontImgData ? false : true
          uni.navigateTo({
            url: '/subpkg/pages/recordsResult/recordsResult?id=' + obj.pid + '&noFaceRes=' + faceResFlag
          })
        } else {
          uni.navigateTo({
            url: '/subpkg/pages/recordsResult/recordsResult?id=' + obj.pid
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
        margin: 20rpx 0;

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
    width: 120rpx;
  }
</style>