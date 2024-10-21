<template>
  <view class="hrv">
    <view style="text-align: center;">
      <image src="https://ecg.mindyard.cn:84/uploadPath/tips/BMI.png" style="width: 95%;height: 440rpx;"></image>
    </view>
    <view class="hrv-title">BMI是什么</view> <br>
    <view class="hrv-content">
      <view style="margin-left: 20rpx;">BMI最初是1830年代由一位比利时的统计学家Adolphe Quetelet，为了研究人类生长的趋势而发明的公式，“当时这位统计学家对于肥胖问题并不感兴趣”，他只是发现，人类身体的生长似乎有一个规律，就是身高越高的人体重也有越重的潜力，而用这条公式可以大致描述这个现象。
</view>
      <view style="margin-left: 20rpx;">
        直到上个世纪的九零年代，世界卫生组织拿这个指标当作人类身材的“分级标准”，BMI才被广泛用于判断过胖或过瘦，并且更进一步被用来研究身材和各种慢性病的相关性，而各种机关团体、保险公司、军警单位也纷纷采用BMI来衡量一个人是否健康。</view>
    </view>
    <view class="service">
      <view class="hrv-title">
        BMI怎么算？
      </view>
      <view class="science-stitle">
        <view class="ss-content">
          具体计算方法：体重(公斤/kg)除以身高 (米/m)的平方，即：体质指数（BMI）=体重（kg）÷身高^2（m）
        </view>
      </view>
    </view>

    <view class="hrv-title" style="margin-top: 20rpx;">
      BMI全世界都通用一个标准吗？No！
    </view>
    <view class="science-stitle">
      <view class="ss-content">
        亚洲人和欧美人属于不同人种，亚洲人体格偏小，用肥胖的世界标准来衡量就不适宜。比如日本人当BMI为24．9时，高血压危险就增加3倍；香港地区的中国人，BMI在23．7时死亡率最低，越高时便开始上升。专家们认为，亚洲人的肥胖标准应该是BMI在18．5－22．9时为正常水平，BMI大于23为超重，BMI大于25为肥胖。中国肥胖问题工作组的研究表明：体重指数增高，冠心病和脑卒中发病率也会随之上升，超重和肥胖是冠心病和脑卒中发病的独立危险因素。体重指数每增加2，冠心病、脑卒中、缺血性脑卒中的相对危险分别增加15.4%、6.1%和18.8%。 一旦体重指数达到或超过24时，患高血压、糖尿病、冠心病和血脂异常等严重危害健康的疾病的概率会显著增加。而中国人与其他亚洲人体格又有不同。所以，WHO的标准不是非常适合中国人的情况，为此，我国也制定了中国参考标准：
      </view>
      <view style="text-align: center;">
        <image src="https://ecg.mindyard.cn:84/uploadPath/tips/BMIzhi.jpg" style="width: 95%;height: 440rpx;"></image>
      </view>
    </view>


    <view class="hrv-title" style="margin-top: 20rpx;">
      BMI作用
    </view>
    <view class="science-stitle">
      <view class="ss-content" style="text-indent: 1em;">
        BMI指数，对于大部分普通人群来说，可以作为我们体重控制的参考标准，通过身高，可以计算出标准体重范围，结合自己的实际情况，制定体重控制计划。
      </view>
    </view>
  </view>
</template>

<script>

  export default {

    data() {
      return {

        list11: [{
            btitle: '1.概要',
            content: [{
                id: 'a.',
                detail: '健康心脏的跳动有一定的“不规律性”，HRV就是用来描述这种不规律性的。'
              },
              {
                id: 'b.',
                detail: '心跳的不规律性是由自主神经主导的;因此，HRV能够反映神经系统的健康。'
              },
              {
                id: 'c.',
                detail: '通常来说HRV越高越好。高HRV代表更好的心血管功能和抗压能力，而低HRV意味着更高的焦虑抑郁风险，以及更高的心血管疾病的死亡率。'
              },
              {
                id: 'd.',
                detail: '压力过大、情绪波动、睡眠不良、某些药物和食物，都可能降低HRV。'
              },
              {
                id: 'e.',
                detail: '持续锻炼，特别是耐力训练，能够改善HRV水平使HRV升高。'
              }
            ]
          },
          {
            btitle: '2.HRV什么?',
            content: [{
              text1: '心脏的不规律跳动。比如说一分钟的测量有60的心率，这并不是说心脏每秒跳动一次，可能是在跳动间隔在1秒内上下浮动，小于一秒或大于一秒，平均下来每秒跳一下。',
              text2: '恰好HRV和心跳的不规律性有重大关系。心跳规律跳动，HRV相对较低;心跳不规律跳动，HRV相对较高。在一般情况下，HRV越高越好。因为心跳的不规律性是由自主神经所控制的。人体中的自主神经调控着身体中不受人主观控制的功能，包括心跳、呼吸、血压和消化。自主神经分为两种，用于“战斗或逃跑”的交感神经、用于“放松或消化”的副交感神经。可以通过HRV的高低，判断出自主神经所处的状态。在“战斗或逃跑”的交感神经主导的模式下，HRV会较低。在“放松或消化”的副交感神经主导的模式下，HRV会更高一些。较低的HRV水平，更容易焦虑且抑郁发病率风险和心血管疾病死亡率更高。而较高的HRV水平，绝大多数人的心血管功能和抗压能力会更强。'
            }]
          },
          {
            btitle: '3.如何监测HRV?',
            content: [{
              text: '可以经常使用检测设备，记录检测情况，每个厂家的设备有他们不同的心率变异性指标。迈雅云选用的是RMSSD，需要注意的是正常人与经常运动的人的心率变异性指数是不一样的，正常人群的正常值参考范围是20~89ms，而经常运动的人群参考范围为13~107ms。生活中有许多因素会影响到HRV，所以它没有一个绝对标准的指标。所以最有用的还是经常测量，周期性的与自己的HRV水平进行比较。'
            }]
          },
          {
            btitle: '4.影响HRV的因素有哪些?HRV的作用?',
            content: [{
              text1: '环境因素，比如压力，导致处于交感神经模式，会降低HRV。压力过大、情绪波动、没有睡好。此外，吸烟、饮酒和一些药物也可能会让HRV降低。如果HRV出现了连续的骤降，有时会是患病的前兆，这提醒着你需要注意休息。吃得很合适、睡得比较好、或进行了适当的耐力训练，可能会让HRV升高。总的来说，HRV能帮助你了解身体的健康状况。',
              text2: '在以下三种时期下，HRV可能会派上更大的用场',
              datas: [{
                  id1: '1.情绪不稳定期',
                  detail: '如果你觉得自己的情绪不太稳定，那么监测HRV可能有重要的意义。在一项纳入183名研究生的研究发现，静息HRV更低的人更难调节自己的情绪，这些人的具体表现有两个:1.无法很好地辨别情绪，即是说，无法说清自己感受到的是什么情绪，也不知道为什么会有这样的感受。2.无法很好地控制冲动，常常表现为一触即怒。所以，当你的HRV降低时，你可以检查下，自己是否存在情绪上的问题。知道问题的源头，才会有解决问题的方向。当自己做出了相应的改变，HRV重新回升时，说明你的情绪问题得到了改善，你的方向是对的。'
                },
                {
                  id1: '2.锻炼期',
                  detail: '如果处于正在锻炼或有长期运动的习惯，HRV的监测也能帮助更好地规划训练。当HRV比较高时，比较适合去做高强度的训练；当你的HRV比较低时，比较适合去做强度相对较低的训练。所以检测HRV能够防止你过度训练、减少你的受伤风险，让你能持续保持高水平的发挥。'
                },
                {
                  id1: '3.调整饮食期',
                  detail: '如果你正在调整饮食，HRV也能告诉你是否朝着正确的方向。由于脑肠轴的存在，你吃的食物能够影响你的大脑。食物对大脑功能、认知和情绪的改善，最终能够反映在HRV这一指标上。你可以通过观察HRV的变化，来了解你的饮食方案是否合适。'
                }
              ]

            }]
          },
          {
            btitle: '5.怎样提升HRV的水平?',
            content: [{
              text: 'HRV的水平是一个能反映全身健康的指标，而要提升HRV的水平，意味着整体健康的改善。提升HRV水平，有4个方面需要注意，分别是压力、睡眠、饮食、运动。应对压力，跑步，冥想和深呼吸训练，听音乐等都是很好的办法。研究也发现，练习瑜伽能够有效地提升HRV的水平。'
            }]
          },

        ],
    

      }
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .science {
    margin-top: 20rpx;

  }

  .engText {
    font-weight: 700;
    margin-right: 5rpx;
    text-align: left;
  }

  .science-stitle {
    font-size: 32rpx;
    font-weight: 700;
    width: 92%;
    margin: auto;
    text-align: justify;
    margin-top: 20rpx;
    text-indent: 1em;
  }

  .ss-content {
    font-weight: 400;
    font-size: 28rpx;
    line-height: 45rpx;
  }

  .hrv {
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 30rpx;
    padding-top: 20rpx;
    padding-bottom: 20rpx;
  }

  .hrv-title {
    font-weight: 700;
    margin-left: 10rpx;
    border-left: 10rpx solid #27A2F2;
    border-radius: 10rpx;
    padding-left: 10rpx;
    font-size: 36rpx;
  }

  .hrv-content {
    width: 98%;
    margin: auto;
    font-size: 28rpx;
    text-align: justify;
    margin-top: 10rpx;
    margin-bottom: 10rpx;
    line-height: 45rpx;
  }

  .hrv-content-item {
    font-weight: 700;
    margin-bottom: 9rpx;
    font-size: 32rpx;
    margin-right: 10rpx;
  }
</style>
