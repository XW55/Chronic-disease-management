const API_BASE_URL = {
  development: {
    // base: 'https://ecg.mindyard.cn/prod-api',
    base: 'http://172.28.80.29:9101',
    // algorithm: 'https://screen.mindyard.cn:84',
    // algorithmUpload: 'https://server.mindyard.cn:84',
    // algorithmUpload: 'https://screen.mindyard.cn/test',
  },
  production: {
    base: 'https://ecg.mindyard.cn/prod-api',
    algorithm: 'https://screen.mindyard.cn:84',
    algorithmUpload: 'https://server.mindyard.cn:84',
  },
}

const request = (option, header = {}) => {
  const base_url = API_BASE_URL[process.env.NODE_ENV][option.urlType || 'base'];

  if (!option.hideLoading) {
    uni.showLoading({
      mask: true
    });
  }
  header = {
    'Content-Type': 'application/json',
    dataType: 'json',
    ...header,
  }
  if (option.auth !== false) header.Authorization = 'Bearer ' + uni.getStorageSync('token') || ''
  return new Promise((resolve, reject) => {
    uni.request({
      url: base_url + option.url,
      method: option.method || 'GET',
      // withCredentials: true,
      header,
      data: option.data,
      success: (res) => {
        const {
          data
        } = res
        if (data.code === 401) {
          uni.removeStorageSync('token')
          uni.reLaunch({
            url: '/modif/login/login'
          })
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: data.msg
            })
          }, 0)
          return reject(res.data)
        }

        if (res.statusCode !== 200) return reject(data)
        if (data.code === 200 || data.code === '200') return resolve(data.data || data)
        // uni.showModal({
        //   title: '提示',
        //   showCancel: false,
        //   confirmColor: '#3371FF',
        //   content: data.message,
        //   success: () => {
        //     uni.hideLoading();
        //   },
        // });
        return reject(data)
      },
      fail: (err) => {
        uni.showToast({
          icon: 'none',
          title: '服务器请求失败'
        })
        reject(err)
      },
      complete: (err) => {
        uni.hideLoading()
      },
    })
  })
}

export default request