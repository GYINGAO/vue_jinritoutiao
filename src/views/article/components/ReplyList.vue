<template>
  <div class="container">
    <van-nav-bar class="header" :title="totalCount + '条回复'" @click-left="$emit('close')">
      <van-icon slot="left" name="close"></van-icon>
    </van-nav-bar>
    <!-- 回复列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="已展示全部回复" @load="onLoad">
      <van-cell title="全部评论"></van-cell>
      <comment-item
        v-for="(reply, index) in replyList"
        :key="index"
        :comment="reply"
        @show-reply="onShowReply"
      ></comment-item>
    </van-list>
    <div class="write-reply">
      <van-button type="default" round @click="isWriteCommentShow = true">写回复</van-button>
    </div>
    <van-popup
      v-model="isWriteCommentShow"
      :style="{ height: '20%' }"
      get-container="body"
      position="bottom"
    >
      <write-comment :article-id="articleId" :comment-id="comment.com_id"></write-comment>
    </van-popup>
  </div>
</template>
<script>
import WriteComment from './WriteComment.vue';
import CommentItem from './CommentItem.vue';
import { getComment } from 'api/comment';
export default {
  name: 'ReplyList',
  props: {
    comment: {
      type: [String, Number, Object],
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      replyList: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      totalCount: 0,
      isWriteCommentShow: false
    };
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      const res = await getComment({
        type: 'c',
        source: String(this.comment.com_id),
        offset: this.offset,
        limit: this.limit
      });
      this.replyList.push(...res.data.results);
      this.totalCount = res.data.total_count;
      this.loading = false;
      // 数据全部加载完成
      if (res.data.results.length === 0) {
        this.finished = true;
      } else {
        this.offset = res.data.last_id;
      }
    }
  },
  components: { CommentItem, WriteComment }
};
</script>
<style scoped lang="less">
.container {
  position: relative;
  .header {
    background-color: #fff;
    /deep/ .van-nav-bar__title {
      color: #333;
    }
    .van-nav-bar__left {
      .van-icon {
        color: #333;
        font-size: 14px;
      }
    }
  }
  .write-reply {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding-top: 4px;
    padding-bottom: 10px;
    border-top: 1px solid #eee;
    .van-button {
      left: 62.5px;
      width: 250px;
      height: 34px;
    }
  }
}
</style>
