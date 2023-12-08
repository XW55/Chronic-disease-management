<template>
  <view style="background-color: #f4f6fa;">
    <view class="content_header">
      <view class="date">
        {{bpObj.time}}
      </view>
      <view class="f65 m20" style="height: 86rpx;" :class="[showTip ? 'vhidden' : '']">
        <text :style="{ color: bloodColor }">{{ tip }}</text>
      </view>
    </view>

    <view class="content_body">
      <view class="bp">
        <view class="bp_left comm">
          <view class="">高压</view>
          <view class="">低压</view>
          <view class="">脉搏</view>
        </view>
        <view class="bp_right card comm">
          <view class=""><text class="f65" :style="{color: bloodColor}">{{bpObj.hp}}</text>mmHg</view>
          <view class=""><text class="f65">{{bpObj.lp}}</text>mmHg</view>
          <view class=""><text class="f65">{{bpObj.bp}}</text>次/分钟</view>
        </view>
      </view>
      <view class="img_box">
        <image src="https://tcm.mindyard.cn:83/uploadPath/blood.jpg"></image>
      </view>
      <view class="" v-if="aymptom">
        用户自述症状：{{aymptom}}
      </view>
      <view class="" v-if="doOther">
        用户测量前行为：{{doOther}}
      </view>

      <view class="tip">
        <view style="color: #4bb8f3; font-size: 45rpx;">
          血压小建议
        </view>
        <!-- 建议列表 -->
        <view class="tip_item" v-for="(item,index) in tipList" :key="index">
          {{item.content}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import
  formatTimeBp
  from '@/tools/tool.js'
  import {
    getBloodDetailById
  } from '@/request/request.js'
  export default {
    data() {
      return {
        bpObj: {
          hp: '',
          lp: '',
          bp: '',
          time: ''
        },
        showTip: true,
        tip: '',
        bloodColor: '',
        id: '',
        tipList: [],
        aymptom: '',
        doOther: ''
      }
    },
    onLoad(options) {
      this.id = options.id
      this.initBpObj()
    },
    mounted() {
      setTimeout(() => {
        this.setTip();
        this.showTip = false
      }, 150)
    },
    methods: {
      setTip() {
        let systolic = this.bpObj.hp
        let diastolic = this.bpObj.lp
        if (systolic < 90 && diastolic < 60) {
          this.tip = '低血压';
          this.tipList.push({
            content: '1. 增加水分摄入：低血压患者可以通过增加水分摄入来提高血容量和血压。建议每天喝足够的水，并在特别干燥或炎热的天气中增加饮水量。'
          }, {
            content: '2. 避免体位变化过快：由于低血压可能导致头晕或眩晕，建议避免从躺卧位或坐位迅速站立起来。转换体位时应缓慢进行，并给自己一些时间来适应新的姿势。'
          }, {
            content: '3. 避免长时间站立或久坐：长时间站立或久坐可能导致血压下降。低血压患者应该尽量避免站立或久坐的情况，如果需要长时间站立，可以尝试定期活动腿部肌肉以促进血液循环。'
          }, {
            content: '4. 避免剧烈运动：剧烈运动可能导致低血压患者血压进一步下降。建议选择适度的运动，如散步、游泳或瑜伽，确保运动量适中。'
          }, {
            content: '5. 均衡饮食：低血压患者应保持均衡的饮食，包括适量的蛋白质、碳水化合物和健康脂肪。饮食中可以增加一些含盐食物，但不要过量摄入盐，以免对健康造成负面影响。'
          }, {
            content: '6. 避免过度疲劳：长期过度疲劳可能导致低血压症状加重。低血压患者应保持充足的睡眠，并避免过度劳累。'
          })
          this.bloodColor = "#7fdee0"
        } else if (systolic <= 120 && diastolic <= 80) {
          this.tip = '理想血压';
          this.tipList.push({
            content: '1. 健康饮食：保持均衡饮食对于维持理想血压非常重要。建议摄入足够的水果、蔬菜、全谷物、健康脂肪和蛋白质。减少加工食品、高盐食物、高糖食品和饱和脂肪的摄入。'
          }, {
            content: '2. 控制体重：保持适当的体重有助于维持理想血压。如有必要，通过合理的饮食和适度的运动来控制体重。'
          }, {
            content: '3. 规律运动：进行适度的有氧运动，如快走、骑自行车或游泳，有助于促进心血管健康和维持理想血压。每周至少进行150分钟的有氧运动。'
          }, {
            content: '4. 限制酒精摄入：酒精摄入过多可能会对血压产生负面影响。如果饮酒，请限制每天的摄入量，并遵循健康饮酒的原则。'
          }, {
            content: '5. 戒烟：吸烟对心血管健康非常不利，会导致血压升高和其他严重的健康问题。强烈建议戒烟，如果需要帮助，请咨询医生或专业禁烟机构。'
          }, {
            content: '6. 控制压力：长期的精神压力可能对血压产生负面影响。请寻找适合自己的应对方式，如休闲活动、冥想、深呼吸或与亲友交流等，来缓解和控制压力。'
          })
          this.bloodColor = "#83dfae"
        } else if (systolic <= 130 && diastolic <= 85) {
          this.tip = '正常血压';
          this.tipList.push({
            content: '1. 健康饮食：保持均衡和多样化的饮食是维持正常血压的重要因素。食用丰富的水果、蔬菜、全谷物、瘦肉、鱼类、豆类和低脂乳制品，限制高盐、高脂肪和高胆固醇食物的摄入。'
          }, {
            content: '2. 控制体重：保持健康的体重范围有助于预防高血压的发生。通过均衡饮食和适度的运动来控制体重。'
          }, {
            content: '3. 健康运动：定期进行适度的身体活动有助于维持心血管健康。选择您喜欢并适合自己的运动方式，如快走、慢跑、游泳、骑自行车等。每周至少进行150分钟的中等强度有氧运动或75分钟的高强度有氧运动。'
          }, {
            content: '4. 限制酒精摄入：酒精摄入过多可能会对血压产生负面影响。如果饮酒，请限制每天的摄入量，并遵循健康饮酒的原则。'
          }, {
            content: '5. 戒烟：吸烟对于心血管健康非常有害。如果您吸烟，应尽早戒烟。寻求医生或专业机构的支持和戒烟计划。'
          }, {
            content: '6. 控制压力：长期的压力对身体健康有负面影响，包括可能升高血压。学习有效的应对压力的技巧，如放松训练、冥想和寻求社交支持。'
          })
          this.bloodColor = "#4bb8f3"
        } else if (systolic <= 140 && diastolic <= 90) {
          this.tip = '正常高值';
          this.tipList.push({
            content: '1. 调整饮食：采用健康的饮食模式对于控制血压非常重要。建议减少盐的摄入量，选择低钠饮食；增加水果、蔬菜、全谷物和健康脂肪的摄入；限制饱和脂肪和胆固醇的摄入。'
          }, {
            content: '2. 控制体重：如果您超重或肥胖，减轻体重可以有效降低血压。通过合理饮食和适度锻炼来实现健康体重，并保持稳定。'
          }, {
            content: '3. 规律运动：适度而规律的有氧运动可以帮助降低血压，如快走、骑自行车、游泳或慢跑。每周至少进行150分钟的有氧运动。'
          }, {
            content: '4. 限制酒精摄入：饮酒过多会增加血压，因此请限制每天的酒精摄入量。男性每天最多1-2杯，女性每天最多1杯。'
          }, {
            content: '5. 戒烟：吸烟对血压健康有害，并增加心血管疾病的风险。强烈建议戒烟，如有需要，请咨询医生或专业戒烟机构以获取支持和帮助。'
          }, {
            content: '6. 控制压力：长期的压力可能导致血压升高。采取适当的应对策略，如定期休息、放松技巧、深呼吸、冥想或参加放松活动，来缓解和控制压力。'
          })
          this.bloodColor = "#f59c24"
        } else if (systolic <= 160 && diastolic <= 100) {
          this.tip = '轻度高血压';
          this.tipList.push({
            content: '1. 调整饮食：采用健康的饮食模式对于控制血压非常重要。建议减少盐的摄入量，选择低钠饮食；增加水果、蔬菜、全谷物和健康脂肪的摄入；限制饱和脂肪和胆固醇的摄入。'
          }, {
            content: '2. 控制体重：如果您超重或肥胖，减轻体重可以有效降低血压。通过合理饮食和适度锻炼来实现健康体重，并保持稳定。'
          }, {
            content: '3. 规律运动：适度而规律的有氧运动可以帮助降低血压，如快走、骑自行车、游泳或慢跑。每周至少进行150分钟的有氧运动。'
          }, {
            content: '4. 限制酒精摄入：饮酒过多会增加血压，因此请限制每天的酒精摄入量。男性每天最多1-2杯，女性每天最多1杯。'
          }, {
            content: '5. 戒烟：吸烟对血压健康有害，并增加心血管疾病的风险。强烈建议戒烟，如有需要，请咨询医生或专业戒烟机构以获取支持和帮助。'
          }, {
            content: '6. 控制压力：长期的压力可能导致血压升高。采取适当的应对策略，如定期休息、放松技巧、深呼吸、冥想或参加放松活动，来缓解和控制压力。'
          })
          this.bloodColor = "#feb982"
        } else if (systolic <= 180 && diastolic <= 110) {
          this.tip = '中度高血压';
          this.tipList.push({
            content: '1. 饮食调整：采用低盐饮食模式对于控制血压非常重要。减少盐和钠的摄入量，尽量选择新鲜食材，避免加工食品；增加蔬菜、水果、全谷物和健康脂肪的摄入。'
          }, {
            content: '2. 限制饮酒和戒烟：过度饮酒和吸烟不仅会增加血压，还对心血管健康造成负面影响。请限制酒精摄入，并坚决戒烟以改善血压和整体健康状况。'
          }, {
            content: '3. 规律运动：适度而规律的有氧运动可以帮助降低血压，如快走、骑自行车、游泳或慢跑。每周至少进行150分钟的有氧运动，并结合一些力量训练活动。'
          }, {
            content: '4. 控制体重：如果您超重或肥胖，减轻体重可以有效降低血压。通过合理饮食和适度锻炼来实现健康体重，并保持稳定。'
          }, {
            content: '5. 药物治疗：根据医生的建议，可能需要进行药物治疗来帮助控制血压。请确保按时服用药物，并遵循医生的指导。'
          }, {
            content: '6. 控制压力：长期的压力可能导致血压升高。采取适当的应对策略，如定期休息、放松技巧、深呼吸、冥想或参加放松活动，来缓解和控制压力。'
          }, {
            content: '7. 规律监测：定期测量和监测血压是非常重要的，以便及早发现血压的变化。可以购买家用血压计进行自我监测，并记录结果以便医生评估。'
          })
          this.bloodColor = "#ed7e8f"
        } else {
          this.tip = '重度高血压';
          this.tipList.push({
            content: '1. 密切医生监测：重度高血压需要更加紧密的医疗监测和管理。定期就诊并遵循医生的指导和建议非常重要。医生可能需要调整您的药物治疗方案，并监测您的血压和整体健康状况。'
          }, {
            content: '2. 规律服药：按时服用医生开具的药物，并确保遵守剂量和频率。药物对于降低血压至关重要，因此请务必遵循医生的处方，并按照医嘱进行用药。'
          }, {
            content: '3. 低盐饮食：控制盐和钠的摄入量对于重度高血压患者尤为重要。减少加工食品、罐头食品和咸味零食的摄入；增加新鲜蔬菜、水果、全谷物和健康脂肪的摄入。'
          }, {
            content: '4. 控制体重：如果您超重或肥胖，减轻体重可以有效降低血压。在医生的指导下，采用适合您的饮食计划和锻炼方案，以实现健康体重。'
          }, {
            content: '5. 规律运动：在医生的许可下，进行适度而规律的有氧运动，如快走、骑自行车、游泳或慢跑。每周至少进行150分钟的有氧运动，并结合一些力量训练活动。'
          }, {
            content: '6. 控制压力：长期的压力可能导致血压升高。尝试采取适当的应对策略，如定期休息、放松技巧、深呼吸、冥想或参加放松活动，来缓解和控制压力。'
          }, {
            content: '7. 如果您是重度高血压患者，请与医生密切合作，遵循其指导并接受定期检查和治疗。只有通过合理的管理和控制，才能降低血压并保护心血管健康。'
          })
          this.bloodColor = "#993d4a"
        }
      },
      // 请求血压数据
      async initBpObj() {
        const res = await getBloodDetailById(this.id)
        console.log(res);
        if (res.code === 200) {
          res.data.createTime = formatTimeBp(res.data.createTime)
          this.bpObj.hp = res.data.hp
          this.bpObj.lp = res.data.lp
          this.bpObj.bp = res.data.bp
          this.bpObj.time = res.data.createTime
          if (res.data.otherAymptom === '无,' && res.data.otherDo === '无,' || res.data.otherAymptom === '无' && res.data
            .otherDo === '无') {
            return
          } else {
            this.aymptom = res.data.otherAymptom
            this.doOther = res.data.otherDo
          }

        }
      }
    }

  }
</script>

<style lang="scss">
  // 隐藏元素并保留位置
  .vhidden {
    visibility: hidden;
  }

  .content_header {
    width: 100%;
    padding: 25rpx 0;
    text-align: center;
    background-color: #fff;

    .date {
      font-size: 30rpx
    }
  }

  .m20 {
    margin: 20rpx 0;
  }

  .p20 {
    padding: 0 20rpx;
  }

  .f65 {
    font-size: 65rpx;
    font-weight: 700;
  }

  .content_body {
    margin: 20rpx auto;
    width: 95%;
    height: 700rpx;
    border-radius: 15rpx;
    background-color: #fff;

    .bp {
      padding: 25rpx 0;
      width: 100%;
      background: linear-gradient(to right, #80d8ff, #00c1fe);
      border-top-left-radius: 15rpx;
      border-top-right-radius: 15rpx;
      height: 500rpx;
      display: flex;
      justify-content: space-around;
      text-align: center;

      .comm {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }

      .bp_left {
        color: #fff;
        width: 35%;
        font-weight: normal;
        font-size: 60rpx;
      }

      .bp_right {
        border: 8rpx solid #fff;
        border-radius: 15rpx;
        background: linear-gradient(to bottom, #e4f7ff, #d1f0fe);

        text {
          font-size: 70rpx;
        }

        width: 50%;
      }
    }

    .img_box {
      width: 100%;
      margin: 15rpx auto;
      height: 220rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .tip {
      padding: 20rpx;
      font-size: 33rpx;

      .tip_item {
        margin: 10rpx 0;

      }
    }
  }
</style>