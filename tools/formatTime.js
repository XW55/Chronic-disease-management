// 接收一个时间戳，格式化日期
export function formatTimeStamp(value) {
  const date = new Date(value); // 将毫秒级别时间戳传递给 Date 构造函数
  const year = date.getFullYear(); // 获取年份
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，并补齐前导零
  const day = String(date.getDate()).padStart(2, '0'); // 获取日期，并补齐前导零
  return `${year}-${month}-${day}`; // 拼接成 'YYYY-MM-DD' 格式的日期
}
