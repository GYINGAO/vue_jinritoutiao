import request from 'utils/request';

// 获取用户收藏列表
export const getCollections = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/article/collections'
  });
};
// 获取用户阅读历史
export const getHistory = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/histories'
  });
};

// 获取文章列表
export const getArticleList = params => {
  return request({
    method: 'get',
    url: '/app/v1_1/articles',
    params
  });
};
