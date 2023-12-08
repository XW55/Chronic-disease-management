<template>
  <view class="tip">
    <view style="text-align: center;">

      <image src="https://ecg.mindyard.cn:84/uploadPath/tips/heart_wave.png" style="width: 95%;height:700rpx;"></image>
    </view>
    <text class="tip-title"> 心电图概念</text>
    <view class="tip-content" style="margin-bottom: 20rpx;width: 98%;margin: auto;text-align: justify;">
      <text
        style="margin-left: 20rpx;">心电图是一种记录心脏电活动的方法，通过记录心电图波形，医生可以评估心脏的泵血功能和健康状况，并诊断心脏疾病。心电图记录了心脏每一心动周期所经历的电信号变化。</text>
    </view>
    <view v-for="(item,index) in list" :key="index" style="margin-top: 20rpx;">
      <text class="tip-title"> {{item.title}}</text>
      <view v-if="index==0"><text style="font-size: 25rpx;margin-left: 30rpx;">(分别是P波、QRS波群、T波和U波)</text> <br></view>
      <view class="tip-content" v-for="(item1,index1) in list[index].data" :key="index">
        <text><text class="tip-content-item">{{item1.title}}</text>{{item1.content}}</text> <br>
      </view>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        list: [{
            title: '心脏有四个主要的心电图波形',
            data: [{
                title: '(1) P波: ',
                content: '又称心房除极波，代表左右二心房的激动，临床上为了实用期间，P波前部代表右心房的激动，后部代表右心房的激动。'
              },
              {
                title: '(2) QRS波群: ',
                content: '包括三个紧密相连的波，第一个向下的波称为Q波，继Q波后的一个高尖的直立波称为R波，R波后向下的波称为S波。因其紧密相连，且反映了心室电激动过程，故统计为QRS群。这个波群反映了左、右两心室的除极过程。'
              },
              {
                title: '(3) T波: ',
                content: 'T波位于S-T段之后，是一个比较低而占时较长的波，它是心室复极所产生的。代表心脏的舒张期，记录了心脏在舒张期时电活动的最高点'
              },
              {
                title: '(4) U波: ',
                content: 'U波是T波后的一段小波，是近年来慢慢重视起来的一种波形，对诊断心脏疾病有大作用。'
              }
            ]
          },
          {
            title: '正常心电图各段波值的正常范围和意义',
            data: [{
                title: '(1) P波: ',
                content: '呈圆形，可有轻微切迹。P波宽度不超过0.11秒，振幅不超过0.25毫伏'
              },
              {
                title: '(2) PR间期: ',
                content: '即由P波起点到QRS波群起点间的时间。一般成人P-R间期为0.12~0.20秒。P-R间期随心率与年龄而变化，年龄越大或心率越慢，其PR间期越长。P-R间期延长常表示激动通过房室交界区的时间延长，说明有房室传导障碍，常见于房室传导阻滞等。'
              },
              {
                title: '(3) QRS波群: ',
                content: '代表两心室除极和最早期复极过程的电位和时间变化。QRS波群时间正常成人为0.06~0.10秒，儿童为0.04~0.08秒。QRS波群时间或室壁激动时间延长常见于心室肥大或心室内传导阻滞等。QRS波群代表心脏的整个周期，记录了心脏有氧舒张期和收缩期的心电活动'
              },
              {
                title: '(4) S-T段: ',
                content: '自QRS波群的终点(J点) 至T波起点的一段水平线称为S-T段。正常任一导联S-T向下偏移都不应超过0.05毫伏。超过正常范围的S-T段下移常见于心肌缺血或劳损。正常S-T段向上偏移，在肢体导联及心前导联V4~V6不应超过0.1毫伏，心前导联V1~V3不超过0.3毫伏，S-T 上移超过正常范围多见于急性心肌梗塞、急性心包炎等。'
              },
              {
                title: '(5) T波: ',
                content: 'T波钝圆，占时较长，从基线开始缓慢上升，然后较快下降，形成前肢较长、后肢较短的波形。T波方向常和QRS波群的主波方向一致。在I、II、V4-6导联直立aVR导联倒置。其他导联可直立、双向或倒置。如果V1直立，V3不能倒置。在以R波为主导联中，T波的振幅不应低于同导联R波的1/10，心前导联的T波可高达1.2~1.5毫伏。在QRS波群主波向上的导联中，T波低平或倒置，常见于心肌缺血、低血钾等。'
              },
              {
                title: '(6) Q-T间期: ',
                content: 'Q-T间期同心率有密切关系。心率越快，Q6T间期越短;反之，则越长。一般心率70次/分左右时，Q-T间期约为0.40秒。一般可查表。凡Q-T间期超过正常最高值0.03秒以上者称显著延长，不到0.03秒者称轻度延长。Q-T间期延长见于心动过缓、心肌损害、心脏肥大、心力衰竭低血钙、低血钾、冠心病、Q-T间期延长综合征、药物作用等。Q-T间期缩短见于高血钙、洋地黄作用、应用肾上腺素等'
              }
            ]
          }
        ]
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .tip {
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 30rpx;
    padding-top: 20rpx;
    padding-bottom: 20rpx;
  }

  .tip-title {
    font-weight: 700;
    margin-bottom: 20rpx;
    margin-left: 10rpx;
    border-left: 10rpx solid #27A2F2;
    border-radius: 10rpx;
    padding-left: 10rpx;
    font-size: 32rpx;
  }

  .tip-content {
    width: 98%;
    margin: auto;
    font-size: 28rpx;
    text-align: justify;
    margin-top: 10rpx;
    margin-bottom: 10rpx;
  }

  .tip-content-item {
    font-weight: 700;
    margin-bottom: 9rpx;
    font-size: 32rpx;
    margin-right: 10rpx;
  }
</style>