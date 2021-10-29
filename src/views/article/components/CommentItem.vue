<template>
  <div>
    <van-cell class="comment-wrap">
      <van-image
        class="avatar"
        slot="icon"
        :src="comment.aut_photo"
        width="30"
        height="30"
        round
        fit="cover"
      ></van-image>
      <div class="name" slot="title">{{ comment.aut_name }}</div>
      <div slot="label">
        <div class="content">
          {{ comment.content }}
        </div>
        <div class="date-wrap">
          <span class="date">{{ comment.pubdate | relativeTime }}</span>
          <van-button
            v-if="showReply"
            class="reply"
            round
            type="default"
            @click="isReplyShow = true"
            >{{ comment.reply_count }} 回复</van-button
          >
        </div>
      </div>
      <div class="liking" slot="default" @click="toggleLiking(comment.com_id)">
        <van-icon
          :name="comment.is_liking ? 'good-job' : 'good-job-o'"
          :color="comment.is_liking ? '#FF8344' : ''"
        />
        <span class="liking-count">{{ comment.like_count }}</span>
      </div>
    </van-cell>
    <!-- 评论回复弹窗 -->
    <van-popup v-model="isReplyShow" position="bottom" :style="{ height: '85%' }">
      <reply-list @close="isReplyShow = false" :comment="comment" :article-id="articleId" />
    </van-popup>
  </div>
</template>
<script>
import { addLiking4Comment, deleteLiking4Comment } from 'api/comment';
import ReplyList from './ReplyList.vue';
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Object, String, Number],
      required: true
    },
    showReply: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isReplyShow: false
    };
  },
  methods: {
    async toggleLiking(commId) {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true
      });
      try {
        if (this.comment.is_liking) {
          await deleteLiking4Comment(commId);
          this.comment.like_count--;
          this.$toast.success('取消点赞成功');
        } else {
          await addLiking4Comment(commId);
          this.comment.like_count++;
          this.$toast.success('点赞成功');
        }
        this.comment.is_liking = !this.comment.is_liking;
      } catch (error) {
        console.log(error);
        this.$toast.fail('操作失败');
      }
    }
  },
  components: { ReplyList },
  watch: {
    isReplyShow() {
      this.$emit('toggle-footer', this.isReplyShow);
    }
  }
};
</script>
<style scoped lang="less">
.comment-wrap {
  .van-cell__value {
    flex: unset;
  }
  .avatar {
    margin-right: 13px;
  }
  .name {
    color: #44689b;
    font-size: 13px;
  }
  .content {
    color: #222222;
    font-size: 14px;
    line-height: 25px;
  }
  .date-wrap {
    display: table;
    margin-top: 10px;
    .date {
      display: table-cell;
      vertical-align: middle;
      color: #3f3f3f;
      font-size: 12px;
    }
    .reply {
      margin-left: 21px;
      height: 24px;
      width: 78px;
      font-size: 10px;
    }
  }
  .liking-count {
    margin-left: 5px;
  }
}
</style>
