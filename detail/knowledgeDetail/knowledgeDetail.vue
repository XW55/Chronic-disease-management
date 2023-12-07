<template>
  <view>
    <u-toast ref="uToast"></u-toast>
    <!-- 渲染知识内容 -->
    <view class="content">
      <u-parse v-if="content.articleText" :content="content.articleText" :selectable="true"></u-parse>
    </view>
    <!-- 占位 -->
    <view style="width: 100%;height: 130rpx;"></view>
    <!-- 底部固定栏 -->
    <view class="footer boxSing">
      <view class="flexBox right">
        <view class="iconfont icon-browse" style="color:#000;"></view>
        <text>{{content.readNum || 0}}</text>
      </view>
      <view class="flexBox right" v-if="content.isCollect === '1' || !content.isCollect" @click="updateCollect(true)">
        <!-- 未收藏按钮 点击收藏 -->
        <view class="iconfont icon-shoucang" style="color:#000;"></view>
        <view>收藏</view>
      </view>
      <!-- 已收藏 点击取消 -->
      <view class="flexBox right" v-else @click="updateCollect(false)">
        <view class="iconfont icon-shoucangxuanzhong" style="color: #09f;"></view>
        <view style="color: #09f;">已收藏</view>
      </view>
      <view class="tip">{{content.collectNum || 0}}人已收藏</view>
    </view>
  </view>

  </view>
</template>

<script>
  import {
    getknowDetail,
    addCollect,
    getRead,
    delCollect
  } from '@/request/request.js'
  export default {
    data() {
      return {
        // 知识id
        pageId: '',
        // 内容标题
        title: '',
        // 知识列表对象
        content: null,
      };
    },
    onLoad(option) {
      this.pageId = option.id
      this.title = option.title
      this.getDetail()
      this.getReadNum()
    },
    onShow() {

    },
    // 设置知识专题
    onReady() {
      uni.setNavigationBarTitle({
        title: this.title
      });
    },
    methods: {
      // 根据id请求具体的知识详情
      async getDetail() {
        const res = await getknowDetail(this.pageId)
        // console.log(res);
        if (res.code === 200) {
          this.content = res.data
        }
      },
      // 文章的阅读数量
      async getReadNum() {
        const res = await getRead({
          propagandaId: this.pageId
        })
        console.log('数量', res);
      },
      // 收藏/取消收藏
      async updateCollect(flag) {
        // 进行的是收藏操作
        if (flag) {
          const res = await addCollect({
            propagandaId: this.pageId
          })
          console.log('用户收藏', res);
          if (res.code === 200) {
            this.content.collectNum += 1
            this.content.isCollect = '0'
            this.$refs.uToast.show({
              message: '收藏成功',
              type: 'success',
              position: 'top',
              duration: 1000
            })
          }
        } else {
          const res = await delCollect({
            propagandaId: this.pageId
          })
          console.log('用户取消收藏', res);
          if (res.code === 200) {
            if (this.content.collectNum >= 1) {
              this.content.collectNum -= 1
            }
            this.content.isCollect = '1'
            this.$refs.uToast.show({
              message: '取消收藏',
              type: 'warning',
              position: 'top',
              duration: 1000
            })

          }
        }
      }
    }
  }
</script>

<style>
  page {
    background-color: #fff;
  }
</style>
<style lang="scss" scoped>
  .content {
    padding: 20rpx;
    text-align: justify;
    font-size: 32rpx;
    line-height: 1.8;
  }

  .iconfont {
    margin: 0 5rpx;
    font-size: 50rpx;
  }

  .right {
    margin-right: 30rpx;
  }

  .footer {
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    border-top: 1rpx solid #ccc;
    justify-content: flex-end;
    position: fixed;
    bottom: 0;
    padding: 20rpx 30rpx 40rpx 30rpx;
  }

  .tip {
    font-size: 25rpx;
    color: #333;
    margin-top: 12rpx;
  }
</style>