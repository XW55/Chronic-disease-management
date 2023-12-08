// 接收一个时间戳，格式化日期
export function formatTimeStamp(value) {
  const date = new Date(value); // 将毫秒级别时间戳传递给 Date 构造函数
  const year = date.getFullYear(); // 获取年份
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，并补齐前导零
  const day = String(date.getDate()).padStart(2, '0'); // 获取日期，并补齐前导零
  return `${year}-${month}-${day}`; // 拼接成 'YYYY-MM-DD' 格式的日期
}
// 获取当前的年月日 - 时分秒
export function getTime(flag) {
  const date = new Date();
  const currentYear = date.getFullYear();
  // 注意：月份是从 0 开始计数，所以需要加 1
  const currentMonth = String(date.getMonth() + 1).padStart(2, '0'); // 在月份前面添加零
  const currentDay = String(date.getDate()).padStart(2, '0'); // 在日期前面添加零
  const currentHour = String(date.getHours()).padStart(2, '0'); // 在小时数前面添加零
  const currentMinute = String(date.getMinutes()).padStart(2, '0'); // 在分钟数前面添加零
  const currentSecond = String(date.getSeconds()).padStart(2, '0'); // 在秒数前面添加零
  // 如果为true返回年月日时分秒 否则返回年月日
  if (flag) {
    return `${currentYear}-${currentMonth}-${currentDay} ${currentHour}:${currentMinute}:${currentSecond}`;
  } else {
    return `${currentYear}-${currentMonth}-${currentDay}`;
  }
}
// 给定的 ISO 8601 格式字符串创建日期对象  返回年月日时分秒 或者年月日
export function strToDate(str, flag = true) {
  const date = new Date(str); // 将字符串转换为日期对象
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2); // 获取并补零月份
  const day = (`0${date.getDate()}`).slice(-2); // 获取并补零日期
  const hour = (`0${date.getHours()}`).slice(-2); // 获取并补零小时
  const minute = (`0${date.getMinutes()}`).slice(-2); // 获取并补零分钟
  const second = (`0${date.getSeconds()}`).slice(-2); // 获取并补零秒数\
  if (flag) {
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  } else {
    return `${year}-${month}-${day}`; // 格式化结果为 "YYYY-MM-DD"
  }
}

// 正则表达式验证抽取数字
export function taleNumber(str) {
  const matchResult = str.match(/\d+/);
  if (matchResult) {
    return parseInt(matchResult[0], 10);
  } else {
    return console.log('未找到数字');
  }
}
// 获取本周日期
export function getThisWeekDates() {
  // 创建一个 Date 对象
  const today = new Date();

  // 获取当前日期是星期几（0 表示星期日，1 表示星期一，以此类推）
  const dayOfWeek = today.getDay();

  // 计算本周的开始日期和结束日期
  // 本周的开始日期为当前日期减去星期几再加上 1
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek + 1);
  // 本周的结束日期为当前日期加上 (6 - 星期几)
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - dayOfWeek + 1));
  // 格式化起始日期
  const startYear = startDate.getFullYear();
  const startMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
  const startDateValue = startDate.getDate().toString().padStart(2, '0');
  const formattedStartDate = `${startYear}-${startMonth}-${startDateValue}`;

  // 格式化结束日期
  const endYear = endDate.getFullYear();
  const endMonth = (endDate.getMonth() + 1).toString().padStart(2, '0');
  const endDateValue = endDate.getDate().toString().padStart(2, '0');
  const formattedEndDate = `${endYear}-${endMonth}-${endDateValue}`;
  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
}
// 获取今天的时间，然后按顺序将七天以{week:'日',day:23,time:'yyyy-mm-nn'}的形式存入dataList,要考虑到月末和年末的情况
export function getWeek() {
  const today = new Date(); // 获取今天的日期
  const date2 = new Date(today);
  const dateArray = [];
  for (let i = 0; i < 7; i++) {
    date2.setDate(today.getDate() + i);
    const day = date2.getDate();
    let week = date2.getDay();
    const everyDay = `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`;
    const weekArray = ['日', '一', '二', '三', '四', '五', '六'];
    week = weekArray[week];
    dateArray.push({
      day,
      week,
      time: everyDay,
    }); // 获取未来7天内的日期
  }
  return dateArray;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];

  return {
    week,
    day,
    time: `${year}-${month}-${day}`,
  };
}
export default function formatTimeBp(timeStr) {
  const date = new Date(timeStr);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  const hour = (`0${date.getHours()}`).slice(-2);
  const minute = (`0${date.getMinutes()}`).slice(-2);
  const second = (`0${date.getSeconds()}`).slice(-2);

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function getTwoWeek() {
  const dataList = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const futureDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const formattedDate = formatDate(futureDate);
    dataList.push(formattedDate);
  }

  return dataList;
}
