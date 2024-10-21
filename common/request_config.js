import urlApi from './request_url.js'
let baseUrl = urlApi;
export const request = (options) => {
  let header = {
    'Content-Type': 'application/json',
    'Authorization': uni.getStorageSync('token')
  };
  return new Promise((resolve, reject) => {
    if(!options.hideLoading){
      uni.showLoading({
        title: '加载中',
      })
    }
    uni.request({
      //检测url是否是完成连接，若不是则在前面拼接baseUrl
      url: options.url.indexOf('http') === 0 ? options.url : baseUrl + options.url,
      method: options.method || 'GET',
      header: options.header || header,
      dataType: options.dataType || 'json',
      data: options.data || {},
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        uni.showToast({
          title: '请求失败,请检查网络或稍后重试',
          icon: 'none'
        })
        console.log("请求失败的url是:"+options.url.indexOf('http') === 0 ? options.url : baseUrl + options.url)
        reject(err)
      },
      complete: () => {
        if(!options.hideLoading){
          uni.hideLoading()
        }
      }
    })
  })
}
