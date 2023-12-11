// 记录异步请求的次数
let num = 0;
// 统一的请求根路径
const baseUrl = 'https://chronic.mindyard.cn/prod-api'
// const baseUrl = 'http://192.168.1.11:9002';
const request = (params) => {
  console.log('请求参数是', params);
  const header = {
    ...params.header,
  };
  // 默认添加token
  header.Authorization = uni.getStorageSync('token');
  // 判断 url 需要额外的请求头
  if (params.method === 'POST' || params.method === 'PUT') {
    console.log('这是post请求');
    header['Content-Type'] = 'application/json';
  }
  // 每次调用该函数就先 ++
  num++;
  // 加载中提示消息
  if (num === 1) {
    uni.showLoading({
      title: '加载中',
      mask: true,
    });
  }
  // 返回出去一个 promise
  return new Promise((resolve, reject) => {
    // 网络请求
    uni.request({
      // 对参数使用展开运算符进行展开
      ...params,
      // 根路径拼接上传递过来的路径
      url: baseUrl + params.url,
      header,
      dataType: params.dataType || 'json',
      success: (result) => {
        resolve(result.data);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        // 在所有的请求完毕后关闭消息提示
        num--;
        if (num === 0) {
          uni.hideLoading();
        }
      },
    });
  });
};
export default request;