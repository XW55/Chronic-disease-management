import request from './index.js';
// 获取验证码
export const getCode = (data) => {
  return request({
    url: '/sms/code',
    method: 'POST',
    data,
  });
};
// 携带 uuid 和 验证码登录
export const userLogin = (data) => {
  return request({
    url: '/patientLogin',
    method: 'POST',
    data,
  });
};
// 用户提交表单
export const initUserInfo = (data) => {
  return request({
    url: '/patient_app/patient/addPatient',
    method: 'POST',
    data,
  });
};
// 用户通过身份证查询个人信息

export const getUserInfoByCode = (data) => {
  return request({
    url: `/patient_app/patient/getPatientByCode?code=${data}`,
    method: 'GET',
  });
};
// 请求tabbar的知识列表 (分页)
export const getknowList = (data) => {
  return request({
    url: '/patientApp/propaganda/getPropagandaList',
    method: 'GET',
    data,
  });
};
// 根据id请求知识详情
export const getknowDetail = (data) => {
  return request({
    url: `/patientApp/propaganda/getPropagandaById?propagandaId=${data}`,
    method: 'GET',
  });
};
// 文章的阅读量
export const getRead = (data) => {
  return request({
    url: `/patientApp/propaganda/updatePropaganda`,
    method: 'PUT',
    data,
  });
};
// 收藏文章
export const addCollect = (data) => {
  return request({
    url: '/patientApp/collect/addPatientCollect',
    method: 'POST',
    data,
  });
};
// 用户取消收藏
export const delCollect = (data) => {
  return request({
    url: '/patientApp/collect/delByPatientCollect',
    method: 'DELETE',
    data,
  });
};
// 获取用户收藏列表
export const getCollectList = (data) => {
  return request({
    url: '/patientApp/collect/getCollectListByPatient',
    method: 'GET',
    data,
  });
};
// 获取用户的用药计划（医生设置或用户自定义设置）
export const getMedicaPlan = (data) => {
  return request({
    url: '',
    method: 'GET',
    data,
  });
};
// 用户打卡，服用次数

// 病历得查看
export const getMedicaHis = (data) => {
  return request({
    url: `/patient_app/patient/getReportByCode?code=${data}`,
    method: 'GET',
  });
};
// 用户添加用药计划
export const addMedica = (data) => {
  return request({
    url: `/patientApp/pharmacyPlan/addPharmacyPlan`,
    method: 'POST',
    data,
  });
};
// 用户根据身份证请求药品计划
export const getMedica = (data) => {
  return request({
    url: `/patientApp/pharmacyPlan/getList`,
    method: 'GET',
    data,
  });
};
// 用户根据Id修改药品计划
export const updateMedica = (data) => {
  return request({
    url: `/patientApp/pharmacyPlan/updatePharmacyPlan`,
    method: 'POST',
    data,
  });
};
// 根据药品Id删除
export const deleteMedicine = (data) => {
  return request({
    url: `/patientApp/pharmacyPlan/deletePharmacyPlan/${data}`,
    method: 'DELETE',
  });
};
// 用户吃药打卡
export const clockInMedicine = (data) => {
  return request({
    url: `/patientApp/pharmacyRegister/addPharmacyRegister`,
    method: 'POST',
    data,
  });
};
// 获取科室列表
export const getDepartment = (data) => {
  return request({
    url: `/patientApp/patientPlan/getDepartmentTreeList`,
    method: 'GET',
  });
};
// 根据科室查询医生
export const getDoctor = (data) => {
  return request({
    url: `/patientApp/patientPlan/getDateDocPlanList`,
    method: 'GET',
    data,
  });
};
