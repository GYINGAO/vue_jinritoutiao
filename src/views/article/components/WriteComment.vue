<template>
  <div>
    <van-field
      class="input"
      v-model="content"
      rows="4"
      autosize
      type="textarea"
      maxlength="60"
      placeholder="优质评论将被优先展示"
      show-word-limit
      clearable
      :border="true"
    >
      <van-button class="submit" slot="button" @click="postComment">发布</van-button>
    </van-field>
  </div>
</template>
<script>
import { addComment } from 'api/comment';
export default {
  name: 'WriteComment',
  props: {
    commentId: {
      type: [String, Object, Number],
      default: null
    },
    articleId: {
      type: [String, Object, Number],
      required: true
    }
  },
  data() {
    return {
      content: ''
    };
  },
  methods: {
    async postComment() {
      if (!this.content) {
        this.$toast('内容为空');
        return;
      }
      this.$toast.loading({
        message: '发表中...',
        forbidClick: true
      });
      try {
        await addComment({
          target: String(this.commentId),
          content: this.content,
          art_id: String(this.articleId)
        });
        this.$toast.success('发表成功');
      } catch (error) {
        this.$toast.fail(error.response.data.message);
      }
    }
  },
  components: {}
};
</script>
<style scoped lang="less">
.submit {
  border: unset;
}
</style>
