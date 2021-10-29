import request from 'utils/request';

// 获取评论或评论回复
export const getComment = (params, data) => {
  return request({
    method: 'get',
    url: '/app/v1_0/comments',
    params,
    data
  });
};
// 对评论或评论回复点赞
export const addLiking4Comment = id => {
  return request({
    method: 'post',
    url: '/app/v1_0/comment/likings',
    data: {
      target: id
    }
  });
};
// 取消对评论或评论回复点赞
export const deleteLiking4Comment = id => {
  return request({
    method: 'delete',
    url: '/app/v1_0/comment/likings/' + id
  });
};
// 添加评论或评论回复
export const addComment = data => {
  return request({
    method: 'post',
    url: '/app/v1_0/comments',
    data
  });
};
