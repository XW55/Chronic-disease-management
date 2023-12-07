export function checkPhone(mobile) {
  const phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (mobile.length == 11) { // 手机号码
    if (phone.test(mobile)) {
      return true;
    }
  }
  return false;
}

export function checkPassword(password) {
  const phone = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
  if (phone.test(password)) {
    return true;
  }
  return false;
}

function getGUIDDate(date) {
  return date.getFullYear() + addZero(date.getMonth() + 1) +
    addZero(date.getDay());
}

function getGUIDTime(date) {
  return addZero(date.getHours()) + addZero(date.getMinutes()) +
    addZero(date.getSeconds()) + addZero(parseInt(date.getMilliseconds() / 10));
}

/*
 * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现
 */
function addZero(num) {
  if (Number(num).toString() !== 'NaN' && num >= 0 && num < 10) {
    return `0${Math.floor(num)}`;
  } else {
    return num.toString();
  }
}

/*
 * 功能：将y进制的数值，转换为x进制的数值
 */
function hexadecimal(num, x, y) {
  if (y !== undefined) {
    return parseInt(num.toString(), y).toString(x);
  } else {
    return parseInt(num.toString()).toString(x);
  }
}

function formatGUID(guidStr) {
  const str1 = `${guidStr.slice(0, 8)}-`;
  const str2 = `${guidStr.slice(8, 12)}-`;
  const str3 = `${guidStr.slice(12, 16)}-`;
  const str4 = `${guidStr.slice(16, 20)}-`;
  const str5 = guidStr.slice(20);
  return str1 + str2 + str3 + str4 + str5;
}
export function GUID() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  const millisecond = date.getMilliseconds() < 10
    ? `00${date.getMilliseconds()}`
    : date.getMilliseconds() < 100
    ? `0${
    date.getMilliseconds()}`
    : date.getMilliseconds();
  // 获得一个随机三位数字字符串,前两位可以为0
  let random = Math.floor(Math.random() * 1000);
  if (random == 0) {
    random = '000';
  } else if (random < 10) {
    random = `00${random}`;
  } else if (random < 100) {
    random = `0${random}`;
  }
  return String(String(String(String(String(String(String(year) + month) + day) + hour) + minute) + second) +
    millisecond) + random;
}
export function GUIDS() {
  const date = new Date();
  let guidStr = '';
  const sexadecimalDate = hexadecimal(getGUIDDate(date), 16);
  const sexadecimalTime = hexadecimal(getGUIDTime(date), 16);
  for (let i = 0; i < 9; i++) {
    guidStr += Math.floor(Math.random() * 16).toString(16);
  }
  guidStr += sexadecimalDate;
  guidStr += sexadecimalTime;
  while (guidStr.length < 32) {
    guidStr += Math.floor(Math.random() * 16).toString(16);
  }
  return formatGUID(guidStr);
}

export function requestPostProxySetHead(url, data, header) {
  let cUrl = getApp().globalData.serverUrl + url;
  if (url.indexOf('https') == 0) {
    cUrl = url;
  }
  return new Promise((resolve, reject) => {
    uni.request({
      header,
      url: cUrl,
      data,
      method: 'POST',
      timeout: 30000,
      success: (res) => {
        if ((typeof res.data) === 'string') {
          const resData = JSON.parse(res.data);
          resolve(resData);
        } else {
          resolve(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}
