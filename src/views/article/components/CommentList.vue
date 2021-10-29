<template>
  <div>
    <van-list v-model="loading" :finished="finished" finished-text="已展示全部评论" @load="onLoad">
      <van-cell title="全部评论"></van-cell>
      <comment-item
        v-for="(comment, index) in commentList"
        :key="index"
        :comment="comment"
        :show-reply="true"
        :article-id="articleId"
        @toggle-footer="$emit('emit-footer', $event)"
      ></comment-item>
    </van-list>
  </div>
</template>
<script>
import { getComment } from 'api/comment';
import CommentItem from './CommentItem.vue';
export default {
  name: 'CommentList',
  props: {
    articleId: {
      type: [Object, Number, String],
      required: true
    }
  },
  data() {
    return {
      commentList: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      totalCount: 0
    };
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      const res = await getComment({
        type: 'a',
        source: String(this.articleId),
        offset: this.offset,
        limit: this.limit
      });
      this.commentList.push(...res.data.results);
      this.totalCount = res.data.total_count;
      this.$emit('updata-count', this.totalCount);
      this.loading = false;
      // 数据全部加载完成
      if (res.data.results.length === 0) {
        this.finished = true;
      } else {
        this.offset = res.data.last_id;
      }
    }
  },
  components: { CommentItem }
};
</script>
<style scoped lang="less"></style>
