<template>
  <view>
    <image class="image" src="../../static/images/bolang.png" mode="widthFix" style="width: 100%;"></image>
    <view style="width: 94%;margin: 0 auto;">
      <view style="text-align: center;font-size: 1em;font-size: 2em;
      font-weight: 700;padding: ;">{{zhi.wenzi}}</view>
      <view class="wenzikuang">{{zhi.dec}}</view>
      <view class="wenzikuang yiying">{{zhi.text}}</view>
      <view class="xuanze">
        <view class="xuanze_xuanxiang" v-for="(item, index) in anniuwenzizi" :key="item.id" @click="tishii(item)" :class="{ xuanzhong: item.beijinse }">{{item.wenzi}}</view>
      </view>
      <!-- 提示词 -->
      <view :style="styleString" v-html="tishitext"></view>
      <!-- <view :style="styleStringzhi" v-html="tishitext"></view> -->
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        pStyle: {
              marginTop: '20rpx',
              marginBottom: '20rpx'
            },
        zhi: '',
        // 提示开关
        tishikaiguan: false,
        // 详细项提示
        anniuwenzizi: [],
        tishiStyle: {
                    'font-size': '40rpx',
                    'padding': '40rpx 0',
                    'line-height':'62rpx'
                  },
        // 提示文本
        tishitext:' ',
        lith: [{
          biaoti: '身心能量指数',
          anniuwenzi: [{
              id: 0,
              beijinse: false,
              wenzi: '身心能量指数一直差代表什么？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">单次的身心能量指数较差并不需要过度担心，与劳累饮酒、疲劳有关，休息后即可回升；</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">但如果多日内多次测量，身心能量多处于浅蓝色"较差"区域，通常表明整体身体和心血管系统处于亚健康状态，建议调整作息，让身体好好恢复;</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">如果多日内多次测量，身心能量都处于深蓝色"很差”区域，通常意味着存在心血管类或其他类型疾病风险较高，需注意排查。</p>`
            },
            {
              id: 1,
              beijinse: false,
              wenzi: '如何提高？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">以下行为会带来身心能量指数的提升：</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">适度的锻炼，特别是耐力训练，良好的休息和饮食，避免熬夜。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">请及时休息，减少加班、熬夜、饮酒和高负荷运动等刺激性行为，以保护心脏。一般情况下，经过充足的休息身心能量指数即可回升</p>`
            },
            {
              id: 2,
              beijinse: false,
              wenzi: '什么导致身心能量指数下降？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">以下行为会导致身心能量指数下降：</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">工作压力过大、心理压力过大、疲劳、饮酒、情绪波动、睡眠不良、身体生病。长期缺乏运动也会导致身心能量指数的平均水准低于同龄人。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">需要特殊说明的是，大量运动过后身心能量指数会短时下降，但这种下降是有益于身体的，无需担心。</p>`
            },
            {
              id: 3,
              beijinse: false,
              wenzi: '身心能量指数是什么？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">身心能量指数被认为是一项最值得长期追踪的健康指标，在医疗和专业领域被广泛应用。高身心能量指数代表更好的心血管功能、更好的副交感神经张力和更好的身体状态，而极低的身心能量指数意味着身体状态较差、副交感神经对于心脏的保护力下降，心脏超负荷工作的风险提升。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">据科学统计，人群平均的身心能量指数随着年龄的增大呈下降趋势，所以维持高的身心能量指数水平具有极高的健康价值。身心能量指数在每一天当中也是随看身体的状态周期性的波动，您可以通过定期测试了解到您身体状态在一天当中的变化。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">请保证测试前已经处在安静状态3～5分钟，否则可能会降低准确性。</p>`
            },
            {
              id: 4,
              beijinse: false,
              wenzi: '有什么用？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">如果本次身心能量指数在很差区域，或者显著低于你平时的数字，请及时休息，减少加班、熬夜、饮酒和高负荷运动等刺激性行为，以保护心脏。一般情况下，经过充足的休息，身心能量指数即可回升</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">运动爱好者可以通过此指标观察自己的身体恢复情况避免过度训练。也可以选择心力能量指数高的一天安排大剂量训练。此方法被国外大量专业运动员采用。</p>`
            }
          ]
        }, {
          biaoti: '情绪压力指数',
          anniuwenzi: [{
              id: 0,
              beijinse: false,
              wenzi: '情绪压力指数是什么？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">情绪压力指数来自神经系统平衡度，是指人体交感神经与副交感神经的平衡度。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">交感神经和副交感神经，掌管身体几乎所有的器官和腺体的工作。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">副交感神经的作用可以总结为"放松和恢复”，负责降低心率和血压，提升免疫力，帮助身体恢复，人的精神也会感受到放松。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">交感神经的作用可以总结为"战斗与消耗”，负责在遇到环境压力时提升心率和血压，精神也会感受到紧张，免疫力和消化能力也会下降。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">交感与副交感神经的活跃程度较平衡时，人体处在最佳状态，但现代化的生活节奏导致大量的人交感神经过度兴奋，到了晚上依然如此。这会导致身体的失衡，感受到压力，并且难以入眠。久而久之，身体将越发疲惫进入亚健康状态。</p>`
            },
            {
              id: 1,
              beijinse: false,
              wenzi: '什么导致交感兴奋？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">工作，精神压力会导致交感神经亢奋。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">高负荷体力活动会导致交感神经高度亢奋。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">茶、咖啡、酒等饮品也会导致交感神经亢奋。</p>`
            },
            {
              id: 2,
              beijinse: false,
              wenzi: '如何缓解交感亢奋？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">冥想、放松训练、充分的休息、缓解精神压力都可以降低交感神经兴奋度。</p>`
            }
          ]
        }, {
          biaoti: '兴奋指数',
          anniuwenzi: [{
              id: 0,
              beijinse: false,
              wenzi: '兴奋指数是什么？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">形象化的描述，兴奋指数即交感神经负责在压力环境（例如竞争）中"激活"身体，例如增大心率、血压，引导更多的血液流向肌肉。在这个过程中，人的精神也会感觉到紧张和压力。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">交感神经和副交感神经，掌管身体几乎所有的器官和腺体的工作，包括心脏的跳动。交感与副交感神经有着比较规律的昼夜节律。通常情况下，白天交感神经兴奋，调整身体应对压力和日常活动；晚上则副交感神经兴奋，调整身体进入休息与消化的模式，尽快进入睡眠状态。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">现代化的生活节奏导致大量的人交感神经过度兴奋，到了晚上依然如此。这会导致身体的失衡，感受到压力，并且难以入眠。久而久之，身体将越发疲惫，进入亚健康状态。</p>`
            },
            {
              id: 1,
              beijinse: false,
              wenzi: '什么导致交感兴奋？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">白天的日常生活，大多数人的交感神经会表现为轻度兴奋。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">工作，精神压力会导致交感神经兴奋。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">高负荷体力活动会导致交感神经高度兴奋。</p>`
            },
            {
              id: 2,
              beijinse: false,
              wenzi: '对健康的指导意义？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">在日常测试过程中可以观察自己的交感神经与副交感神经是否有良好的昼夜节律。如果存在交感神经过度兴奋的情况，也可以配合一些休息、睡眠、瑜伽、冥想、运动逐步改善。</p>`
            }
          ]
        }, {
          biaoti: '放松指数',
          anniuwenzi: [{
              id: 0,
              beijinse: false,
              wenzi: '放松指数是什么？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">可以总结为"休息和消化"，负责降低心率和血压，引导血液进入消化系统，帮助身体恢复。人的精神也会感受到放松。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">交感神经和副交感神经，掌管身体几乎所有的器官和腺体的工作，包括心脏的跳动。交感与副交感神经有着比较规律的昼夜节律。通常情况下，白天交感神经兴奋，调整身体应对压力和日常活动；晚上则副交感神经兴奋，调整身体进入休息与消化的模式，尽快进入睡眠状态。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">现代化的生活节奏导致大量的人交感神经过度兴奋，到了晚上依然如此。这会导致身体的失衡，感受到压力，并且难以入眠。久而久之，身体将越发疲惫，进入亚健康状态。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">所以了解交感与副交感神经的工作状态具备很大的健康价值。我们通过测量计算心电图中的微小差异，就可以来量化交感神经和副交感神经的活跃度，从而得到这样一项指标。</p>`
            },
            {
              id: 1,
              beijinse: false,
              wenzi: '什么导致副交感兴奋？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">休息、睡眠、瑜伽、冥想、保持放松都可以降低交感神经兴奋度，提高副交感神经的兴奋程度。</p> <p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">适度的运动也虽然短时间内会降低副交感神经的兴奋度，但是由于身体的超量恢复效应，将有助于提升长期的副交感神经兴奋水平。</p>`
            },
            {
              id: 2,
              beijinse: false,
              wenzi: '对健康的指导意义？',
              tishi: `<p style="font-size: 40rpx; margin-top: 20rpx; margin-bottom: 20rpx;">在日常测试过程中可以观察自己的交感神经与副交感神经是否有良好的昼夜节律。如果存在交感神经过度兴奋的情况，也可以配合一些休息、睡眠、瑜伽、冥想、运动逐步改善。</p>`
            }
          ]
        }]
      };
    },
    computed: {
        styleString() {
          return Object.keys(this.tishiStyle).map(key => `${key}: ${this.tishiStyle[key]}`).join('; ');
        },
        styleStringzhi() {
          return Object.keys(this.pStyle).map(key => `${key}: ${this.pStyle[key]}`).join('; ');
        }
      },
    onLoad(options) {
      // console.log(options);
      // console.log(JSON.parse(decodeURIComponent(options.jieu)));
      this.zhi = JSON.parse(decodeURIComponent(options.jieu));
      // this.setTitle(this.zhi.wenzi);
      const shuzhi = this.lith.find(item => item.biaoti == this.zhi.wenzi);
      if (shuzhi) {
        this.anniuwenzizi = shuzhi.anniuwenzi;
        console.log("this.anniuwenzizi的值");
        console.log(this.anniuwenzizi);
      } else {
        console.log('未找到匹配的biaoti');
      }
    },
    methods: {
      setTitle(newTitle) {
        uni.setNavigationBarTitle({
          title: newTitle
        });
      },
      tishi() {
        console.log("111");
        this.tishikaiguan = !this.tishikaiguan
      },
      tishii(value) {
        console.log(value)
        if (value.beijinse) {
          this.tishitext = ''
          this.anniuwenzizi[value.id].beijinse = false
        } else{
          this.tishitext = ''
          this.anniuwenzizi = this.anniuwenzizi.map(item => ({ ...item, beijinse: false }));
          this.anniuwenzizi[value.id].beijinse= !value.beijinse
          this.tishitext =  this.anniuwenzizi[value.id].tishi
        }  
      },
    }
  };
</script>
<style>
  page {
    background: #fff;
  }
</style>
<style lang="scss" scoped>
  .wenzikuang {
    text-indent: 2em;
    margin: 30rpx 0;
    font-size: 44rpx;
    padding: 0 20rpx;
  }

  .xuanze {
    margin: 30rpx 0;
    padding: 0 20rpx;
    display: flex;
    flex-wrap: wrap;

    .xuanze_xuanxiang {
      background-color: #F4F4F4;
      padding: 10rpx 20rpx;
      color: #A4A4A4;
      border-radius: 50px;
      margin: 10rpx 20rpx 10rpx 0;
    }
  }

  .yiying {
    box-shadow: 0px 7px 30px 0px rgba(100, 100, 111, 0.2);
    border-radius: 25rpx;
    background-color: #fff;
    padding: 20rpx;
  }

  .quanju {
    background-image: url('../../static/images/bolang.png');
  }

  .image {
    display: inline-block;
  }
  .xuanzhong{
    color: #fff !important;
    background-color: #006600 !important;
  }
  .styled-paragraph {
    display: block;
    font-size: 40rpx;
    margin-bottom: 20rpx; /* 添加垂直间距 */
  }
</style>