<template>
  <view class="hrv">
    <view style="text-align: center;">
      <image src="https://ecg.mindyard.cn:84/uploadPath/tips/whatHRV.png" style="width: 95%;height: 440rpx;"></image>
    </view>
    <view class="hrv-title"> 心率变异性(HRV)概念</view> <br>
    <view class="hrv-content">
      <view style="margin-left: 20rpx;">心率变异性(HRV,Heart Rate
        Variablity)是指连续心跳周期差异的变化情况，它含有神经、体液等因素对心血管系统调节的信息，从而参考其可以对心血管等疾病病情进行判断和预防，临床医学上认为HRV是预测心源性猝死和心律失常的重要指标之一。</view>
      <view style="margin-left: 20rpx;">
        常用的HRV指标有RMSSD、SDNN、PNN50等。本系统选用的是RMSSD，该标准下，正常人群的参考范围是20-89ms，经常运动的人群参考范围是13-107ms</view>
    </view>
    <view class="service">
      <view class="hrv-title">
        易懂科普
      </view>
      <view class="science-stitle" v-for="(item,index) in list1" :key='index'>
        {{item.btitle}}
        <view class="ss-content" v-for="(item1,index1) in list1[index].content" :key='index1'>
          <view v-if="index==0">
            <text><text style="font-weight: 700;">{{item1.id}}</text> {{item1.detail}}</text>
          </view>
          <view v-else-if="index==1">
            <view>{{item1.text1}}</view>
            <image src="https://ecg.mindyard.cn:84/uploadPath/tips/HRV.png" style="width: 100%; height: 200rpx;">
            </image>
            <view>{{item1.text2}}</view>
          </view>
          <view v-else-if="index==2||index==4">
            {{item1.text}}
          </view>
          <view v-else-if="index==3">
            {{item1.text1}}
            <text style="color: #208acc; ">{{item1.text2}}</text>
            <view v-for="(item2,index2) in list1[index].content[0].datas" :key='index2'>
              <text style="font-size: 26rpx; font-weight: 700;">{{item2.id1}}</text> <br>
              <text>{{item2.detail}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="hrv-title" style="margin-top: 20rpx;">
      心率变异性(HRV)在临床中的应用:
    </view>
    <view class="science-stitle">
      <view class="ss-content" v-for="(item,index) in list2" :key="index">
        <view style="font-size: 29rpx; font-weight: 700;">{{item.title}}</view>
        <view v-for="(item1,index1) in item.content" :key="index1">
          <br><text style="font-weight: 700;font-size: 25rpx;">{{item1.id}}</text>{{item1.detail}}
        </view>

      </view>
    </view>


    <view class="hrv-title" style="margin-top: 20rpx;">
      参考文献:
    </view>
    <view class="science-stitle" style="text-indent: 0em;">
      <view class="ss-content engText">
        <view><text>•</text>O'Neal, Wesley T, et al."Reference ranges for
          short-termheart rate variability measures in individuals free ofcardiovascular disease: the Multi-Ethnic Study
          ofAtherosclerosis (MESA)." Journal of electrocardiology 49.5(2016):686-690</view>
        <view><text>•</text>Koskinen, Tuomas, et al."Short-term heart rate
          variability in healthy young adults:the Cardiovascular Risk in Young Finns Study."Autonomic Neuroscience
          145.1-2(2009):81-88.</view>
        <view><text>•</text>Kiss, Orsolya, et al."Detailed heart rate
          variabilityanalysis in athletes." Clinical Autonomic Research 26.4(2016): 245-252.</view>
        <view><text>•</text>Kim,H.G, Cheon, E.J., Bai, D.S, Lee, Y.H, &
          Koo, B.H.(2018). Stress and heart rate variability: A meta-analysisand review of the literature. Psychiatry
          investigation,15(3)235.</view>
        <view><text>•</text>Routledge, F.S, Campbell, T.S,
          McFetridge-Durdle, J. A& Bacon, S.L.(2010).mprovements in heart rate variabilitywith exercise therapy.
          Canadian Journal of Cardiology.26(6),303-312.</view>
        <view><text>•</text>Sengupta, P.(2012) Health impacts of yoga
          andpranayama: A state-of-the-art review.International journalof preventive medicine, 3(7), 444.</view>
        <view><text>•</text>Williams, D.P, Cash, C, Rankin, C., Bernardi,
          A, KoenigJ., & Thayer,J. F.(2015) Resting heart rate variabilitypredicts self-reported difficulties in emotion
          regulation: afocus on different facets of emotion regulation. Frontiers inpsychology, 6, 261.</view>
        <view><text>•</text>Young, H. A., & Benton, D.(2018).Heart-rate
          variability: abiomarker to study the influence of nutrition onphysiological and psychological health?.
          Behaviourapharmacology,29(2-),140.</view>
        <view><text>•</text>Zhong,J, Trevisi, L., Urch, B., Lin, X., Speck,
          M, Coull, B.A., ... & Koutrakis, P.(2017). B-vitamin supplementationmitigates effects of fine particles on
          cardiac autonomicdysfunction and inflammation: a pilot human interventiontrial. Scientific reports, 7, 45322.
        </view><br>
      </view>
    </view>
    <view class="hrv-title" style="margin-top: 20rpx;">
      重要声明:
    </view>
    <view class="science-stitle">
      <view class="ss-content" style="text-indent: 1em;">
        本文仅是用于信息的分享，仅供学习参考使用。内容不直接作为任何医疗干预的依据。在采取任何预防、治疗或治愈的措施之前，请先与你的医生进行沟通。
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        list1: [{
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
        list2: [{
            title: '1.在心血管疾病中的应用',
            content: [{
                id: '• 高血压:',
                detail: '高血压的发病机制较复杂，但交感神经功能亢进是其中的一个重要部分。尤其在疾病的早期阶段，LF比正常人高，而HF比正常人低;高血压患者LF的昼夜变化消失而HF夜间仍升高，提示交感一副交感中枢的调节机制欠佳。'
              },
              {
                id: '• 心肌梗死:',
                detail: '心肌梗死后30分钟常有交感神经张力亢进尤其前壁心肌梗死时，下壁心肌梗死可能是迷走神经张力亢进。如梗死患者用SD作为指标，发现普遍降低。在预后观察中如SDNN大于50ms的死亡率低，而SDNN小于50ms是SDNN大于等于100ms的5倍左右。'
              },
              {
                id: '• 心脏性猝死的预测:',
                detail: '心律失常性心脏性猝死中大部分是室性快速心律失常所致，HRV降低是副交感神经活性减弱，交感神经活性增强。降低室颤域值，所以HRV对检查心脏性猝死具有一定意义。'
              },
              {
                id: '• 冠心病:',
                detail: '冠心病患者HRV昼夜节律减弱，特别在凌晨5~6点时迷走神经兴奋突然变为交感神经激活时，LF增加，HF减少，LF/HF比值增大，此时血浆儿茶酚胺增高，心肌耗氧量也增加，可促发心脏意外事件发生，从而反映HRV与冠状动脉的缺血确有一定关联。'
              },
              {
                id: '• 充血性心力衰竭:',
                detail: '心力衰竭者常伴血浆儿茶酚胺升高，且与疾病的严重程度有关。衰竭时HRV降低，可能是交感活性增强、副交感活性减弱之故。'
              }
            ]
          },
          {
            title: '2.HRV在其他系统中的应用',
            content: [{
                id: '• 糖尿病:',
                detail: '时常伴有自主神经受损，分析HRV对自主神经受损可进行判断，通过HRV降低可对自主神经受损进行早期预防'
              },
              {
                id: '• 甲状腺功能异常:',
                detail: '在桥本甲状腺炎所致甲亢、伴有自主功能异常、过量用抗甲状腺药物后，HRV出现降低，但经治疗症状控制良好后HRV恢复正常'
              },
              {
                id: '• 妇产科:',
                detail: '早产儿、婴儿猝死综合征等，通过HRV分析对宫内室息作出判断。当胎儿HRV降低时，提示胎儿窘迫，应加速分娩。'
              },
              {
                id: '• 呼吸疾病:',
                detail: '支气管哮喘、呼吸窘迫综合征、睡眠呼吸暂停综合征等也可有HRV变化'
              },
              {
                id: '• 老年病:',
                detail: '更年期综合征、希恩综合征、帕金森病等HRV也有所反应'
              },
              {
                id: '• 肾病:',
                detail: '肾功能不全、尿毒症与HRV也有关。尿毒症患者HRV比正常差。LF及HF均比正常人低，提示交感神经和副交感神经不同程度受到抑制或损害。麻醉中HRV的分析能及时观察药物作用及麻醉意外的出现。'
              }
            ]
          }
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