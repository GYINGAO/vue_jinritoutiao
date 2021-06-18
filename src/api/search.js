import request from 'utils/request';
// 获取联想建议（自动补全）
export const getSuggestions = params => {
  return request({
    method: 'get',
    url: '/app/v1_0/suggestion',
    params
  });
};
// 获取搜索结果
export const getSearchResult = params => {
  return request({
    method: 'get',
    url: '/app/v1_0/search',
    params
  });
};
// 获取用户搜索历史
export const getHistory = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/search/histories'
  });
};
// 删除用户搜索历史
export const deleteHistory = () => {
  return request({
    method: 'delete',
    url: '/app/v1_0/search/histories'
  });
};
