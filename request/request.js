import request from './index.js';
// 示例
export const login = (data) => {
  return request({
    url: '/login',
    method: 'POST',
    data,
  });
};
// 请求tabbar的知识列表 (分页)
export const getknowList = (data) => {
  return request({
    url: '',
    method: 'GET',
    data,
  });
};
// 根据id请求知识详情
export const getknowDetail = (data) => {
  return request({
    url: '',
    method: 'GET',
    data,
  });
};
// 收藏/取消收藏
export const setCollect = (data) => {
  return request({
    url: '',
    method: 'GET',
    data,
  });
};
// 获取用户收藏列表
export const getCollectList = (data) => {
  return request({
    url: '',
    method: 'GET',
    data,
  });
};
