import App from './App';
import Vue from 'vue';
// #ifndef VUE3
Vue.config.productionTip = false;
App.mpType = 'app';

// 封装弹框通用提示方法
uni.$showMsg = (title, icon = 'none', duration = 1000) => {
  uni.showToast({
    title,
    duration,
    icon,
  });
};

try {
  function isPromise(obj) {
    return (
      Boolean(obj) &&
      (typeof obj === 'object' || typeof obj === 'function') &&
      typeof obj.then === 'function'
    );
  }

  // 统一 vue2 API Promise 化返回格式与 vue3 保持一致
  uni.addInterceptor({
    returnValue(res) {
      if (!isPromise(res)) {
        return res;
      }
      return new Promise((resolve, reject) => {
        res.then((res) => {
          if (res[0]) {
            reject(res[0]);
          } else {
            resolve(res[1]);
          }
        });
      });
    },
  });
} catch (error) {}

const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// main.js，注意要在use方法之后执行
import uView from 'uview-ui';
Vue.use(uView);
// 如此配置即可
uni.$u.config.unit = 'rpx';

// #ifdef VUE3
import {
  createSSRApp,
} from 'vue';
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
