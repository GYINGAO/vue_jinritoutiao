<template>
  <div>
    <!-- 头部 -->
    <van-nav-bar title="文章详情" left-text="返回" left-arrow @click-left="$router.back()" fixed />
    <h1 class="title">{{ article.title }}</h1>
    <!-- 中间内容 -->
    <div class="body">
      <van-cell center class="author">
        <van-image class="avatar" slot="icon" fit="cover" round :src="article.aut_photo" />
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <div slot="label" class="pubdate">{{ article.pubdate | relativeTime }}</div>
        <van-button
          :type="article.is_followed ? 'default' : 'info'"
          round
          :icon="article.is_followed ? '' : 'plus'"
          :loading="isFollowLoading"
          @click="toggleFollow"
          >{{ article.is_followed ? '已关注' : '关注' }}</van-button
        >
      </van-cell>
      <div class="content markdown-body" v-html="article.content" ref="article-content"></div>
      <van-divider>正文结束</van-divider>
      <comment-list
        :article-id="articleId"
        @updata-count="updateCount"
        @emit-footer="isFooterShow = !$event"
      ></comment-list>
    </div>
    <!-- 底部 -->
    <div class="footer" v-if="isFooterShow">
      <van-button round class="btn-comment" @click="isWriteCommentShow = true">写评论</van-button>
      <div class="icon-wrap">
        <van-icon name="comment-o" :badge="commentCount" />
        <van-icon
          :name="article.is_collected ? 'star' : 'star-o'"
          :color="article.is_collected ? 'orange' : ''"
          @click="toggleCollection"
        />
        <van-icon
          :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
          :color="article.attitude === 1 ? 'orange' : ''"
          @click="toggleLiking"
        />
        <van-icon name="share-o" @click="showShare = true" />
      </div>
    </div>

    <van-popup
      v-model="isWriteCommentShow"
      :style="{ height: '20%' }"
      get-container="body"
      position="bottom"
    >
      <write-comment :article-id="articleId"></write-comment>
    </van-popup>
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" />
  </div>
</template>
<script>
import 'github-markdown-css/github-markdown.css';
import WriteComment from './components/WriteComment.vue';
import {
  getArticleById,
  addCollectionById,
  deleteCollectionById,
  addLikingById,
  deleteLikingById
} from 'api/article';
import { ImagePreview } from 'vant';
import { addFollow, deleteFollow } from 'api/user';
import CommentList from './components/CommentList.vue';
export default {
  name: 'Article',
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      article: {},
      isFollowLoading: false,
      showShare: false,
      commentCount: 0,
      isFooterShow: true,
      isWriteCommentShow: false,
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ]
    };
  },
  methods: {
    updateCount(count) {
      this.commentCount = count;
    },
    async loadArticle() {
      const res = await getArticleById(this.articleId);
      this.article = res.data;

      // 获取不到img，原因数据改变驱动视图更新不是立即的
      // const imgs = articleContent.querySelectorAll('img');
      // console.log(imgs);
      // 需要借助$nextTick
      this.$nextTick(() => {
        this.handlePreviewImg();
      });
    },
    handlePreviewImg() {
      // 获取dom容器
      const articleContent = this.$refs['article-content'];
      const imgs = articleContent.querySelectorAll('img');
      const images = [];
      imgs.forEach((img, index) => {
        images.push(img.src);
        img.onclick = function() {
          ImagePreview({
            images,
            startPosition: index,
            closeable: true
          });
        };
      });
    },
    // 切换关注状态
    async toggleFollow() {
      this.isFollowLoading = true;
      try {
        if (this.article.is_followed) {
          await deleteFollow(this.article.aut_id);
          this.$toast.success('取消关注成功');
        } else {
          await addFollow(this.article.aut_id);
          this.$toast.success('关注成功');
        }
        this.article.is_followed = !this.article.is_followed;
      } catch (error) {
        this.$toast.fail('不能关注自己');
      }
      this.isFollowLoading = false;
    },
    // 切换收藏状态
    async toggleCollection() {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true
      });
      try {
        if (this.article.is_collected) {
          await deleteCollectionById(this.article.art_id);
          this.$toast.success('取消收藏成功');
        } else {
          await addCollectionById(this.article.art_id);
          this.$toast.success('收藏成功');
        }
        this.article.is_collected = !this.article.is_collected;
      } catch (error) {
        this.$toast.fail('操作失败');
      }
    },
    // 切换点赞状态
    async toggleLiking() {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true
      });
      try {
        if (this.article.attitude === 1) {
          await deleteLikingById(this.article.art_id);
          this.$toast.success('取消点赞成功');
          this.article.attitude = -1;
        } else {
          await addLikingById(this.article.art_id);
          this.$toast.success('点赞成功');
          this.article.attitude = 1;
        }
      } catch (error) {
        this.$toast.fail('操作失败');
      }
    }
  },
  components: { CommentList, WriteComment },
  created() {
    this.loadArticle();
  }
};
</script>
<style scoped lang="less">
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin: 0;
}
.body {
  position: fixed;
  top: 46px;
  bottom: 45px;
  left: 0;
  right: 0;
  overflow: auto;
  .author {
    .avatar {
      width: 35px;
      height: 35px;
      margin-right: 8px;
    }
    .name {
      font-size: 14px;
      color: #333;
    }
    .van-button {
      font-size: 10px;
      height: 30px;
    }
  }
  .content {
    background-color: #fff;
    padding: 14px;
    margin-bottom: 20px;
  }
}

.footer {
  position: fixed;
  display: flex;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 45px;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  .btn-comment {
    width: 150px;
    height: 25px;
    margin: 0 20px;
  }
  .icon-wrap {
    flex: 1;
    display: inline-block;
    padding-top: 8px;
    .van-icon {
      margin-right: 20px;
    }
  }
}
</style>
