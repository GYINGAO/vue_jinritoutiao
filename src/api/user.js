import request from 'utils/request';
// 用户认证（登录注册）
export const login = data => {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data
  });
};
// 获取短信验证码
export const sendCode = mobile => {
  return request({
    method: 'get',
    url: '/app/v1_0/sms/codes/' + mobile
  });
};
// 获取用户的关注列表
export const getFollowings = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/followings'
  });
};
// 获取用户的粉丝列表
export const getFollowers = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/followers'
  });
};
// 获取用户个人资料
export const getProfile = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/profile'
  });
};
// 获取用户的统计数据
export const getFigure = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/figure'
  });
};
// 获取用户自己信息
export const getUserInfo = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user'
  });
};

// 获取指定用户信息
export const getUserInfoById = id => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/' + id
  });
};
// 编辑用户个人资料（包含实名认证）
export const editProfile = data => {
  return request({
    method: 'patch',
    url: '/app/v1_0/user/profile',
    data
  });
};
// 编辑用户照片资料（头像、身份证照片）
export const editPhoto = data => {
  return request({
    method: 'patch',
    url: '/app/v1_0/user/photo',
    data
  });
};
// 关注用户
export const addFollow = id => {
  return request({
    method: 'post',
    url: '/app/v1_0/user/followings',
    data: {
      target: id
    }
  });
};
// 取消关注用户
export const deleteFollow = id => {
  return request({
    method: 'delete',
    url: '/app/v1_0/user/followings/' + id
  });
};
