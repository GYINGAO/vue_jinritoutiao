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
// 获取新闻文章详情
export const getArticleById = id => {
  return request({
    method: 'get',
    url: '/app/v1_0/articles/' + id
  });
};
// 收藏文章
export const addCollectionById = id => {
  return request({
    method: 'post',
    url: '/app/v1_0/article/collections',
    data: {
      target: id
    }
  });
};
// 取消收藏文章
export const deleteCollectionById = id => {
  return request({
    method: 'delete',
    url: '/app/v1_0/article/collections/' + id
  });
};
// 对文章点赞
export const addLikingById = id => {
  return request({
    method: 'post',
    url: '/app/v1_0/article/likings',
    data: {
      target: id
    }
  });
};
// 取消对文章点赞
export const deleteLikingById = id => {
  return request({
    method: 'delete',
    url: '/app/v1_0/article/likings/' + id
  });
};
