import request from './index.js';
// 示例
export const login = (data) => {
  return request({
    url: '/login',
    method: 'POST',
    data,
  });
};
