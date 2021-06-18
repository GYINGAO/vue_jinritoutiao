import request from 'utils/request';
// 全部频道列表
export const getAllChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/channels'
  });
};
// 批量修改用户频道列表（部分覆盖）
export const setChannel = data => {
  return request({
    method: 'patch',
    url: '/app/v1_0/user/channels',
    data
  });
};
// 获取用户频道列表
export const getChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/channels'
  });
};
// 删除指定用户频道
export const deleteChannel = id => {
  return request({
    method: 'delete',
    url: '/app/v1_0/user/channels/' + id
  });
};
