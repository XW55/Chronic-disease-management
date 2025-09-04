<template>
  <view>
  <view class="page">
    <!--<bar :nav="setNav"></bar>-->
    <view class="titleBox">
      <view class="title">个人信息</view>
      <view class="item" >
        <view>姓名：{{ userObj.name }}</view>
        <view>年龄：{{ userObj.age }}岁</view>
        <view>性别：{{ userObj.sex == 0?"男":"女" }}</view>
        <view>身高：{{ userObj.patientHeight }}cm</view>
        <view>体重：{{ userObj.patientWeight }}kg</view>
        <view style="display: flex;flex-direction:column;" @click="jumpMBI()">
              <span style="line-height: 35rpx;">BMI：{{bmi}} </span>
              <span style="line-height: 35rpx;
        font-size: 0.7rem;
        color: #4CD9B7;">什么是BMI？</span>
            </view>
        
      </view>
    </view>
  </view>
  <!-- ================================================================= -->

  <!-- 呼吸与心率单导独有 -->
  <view class="consult">
    <u-row justify="space-between" class="demo-uni-row" gutter="20">
      <u-col span="6">
        <view
          class=""
          style="
            background-image: linear-gradient(to right, #faeeec, #f8e6e3);
            padding: 20rpx;
            border-radius: 25rpx;
          "
        >
          <view class="" style="padding: 10rpx; font-size: 1.1rem">心率</view>
          <view
            class=""
            style="padding: 10rpx; font-size: 1.1rem; color: #d86f00"
            >{{
              stateData["平均心率"]
                ? stateData["平均心率"] + "次/分钟"
                : "暂无数据"
            }}</view
          >
        </view>
      </u-col>
      <u-col span="6">
        <view
          class=""
          style="
            background-image: linear-gradient(to right, #f1f2fc, #e7e9fb);
            padding: 20rpx;
            border-radius: 25rpx;
          "
        >
          <view class="" style="padding: 10rpx; font-size: 1.1rem"
            >呼吸频率</view
          >
          <view
            class="consult_xl_zi"
            style="padding: 10rpx; font-size: 1.1rem; color: #d86f00"
            >{{
              stateData.rps_rate ? stateData.rps_rate + "次/分钟" : "暂无数据"
            }}</view
          >
        </view>
      </u-col>
    </u-row>
  </view>
  
  <view class="consult">
    <view class="xinli">
      <view class="tupian"></view>
      <view class="xinli_top yellow">
        <view class="">身心能量</view>
        <view class="">{{stateData.ecg_power?stateData.ecg_power:''}} <text style="color: #999999;font-size: 15px;font-weight: 300;">ms</text></view>
      </view>
      <view class="jintutiao">
        <view class="jintutiao_shuzi" style="color: #BAC2CE;">
          <view style="width: 15%;box-sizing: border-box;color: #BAC2CE;text-align: right;display: flex;justify-content:space-between;">
            <view style="color: #BAC2CE;">0</view>
            <view style="color: #BAC2CE;">15</view>
          </view>
          <view style="width: 10%;box-sizing: border-box;color: #BAC2CE;text-align: right;">25</view>
          <view style="width: 25%;box-sizing: border-box;color: #BAC2CE;text-align: right;">100</view>
          <view style="width: 50%;box-sizing: border-box;color: #BAC2CE;text-align: right;">200</view>
        </view>
        <view class="jintutiao_sansetiao">
          <view style="width: 15%;box-sizing: border-box;background-color: #85DBEC;color: #85DBEC;">1</view>
           <view style="width: 10%;box-sizing: border-box;background-color: #DBF5FA;color: #DBF5FA;">2</view>
          <view style="width: 25%;box-sizing: border-box;background-color: #FFEB93;color: #FFEB93;">3</view>
          <view style="width: 50%;box-sizing: border-box;background-color: #E87659;color: #E87659;">4</view>
        </view>
        <view class="jintutiao_wenzi" v-if="getBordertext_xuce(stateData.ecg_power)">
          <view :style="{'box-sizing': 'border-box','background-color': '#fff', color: '#fff', width: shenxinyalikuandu(stateData.ecg_power)}"></view>
          <view class="sanjiao" :style="{
            'border-bottom-color': getBorderColor(stateData.ecg_power)
          }"></view>
          <view class="sanjiao_wenzi">{{getBordertext(stateData.ecg_power)}}</view>
        </view>
        <view  class="jintutiao_wenzi"  :style="{'justify-content': 'flex-end', width: shenxinyalikuandu(stateData.ecg_power)}"  v-else>
          <view class="sanjiao_wenzi">{{getBordertext(stateData.ecg_power)}}</view>
          <view class="sanjiao" :style="{'transform': 'translateX(0%)',
            'border-bottom-color': getBorderColor(stateData.ecg_power)
          }"></view>
        </view>
      </view>
      <view class="xinli_contan">{{stateData.ecg_power_text}}</view>
      <view class="xinli_bottom" @click="xinlinengliang">详情解读<uni-icons type="right"></uni-icons></view>
    </view>
     </view>
  <view class="consult">
    <view class="xinli">
      <view class="xinli_top blue" >
        <view class="">情绪压力指数</view>
         <view class="">{{stateData.emo_stress}}</view>
      </view>
      <view class="jintutiao">
        <view class="jintutiao_shuzi" style="color: #BAC2CE;">
          <view style="width: 15%;box-sizing: border-box;color: #BAC2CE;text-align: right;display: flex;justify-content:space-between;">
            <view style="color: #BAC2CE;">0</view>
            <view style="color: #BAC2CE;">0.3</view>
          </view>
          <view style="width: 10%;box-sizing: border-box;color: #BAC2CE;text-align: right;">0.5</view>
          <view style="width: 30%;box-sizing: border-box;color: #BAC2CE;text-align: right;">2.5</view>
          <view style="width: 20%;box-sizing: border-box;color: #BAC2CE;text-align: right;">3</view>
          <view style="width: 25%;box-sizing: border-box;color: #BAC2CE;text-align: right;">4</view>
        </view>
        <view class="jintutiao_sansetiao">
            <view style="width: 15%;box-sizing: border-box;background-color: #58A2CC;color: #58A2CC;">0.3</view>
            <view style="width: 10%;box-sizing: border-box;background-color: #85DBEC;color: #85DBEC;">0.5</view>
            <view style="width: 30%;box-sizing: border-box;background-color: #DBF5FA;color: #DBF5FA;">2.5</view>
            <view style="width: 20%;box-sizing: border-box;background-color: #FFEB93;color: #FFEB93;">3</view>
           <view style="width: 25%;box-sizing: border-box;background-color: #E87659;color: #E87659;">4</view>
           
           
           
           
        </view>
        <view class="jintutiao_wenzi" v-if="qingxuyalikuandu_yuce(stateData.emo_stress)">
          <view :style="{'box-sizing': 'border-box','background-color': '#fff', color: '#fff', width: qingxuyalikuandu(stateData.emo_stress)}"></view>
          <view class="sanjiao" :style="{'border-bottom-color': getBorderColor_qinxu(stateData.emo_stress)}"></view>
          <view class="sanjiao_wenzi">{{getBordertext_qinxu(stateData.emo_stress)}}</view>
        </view>

        <view  class="jintutiao_wenzi"  :style="{ 'border-bottom-color': getBorderColor_qinxu(stateData.emo_stress),'display':'flex','justify-content': 'flex-end', width: qingxuyalikuandu(stateData.emo_stress)}"  v-else>
          <view class="sanjiao_wenzi">{{getBordertext_qinxu(stateData.emo_stress)}}</view>
          <view class="sanjiao" :style="{'transform': 'translateX(0%)','border-bottom-color': getBorderColor_qinxu(stateData.emo_stress)}"></view>
        </view>
      </view>
      <view class="xinli_contan">{{stateData.emo_stress_text}}</view>
      <view class="xinli_bottom"@click="qingxuyali()">详情解读<uni-icons type="right"></uni-icons></view>
    </view>
   </view>
  <view class="consult">
    <view class="xinli">
      <view class="xinli_top  red">
        <view class="">兴奋指数</view>
         <view class="">{{stateData.excitement}}</view>
      </view>
      <view class="jintutiao">
        <view class="jintutiao_shuzi" style="color: #BAC2CE;">
          <view style="width: 20%;box-sizing: border-box;color: #BAC2CE;text-align: right;display: flex;justify-content:space-between;"><view style="color: #BAC2CE;">0</view><view style="color: #BAC2CE;">20</view></view>
            <view style="width: 25%;box-sizing: border-box;color: #BAC2CE;text-align: right;">45</view>
            <view style="width: 25%;box-sizing: border-box;color: #BAC2CE;text-align: right;">70</view>
            <view style="width: 10%;box-sizing: border-box;color: #BAC2CE;text-align: right;">80</view>
            <view style="width: 20%;box-sizing: border-box;color: #BAC2CE;text-align: right;">100</view>
          </view>
        <view class="jintutiao_sansetiao">
            <view style="width: 20%;box-sizing: border-box;background-color: #58A2CC;color: #58A2CC;">20</view>
           <view style="width: 25%;box-sizing: border-box;background-color: #85DBEC;color: #85DBEC;">45</view>
           <view style="width: 25%;box-sizing: border-box;background-color: #DBF5FA;color: #DBF5FA;">70</view>
           <view style="width: 10%;box-sizing: border-box;background-color: #FFEB93;color: #FFEB93;">80</view>
            <view style="width: 20%;box-sizing: border-box;background-color: #E87659;color: #E87659;">100</view>
        </view>
        <view class="jintutiao_wenzi" v-if="stateData.excitement<88">
          <view :style="{'box-sizing': 'border-box','background-color': '#fff', color: '#fff', width: stateData.excitement + '%'}"></view>
          <view class="sanjiao" :style="{
            'border-bottom-color': getBorderColor_xinfen(stateData.excitement)
          }"></view>
          <view class="sanjiao_wenzi">{{getBordertext_xinfen(stateData.excitement)}}</view>
        </view>
        <view  class="jintutiao_wenzi"  :style="{ 'border-bottom-color': getBorderColor_xinfen(stateData.excitement),'justify-content': 'flex-end', 'width': stateData.excitement + '%'}"  v-else>
          <view class="sanjiao_wenzi">{{getBordertext_xinfen(stateData.excitement)}}</view>
         <view class="sanjiao" :style="{'transform': 'translateX(0%)',
           'border-bottom-color': getBorderColor_xinfen(stateData.excitement)
         }"></view>
        </view>
      </view>
      <view class="xinli_contan">{{stateData.excitement_text}}</view>
       <view class="xinli_bottom" @click="xinfen">详情解读<uni-icons type="right"></uni-icons></view>
    </view>
     </view>
  <view class="consult">
    <view class="xinli">
      <view class="xinli_top green">
        <view class="">放松指数</view>
         <view class="">{{stateData.relax}}</view>
      </view>
      <view class="jintutiao">
        <view class="jintutiao_shuzi" style="color: #BAC2CE;">
          <view style="width: 20%;box-sizing: border-box;color: #BAC2CE;text-align: right;display: flex;justify-content:space-between;"><view style="color: #BAC2CE;">0</view><view style="color: #BAC2CE;">20</view></view>
          <view style="width: 10%;box-sizing: border-box;color: #BAC2CE;text-align: right;">30</view>
          <view style="width: 25%;box-sizing: border-box;color: #BAC2CE;text-align: right;">55</view>
          <view style="width: 25%;box-sizing: border-box;color: #BAC2CE;text-align: right;">80</view>
          <view style="width: 20%;box-sizing: border-box;color: #BAC2CE;text-align: right;">100</view>
        </view>
        <view class="jintutiao_sansetiao">
           <view style="width: 20%;box-sizing: border-box;background-color: #58A2CC;color: #58A2CC;">20</view>
           <view style="width: 10%;box-sizing: border-box;background-color: #85DBEC;color: #85DBEC;">30</view>
           <view style="width: 25%;box-sizing: border-box;background-color: #DBF5FA;color: #DBF5FA;">55</view>
           <view style="width: 25%;box-sizing: border-box;background-color: #FFEB93;color: #FFEB93;">80</view>
          <view style="width: 20%;box-sizing: border-box;background-color: #E87659;color: #E87659;">100</view>

        </view>
        <view class="jintutiao_wenzi" v-if="stateData.relax<88">
          <view :style="{'box-sizing': 'border-box','background-color': '#fff', color: '#fff', width: stateData.relax + '%'}"></view>
          <view class="sanjiao" :style="{
            'border-bottom-color': getBorderColor_fangsong(stateData.relax)
          }"></view>
          <view class="sanjiao_wenzi">{{getBordertext_fangsong(stateData.relax)}}</view>
        </view>
        <view  class="jintutiao_wenzi"  :style="{ 'border-bottom-color': getBorderColor_xinfen(stateData.relax),'justify-content': 'flex-end', 'width': stateData.relax + '%'}"  v-else>
          <view class="sanjiao_wenzi">{{getBordertext_fangsong(stateData.relax)}}</view>
          <view class="sanjiao" :style="{'transform': 'translateX(0%)',
            'border-bottom-color': getBorderColor_fangsong(stateData.relax)
          }"></view>
        </view>
      </view>
      <view class="xinli_contan">{{stateData.relax_text}}</view>
         <view class="xinli_bottom" @click="fangsong">详情解读<uni-icons type="right"></uni-icons></view>
      
    </view>
  </view>
  <view class="consult">
    <view class="xinli">
      <view class="xinli_top zise">
        <view class="">体质指数</view>
         <view class="">{{bmi}}</view>
      </view>
      <view class="jintutiao">
        <view class="jintutiao_shuzi" style="color: #BAC2CE;">
          <view style="width: 30%;box-sizing: border-box;color: #BAC2CE;text-align: right;display: flex;justify-content:space-between;">
            <view style="color: #BAC2CE;">0</view>
            <view style="color: #BAC2CE;">18.5</view>
          </view>
          <view style="width: 25%;box-sizing: border-box;color: #BAC2CE;text-align: right;">24</view>
          <view style="width: 15%;box-sizing: border-box;color: #BAC2CE;text-align: right;">28</view>
          <view style="width: 10%;box-sizing: border-box;color: #BAC2CE;text-align: right;">30</view>
          <view style="width: 20%;box-sizing: border-box;color: #BAC2CE;text-align: right;">40</view>
        </view>
        <view class="jintutiao_sansetiao">
           <view style="width: 30%;box-sizing: border-box;background-color: #58A2CC;color: #58A2CC;">18.5</view>
           <view style="width: 25%;box-sizing: border-box;background-color: #85DBEC;color: #85DBEC;">24</view>
           <view style="width: 15%;box-sizing: border-box;background-color: #DBF5FA;color: #DBF5FA;">28</view>
           <view style="width: 10%;box-sizing: border-box;background-color: #FFEB93;color: #FFEB93;">30</view>
          <view style="width: 20%;box-sizing: border-box;background-color: #E87659;color: #E87659;">40</view>
        </view>
        <view class="jintutiao_wenzi" v-if="getBordertext_mbi(bmi)">
          <view :style="{'box-sizing': 'border-box','background-color': '#fff', color: '#fff', width:bmikuandu(bmi)}"></view>
          <view class="sanjiao" :style="{
            'border-bottom-color': getBorderColor_mbi(bmi)
          }"></view>
          <view class="sanjiao_wenzi">{{getBordertext_bmi(bmi*1)}}</view>
        </view>
        <view  class="jintutiao_wenzi"  :style="{ 'border-bottom-color': getBorderColor_mbi(bmi),'justify-content': 'flex-end', 'width': bmikuandu(bmi)}"  v-else>
          <view class="sanjiao_wenzi">{{getBordertext_bmi(bmi*1)}}</view>
          <view class="sanjiao" :style="{'transform': 'translateX(0%)',
            'border-bottom-color': getBorderColor_mbi(bmi)
          }"></view>
        </view>
      </view>
<!--      <view class="xinli_contan">{{stateData.relax_text}}</view>-->
      <view class="xinli_bottom" @click="jumpMBI()">详情解读<uni-icons type="right"></uni-icons></view> 
      
    </view>
  </view>


 </view>

</template>
<script>
import {getUserInfoByCode} from '@/request/request.js'
export default {
  
  data() {
    return {
      hhh:false,
      value: [],

      content1: "",
   
      pid: "",
      id: "",

      stateData: null, //心电图分析数据

      userInfo: {},
      userObj: {
        name: '',
        age: '',
        sex: '',
        patientHeight:'',
        patientWeight:''
      }
    };
  },
  onUnload() {
  },
  onShow() {},
  onLoad(option) {
    this.getUser()
    
    let _this = this;
    _this.id = option.id?option.id:uni.getStorageSync('phone');
    _this.pid = option.pid;
    
    _this.getdetail22()
    // console.log("option-------------");
    // console.log(option);

  },
  mounted() {},
  computed: {
      bmi() {
        const heightInMeters = this.userObj.patientHeight*1 / 100; // 将厘米转换为米
        const bmiValue = this.userObj.patientWeight*1 / heightInMeters/ heightInMeters;
        return bmiValue.toFixed(2);
      }
    },
  methods: {

    // 心活力三角形颜色
    getBorderColor(value) {
      if (value < 15) {
        return '#85DBEC';
      } else if (value < 25) {
        return '#DBF5FA';
      } else if (value < 100) {
        return '#FFEB93';
      } else  {
        return '#E87659';
      }
    },
    // 心活力三角型文字
    getBordertext(value){
      if (value < 15) {
        return '很差';
      } else if (value < 25) {
        return '较差';
      } else if (value < 100) {
        return '正常';
      } else {
        return '活跃';
      }
    },
    // 宽度
        shenxinyalikuandu(value) {
          if (value < 15) {
            return `${5 * ((value-0) / 15) * 3}%`;
          } else if (value >= 15 && value < 25) {
            return `${(3 + ((value-15) / 10) * 2) * 5}%`;
          } else if (value >= 25 && value < 100) {
            return `${(5 + ((value-25) / 75) * 5) * 5}%`;
          } else if (value >= 100 && value < 200) {
            return `${(10 + ((value-100) / 100) * 10) * 5}%`;
          } else if (value >= 200) {
            return '100%';
          }
        },

    //提前预测箭头的宽度
    getBordertext_xuce(value){
      if (value < 15) {
        return (5 * ((value-0) / 15) * 3)>88?false:true
      } else if (value >= 15 && value < 25) {
        return ((3 + ((value-15) / 10) * 2) * 5) >88?false:true
      } else if (value >= 25 && value < 100) {
        return ((5 + ((value-25) / 75) * 5) * 5)>88?false:true;
      } else if (value >= 100 && value < 200) {
        return ((10 + ((value-100) / 100) * 10) * 5)>88?false:true;
      } else if (value >= 200) {
        return false
      }
    },

    // 情绪三角形颜色
    getBorderColor_qinxu(value){
      if (value < 0.3) {
        return '#58A2CC';
      } else if (value < 0.5) {
        return '#85DBEC';
      } else if (value < 2.5) {
        return '#DBF5FA';
      } else if (value < 3) {
        return '#FFEB93';
      } else {
        return '#E87659';
      }
    },
    // 情绪三角型文字
    getBordertext_qinxu(value){
      if (value < 0.3) {
        return '低';
      } else if (value < 0.5) {
        return '较低';
      } else if (value < 2.5) {
        return '正常';
      } else if(value < 3) {
        return '较高';
      } else {
        return '高';
      }
    },
 
    // 兴奋三角形颜色
    getBorderColor_xinfen(value){
      if (value < 20) {
        return '#58A2CC';
      } else if (value < 45) {
        return '#85DBEC';
      } else if (value < 70) {
        return '#DBF5FA';
      } else if (value < 80) {
        return '#FFEB93';
      } else {
        return '#E87659';
      }
    },
    // 宽度
        qingxuyalikuandu(value) {
          if (value < 0.3) {
            return `${2.5 * ((value-0) / 0.3) * 6}%`;
          } else if (value >= 0.3 && value < 0.5) {
            return `${(6 + ((value-0.3) / 0.2) * 4) * 2.5}%`;
          } else if (value >= 0.5 && value < 2.5) {
            return `${(10 + ((value-0.5) / 2) * 12) * 2.5}%`;
          } else if (value >= 2.5 && value < 3) {
            return `${(22 + ((value-2.5) / 0.5) * 8) * 2.5}%`;
          } else if (value >= 3 && value < 4) {
            return `${(30 + ((value-3) / 1) * 10) * 2.5}%`;
          } else if (value >= 4) {
            return '100%';
          }
        },
    //提前预测箭头的宽度
    qingxuyalikuandu_yuce(value){
      if (value < 0.3) {
        return (2.5 * ((0.3 - value) / 0.3) * 6)>88?false:true
      } else if (value >= 0.3 && value < 0.5) {
        return ((6 + ((0.5 - value) / 0.2) * 4) * 2.5) >88?false:true
      } else if (value >= 0.5 && value < 2.5) {
        return ((10 + ((2.5 - value) / 2) * 12) * 2.5)>88?false:true;
      } else if (value >= 2.5 && value < 3) {
        return ((22 + ((3 - value) / 0.5) * 8) * 2.5)>88?false:true;
      } else if (value >= 3 && value < 4) {
        return ((30 + ((4 - value) / 1) * 10) * 2.5)>88?false:true;
      } else if (value >= 4) {
        return false
      }
    },
    // 兴奋三角型文字
    getBordertext_xinfen(value){
      if (value < 20) {
        return '低';
      } else if (value < 45) {
        return '较低';
      } else if (value < 70) {
        return '正常';
      } else if(value < 80) {
        return '较高';
      } else {
        return '高';
      }
    },
    // 放松三角形颜色
    getBorderColor_fangsong(value){
      if (value < 20) {
        return '#58A2CC';
      } else if (value < 30) {
        return '#85DBEC';
      } else if (value < 55) {
        return '#DBF5FA';
      } else if (value < 80) {
        return '#FFEB93';
      } else {
        return '#E87659';
      }
    },
    // 放松三角型文字
    getBordertext_fangsong(value){
      if (value < 20) {
        return '低';
      } else if (value < 30) {
        return '较低';
      } else if (value <55) {
        return '正常';
      } else if(value < 80) {
        return '较高';
      } else {
        return '高';
      }
    },
    // 体质指数三角形颜色
    getBorderColor_mbi(value){
      if (value <= 18.5) {
        return '#58A2CC';
      } else if (value <= 24) {
        return '#85DBEC';
      } else if (value <= 28) {
        return '#DBF5FA';
      } else if (value <= 30) {
        return '#FFEB93';
      } else if (value <= 40){
        return '#E87659';
      } else {
        return '#E87659';
      }
    },
    // 放松三角型文字
    getBordertext_bmi(value){
      // console.log("====================================================");
      // console.log(value);
       // let value =  this.bmi
      if (value <= 18.5) {
        return '偏瘦';
      } else if (value <=24) {
        return '正常';
      } else if (value <=28) {
        return '偏胖';
      } else if (value <= 30) {
        return '轻度肥胖';
      } else if (value <= 40) {
        return '中度肥胖';
      } else if (value>40){
        return '重度肥胖';
      }
    },
    //提前预测箭头的宽度
    getBordertext_mbi(value){
      if (value < 18.5) {
        return (5 * ((value-0) / 18.5) * 6)>88?false:true
      } else if (value >= 18.5 && value < 24) {
        return ((6 + ((value-18.5) / 5.5) * 5) * 5) >88?false:true
      } else if (value >= 24 && value < 28) {
        return ((11 + ((value-24) / 4) * 3) * 5)>88?false:true;
      } else if (value >= 28 && value < 30) {
        return ((14 + ((value-28) / 2) * 2) * 5)>88?false:true;
      } else if (value >= 30 && value < 40) {
        return ((16 + ((value-30) / 10) * 4) * 5)>88?false:true;
      }else if(value >= 40){
        return false
      }
    },
    // 宽度
        bmikuandu(value) {
          if (value <18.5) {
            return `${5 * ((value-0) / 18.5) * 6}%`;
          } else if (value >= 18.5 && value < 24) {
            return `${(6 + ((value-18.5) / 5.5) * 5) * 5}%`;
          } else if (value >= 24 && value < 28) {
            return `${(11 + ((value-24) / 4) * 3) * 5}%`;
          } else if (value >= 28 && value < 30) {
            return `${(14 + ((value-28) / 2) * 2) * 5}%`;
          } else if (value >= 30 && value < 40) {
            return `${(16 + ((value-30) / 10) * 4) * 5}%`;
          } else if (value >= 40) {
            return '100%';
          }
        },
    // 心力能量指数详情
    xinlinengliang(){
      let zhi={
        dec:this.stateData.ecg_power_dec,
        shuzhi:this.stateData.ecg_power,
        text:this.stateData.ecg_power_text,
        wenzi:"身心能量指数"
        
      }
      uni.navigateTo({
        url:'./xinlizhishujieshi?jieu='+encodeURIComponent(JSON.stringify(zhi))
      })
    },
    // 情绪压力指数详情
    qingxuyali(){
      let zhi ={
        dec:this.stateData.emo_stress_dec,
        shuzhi :this.stateData.emo_stress,
        text:this.stateData.emo_stress_text,
        wenzi:"情绪压力指数"
      }
      uni.navigateTo({
        url:'./xinlizhishujieshi?jieu='+encodeURIComponent(JSON.stringify(zhi))
      })
    },
    // 兴奋指数详情
    xinfen(){
      let zhi={
        dec:this.stateData.excitement_dec,
        shuzhi :this.stateData.excitement,
        text:this.stateData.excitement_text,
        wenzi:"兴奋指数"
      }
      uni.navigateTo({
        url:'./xinlizhishujieshi?jieu='+encodeURIComponent(JSON.stringify(zhi))
      })
    },
    // 放松指数详情
    fangsong(){
      let zhi={
        dec:this.stateData.relax_dec,
        shuzhi :this.stateData.relax,
        text:this.stateData.relax_text,
        wenzi:"放松指数"
      }
      uni.navigateTo({
        url:'./xinlizhishujieshi?jieu='+encodeURIComponent(JSON.stringify(zhi))
      })
    },

    jumpMBI(){
      uni.navigateTo({
        url: "./whatBMI",
      });
    },

    async getUser() {
      const res = await getUserInfoByCode(uni.getStorageSync('idCard'))
      if (res.code === 200) {
        console.log("获取用户信息11");
        console.log(res);
        this.userObj.name = res.data.patientName
        this.userObj.age = res.data.patientAge
        this.userObj.sex = res.data.patientSex
        this.userObj.patientHeight = res.data.patientHeight*1
        this.userObj.patientWeight = res.data.patientWeight*1
      }
    },
    getdetail22() {
      uni.request({
        url: 'https://screen.mindyard.cn/get_jecg_single_manb',
        method: 'POST',
        header: {
          'Authorization': uni.getStorageSync('token'),
          'content-type': 'application/json',
        },
        data: {
          pid: this.pid
        },
        dataType: 'json',
        success: res => {
          console.log("心理能量数据")
          console.log(res);
          this.stateData = res.data.ecg_analysis_data
        },
        fail: res2 => {
    
        },
    
      });
    },

  },
};
</script>

<style>
page {
  background-color: #f2f4f6;
  width: 95%;
  margin-bottom: 30rpx;
  margin: 0 auto;
}
</style>
<style lang="scss" scoped>
$main-color: #06cc9c;
.xjb {
  padding: 20rpx 15rpx;
  margin: 20rpx 0;
  display: flex;
  justify-content: space-around;
  .fhx {
    text-align: center;
    background-color: #fafafc;
    padding: 10rpx;
    font-size: 30rpx;
    width: 50%;
  }
  .kzx {
    text-align: center;
    background-color: #fafafc;
    padding: 10rpx;
    font-size: 30rpx;
    width: 50%;
  }
}
.tipText {
  color: $main-color !important;
  text-decoration: underline;
  font-size: 30rpx;
}

.res {
  font-size: 35rpx !important;
  font-weight: 700;
  margin-bottom: 10rpx;
}

.tips {
  position: absolute;
  top: 150rpx;
  left: 30rpx;
  color: #000;
  font-size: 30rpx;
}

.symptom_box {
  position: absolute;
  top: 200rpx;

  .symptom_item {
    display: flex;
    flex-wrap: wrap;
    flex: 33.33%;
    justify-content: space-around;
    align-items: center;

    view {
      width: 210rpx;
      line-height: 60rpx;
      height: 60rpx;
      border: 1px solid #e5e5e5;
      border-radius: 30rpx;
      font-size: 30rpx;
      text-align: center;
      color: #000;
      box-sizing: border-box;
      background-color: #fff;
      margin: 10rpx;
    }

    .active {
      background-color: $main-color;
      color: #fff;
    }
  }

  ::v-deep .uni-easyinput {
    margin-top: 25rpx;
  }
}

.content {
  padding-bottom: 50rpx;
  width: 100%;
  margin: auto;
  background-color: #fafafa;
}

.up {
  height: 150rpx;
  background-color: #fafafa;
  border-radius: 30rpx;
  display: flex;
  /* align-items: center;
*/
}

.mess-img {
  display: flex;
  width: 20%;
  height: 150rpx;
  /* padding: 0 30rpx; */
  align-items: center;
  justify-content: center;
  margin-right: 30rpx;
  margin-left: 30rpx;
}

.up image {
  /* line-height: 150rpx; */
  width: 130rpx;
  height: 130rpx;
  border-radius: 50%;
}

.mess-text {
  width: 60%;
  margin-top: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mess-icon {
  width: 20%;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.down {
  margin-top: 20rpx;
  margin-bottom: 30rpx;
}

.doctorReport {
  background-color: white;
  position: relative;
  border-radius: 20rpx;
  padding: 20rpx;
  overflow: hidden;
  margin-bottom: 20rpx;

  textarea {
    border-radius: 10rpx;
    width: calc(100% - 55rpx);
    background-color: #f9f9f9;
    padding: 20rpx;
    margin-left: 10rpx;
    max-height: 400rpx;
  }

  &-text {
    color: white;
    width: 300rpx;
    height: 60rpx;
    position: absolute;
    top: 0;
    right: 0;
    line-height: 60rpx;
    text-align: center;
    font-weight: 600;
    border-bottom-left-radius: 20rpx;
    background-color: $main-color;
  }

  &-title {
    font-weight: bold;
    line-height: 60rpx;
    margin-left: 10rpx;
    font-size: 35rpx;
  }

  &-tip {
    color: #999999;
    margin-left: 10rpx;
  }

  &-tips {
    margin-left: 10rpx;
  }

  &-tagList {
    display: flex;
    flex-wrap: wrap;
    margin: 15rpx 0;
    flex: 30%;
    justify-content: space-around;
    align-items: center;

    view {
      width: 200rpx;
      line-height: 60rpx;
      height: 60rpx;
      border: 1px solid #e5e5e5;
      border-radius: 30rpx;
      font-size: 30rpx;
      text-align: center;
      color: #000;
      box-sizing: border-box;
      background-color: #fff;
      margin: 10rpx;
    }

    .active {
      background-color: $main-color;
      color: #fff;
    }
  }

  &-food {
    margin-top: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-left {
      color: $main-color;
    }

    &-btn {
      background-color: $main-color;
      color: white;
      height: 70rpx;
      width: 200rpx;
      border-radius: 35rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36rpx;
    }
  }
}

// 顶部个人信息区域
.titleBox {
  background-color: #fff;
  border-radius: 15rpx;
  padding: 20rpx;
  margin: 20rpx 0;

  .title {
    font-style: 35rpx;
    font-weight: 700;
    margin-bottom: 10rpx;
  }

  .item {
    display: flex;
    flex-wrap: wrap;

    view {
      width: 43%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      height: 65rpx;
      line-height: 65rpx;
      font-size: 30rpx;
      font-family: Microsoft YaHei;
      color: #333333;
    }
  }
}

.consult {
  background: #ffffff;
  border-radius: 15rpx;
  padding: 20rpx 15rpx;
  margin: 20rpx 0;
}

.consult view {
  // font-size: 28rpx;
  color: #333333;
}

.consult view text {
  color: rgba(0, 0, 0, 1);
}

.consult .font {
  font-size: 28rpx;
  margin-top: 20rpx;
  color: #666666;
}

.list-item {
  width: 90%;
  height: 100rpx;
  background: #ffffff;
  line-height: 100rpx;
  box-shadow: 0px 3rpx 9rpx 0px rgba(51, 51, 51, 0.05);
  border-radius: 15rpx;
  padding: 0 35rpx 0 45rpx;
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 20rpx;
}

.list-item text:nth-of-type(2) {
  color: #18b5ea;
}

.fonts {
  font-size: 24rpx;
  margin: 20rpx 0;
  color: #999999;
}

.lists .uni-list-cell {
  width: 220rpx;
  height: 60rpx;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 30rpx;
  font-size: 24rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #333333;
  box-sizing: border-box;
  margin: 0 12rpx 14rpx 0;
}

.lists .uni-list-cell.active {
  background-color: $main-color;
  color: #fff;
}

.lists .uni-list-cell:nth-of-type(3n) {
  margin-right: 0;
}

.lists checkbox {
  opacity: 0;
  width: 1px;
  height: 1px;
}

.lists {
  margin: 0 30rpx 20rpx;
}

.lists > text {
  font-size: 30rpx;
  display: block;
  margin-bottom: 30rpx;
  color: #999999;
}

.listtext text {
  display: block;
  font-size: 30rpx;

  margin: 20rpx 0;
  color: #18b5ea;
}

.listtext text:last-child {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 40rpx;
}

.preview {
  width: 600rpx;
  height: 580rpx;
  margin: 0;
}

.report {
  position: absolute;
  top: 0;
  left: 0;
}

.lists .uni-list-cell {
  width: 220rpx;
  height: 60rpx;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 30rpx;
  font-size: 24rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #333333;
  box-sizing: border-box;
  margin: 0 12rpx 14rpx 0;
}

.lists .uni-list-cell.active {
  background-color: $main-color;
  color: #fff;
}

.lists .uni-list-cell:nth-of-type(3n) {
  margin-right: 0;
}

.lists checkbox {
  opacity: 0;
  width: 1px;
  height: 1px;
}

.lists {
  margin: 0 30rpx 20rpx;
}

.lists > text {
  font-size: 30rpx;
  display: block;
  margin-bottom: 30rpx;
  color: #999999;
}

.marginBottom10 {
  margin-bottom: 10rpx;
}

.tip_box {
  width: 100%;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  text-align: justify;
  background-color: #fff;
}

.tip_header {
  font-size: 32rpx;
  font-weight: 700;
  width: 250rpx;
  margin: 0 auto;
}

.tip_title {
  font-size: 30rpx;
  font-weight: 700;
}

.tip_content {
  font-size: 30rpx;

  text {
    margin-left: 58rpx;
  }
}

.stateList {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 15rpx;
  margin: 20rpx 0;

  &-hand {
    &-left {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      font-size: 36rpx;
      flex: 0;

      .iconfont {
        font-size: 36rpx;
        color: $main-color;
      }

      &-tips {
        font-size: 24rpx;
        color: #999999;
      }

      text {
        margin-left: 10rpx;
      }
    }

    &-tips {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-left {
        font-size: 24rpx;
        color: #a1a1a1;
        margin-left: 10rpx;
      }

      &-right {
        color: $main-color !important;
      }
    }
  }

  &-list {
    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f9f9f9;
      padding: 20rpx 40rpx 20rpx 20rpx;
      margin: 20rpx 0;
      border-radius: 20rpx;
      flex-wrap: wrap;

      .list-item-left {
        display: flex;

        .item-left-name {
          margin-left: 10rpx;
        }

        .item-left-value {
          margin-left: 20rpx;
        }
      }

      .list-item-right {
      }

      .list-item-tips {
        //父元素是flex布局，自身另起一行并独占一行
        display: block;
        width: 100%;
        margin-top: 10rpx;
        margin-left: 10rpx;
        font-size: 24rpx;
        color: $main-color;
        flex-shrink: 0;
      }
    }
  }
}

.orange {
  color: $main-color !important;
}

.youfenxian {
  color: #ff9983 !important;
}

.trend {
  margin: 15rpx auto;
  width: 686rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx 0;

  .trend-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx;
  }

  .dateBox {
    border-radius: 8rpx;
    border: 2rpx solid #d9d9d9;
    padding: 8rpx 15rpx;
    font-size: 25rpx;
    color: #8c8c8c;
    width: max-content;
  }

  .trendCharts {
    width: 100%;
    height: 400rpx;
  }
}

.trendSwiper {
  margin-top: 20rpx;
  width: 100%;
  height: 450rpx;
}

.qiuyunbox {
  height: 350rpx;
  width: 100%;
  padding-right: 50rpx;
}

.swiperTitle {
  width: 100%;
  text-align: center;
  font-size: 40rpx;
  font-weight: 700;
}

.trendTips {
  height: 200rpx;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40rpx;
  color: #999999;
}

.hreatChance-box {
  height: 372rpx;
  width: 628rpx;
  background-color: #fafafc;
  border-radius: 16rpx;
  margin: auto;

  .cvs {
    width: 100%;
    height: 100%;
  }

  .cvs-ctx {
    position: absolute;
    left: 0;
    top: 0;
  }
}

.selectST {
  z-index: 999;
  width: 600rpx;
  //position: fixed;
  //top: 50%;
  //left: 50%;
  //transform: translate(-50% -50%);
  background-color: white;
  border-radius: 16rpx;
  padding: 12rpx;

  &-title {
    font-size: 20px;
  }

  &-tags {
    margin-top: 12rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    uni-tag {
      margin: 8rpx 4rpx;
      font-size: 16px;
      height: 30px;
    }

    ::v-deep .uni-tag {
      font-size: 16px;
      line-height: 16px;
      font-weight: 400;
    }

    uni-tag:last-child {
      margin-right: auto;
    }
  }

  &-other {
  }

  &-textbox {
    border: 1px solid #999;
    background-color: #8df5dd;

    textarea {
      height: none;
      //最小高度为1个文字高度加上4rpx，最大高度显示三行文字，高度自适应
      min-height: calc(1em * 1.1 + 4rpx);
      max-height: calc(3 * 1em * 1.1 + 4rpx);
      width: 100%;
      padding: 12rpx;
    }
  }

  .selectST-btn {
    margin-top: 20rpx;
  }
}

.selectST {
  width: 100%;
  border-radius: 0 0 16rpx 16rpx;
}

// 弹窗中的值选中状态
::v-deep .uni-tag--primary {
  background-color: #00ca99 !important;
  border-color: #00ca99 !important;
  color: #fff !important;
  display: block !important;
  width: 100% !important;
  text-align: center !important;
}

// 弹窗中的值未选中状态
::v-deep .uni-tag-text--primary {
  color: #755555 !important;
}

::v-deep .uni-tag--inverted {
  background-color: #f8f8fa !important;
}

::v-deep .uni-tag--primary--inverted {
  border-color: #f8f8fa !important;
}

::v-deep .selectST-tags uni-tag {
  width: 32% !important;
  height: 69rpx !important;
}

::v-deep .uni-tag-text--primary {
  display: block !important;
  width: 100% !important;
  text-align: center !important;
}

::v-deep .uni-tag {
  padding: 7px !important;
}

.selectST .bianti {
  font-weight: 700;
  font-size: 30rpx;
}

.tanchuanganniu {
  margin-top: 10px;
  border-top: 1px solid #878787;
  display: flex;
}

.tanchuanganniu ::v-deep .quxiao {
  width: 50% !important;
  background-color: #ffffff;
  color: #878787;

  border-radius: 10px 0 0 10px;
}

.tanchuanganniu ::v-deep .queding {
  background-color: #00ca99;
  width: 50%;
  border-radius: 0 10px 10px 0;
}

// .selectST-tags ::v-deep .data-v-3db4c624:last-chil{
//   margin-left: 2rpx;
// }
.selectST-tags uni-tag:last-child {
  margin-left: 10rpx !important;
  margin-right: auto !important;
}

.kuang {
}

.stateList-list .stateList-list-item:last-child {
  margin-bottom: 0;
}

.bianti {
  font-size: 35rpx;
  ont-weight: 700;
}

.biankuang {
  margin: 20rpx 0;
}
.AIfenxijieguo {
  // background-size: contain;
  background-size: 250rpx;
  background-repeat: no-repeat;
  background-position: right top;
}
.zuoyou {
  display: flex;
  justify-content: space-between;
}

.xinji {
  background: #ffffff;
  border-radius: 15rpx;
  margin: 20rpx 0;

  .xinji_lan {
    position: relative;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    border-radius: 15rpx;
    background-color: #f7f7f7;
    margin: 20rpx 0;
    align-items: center;

    .xinji_lan_mc {
      padding: 20rpx;
    }
    .xinji_lan_fenxian {
      position: relative;
      right: 0;
      z-index: 5;
      padding-right: 20rpx;
    }
    .beijin {
      // padding-right: 20rpx;
      height: 100%;
      // width: 20%;
      right: 0;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      // background-color: rgba(224, 250, 215, 0.5);
    }
  }
}
.genfenxian {
  // background-color: rgba(255, 0, 0, 0.5) !important;
  color: #a5222c !important;
}
.zhongfenxian {
  color: #e5977a !important;
}
.difenxian {
  // background-color: rgba(224, 250, 215, 0.5) !important;
  color: #44ab1f !important;
}
.hong {
  background-color: rgba(165, 34, 44, 0.3) !important;
  color: #a5222c !important;
}
.huangs {
  background-color: rgba(245, 189, 0, 0.3) !important;
  color: #e5977a !important;
}
.lv {
  background-color: rgba(224, 250, 215, 0.5) !important;
  color: #44ab1f !important;
}
.xinli{
  position:relative;
  padding: 20rpx;
  .xinli_top{
    display: flex;
    justify-content: space-between;
    align-items:center;
    border-radius: 34rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
       border-bottom: 1px solid #EFEFF1;
      font-weight: 700;
      font-size: 42rpx;
  }
  .xinli_bottom{
    width: 35%;
    margin-top: 20rpx;
     margin-left: auto; 
     padding: 10rpx 20rpx;
     background: #EFEFF1;
     border-radius: 75rpx;
     text-align: center;
  }
}
.xinli::after{
  content: '';
  position:relative;
  width: 100rpx;
  height: 100rpx;
  background-color: #18b5ea;
}
.blue{
   background-image: linear-gradient(to right, rgb(213, 238, 250), rgba(255, 255, 255,0));
}
.yellow{
  background-image: linear-gradient(to right, rgb(247,237,199), rgba(255, 255, 255,0));
}

.green{background-image: linear-gradient(to right, rgb(23,208,107), rgba(255, 255, 255,0));}
.red{background-image: linear-gradient(to right, rgb(232,118, 89), rgba(255, 255, 255,0));}
.zise{background-image: linear-gradient(to right, rgb(124, 58,237), rgba(255, 255, 255,0));}

.jintutiao{
  .jintutiao_shuzi{
    display: flex;
    margin-bottom: 10rpx;
  }
  .jintutiao_sansetiao{
    display: flex;
        border-radius: 30rpx;
        overflow: hidden;
        height: 25rpx;
  }
  .jintutiao_wenzi{
    
    display: flex;
    align-items:center;
    margin-top: 10rpx;
    .sanjiao{
      // border-right: 10rpx solid transparent;
      // border-left: 10rpx solid transparent;
      // border-bottom: 20rpx solid black;
      width: 0;
      height: 0;
      border: 0 solid transparent;
      transform: translateX(-50%);
      border-right: 10rpx solid transparent;
      border-left: 10rpx solid transparent;
      border-bottom: 20rpx solid black;
    }
    .sanjiao_wenzi{
      color: #BAC2CE !important;
    }
  }
}
.jiewei{
  text-indent: 2em;
      line-height: 1.5;
}
</style>