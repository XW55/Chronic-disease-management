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
// 正则表达式验证抽取数字
export function taleNumber(str) {
  const matchResult = str.match(/\d+/);
  if (matchResult) {
    return parseInt(matchResult[0], 10);
  } else {
    return console.log('未找到数字');
  }
}
