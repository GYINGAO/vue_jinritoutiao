<template>
  <div class="article-item">
    <van-cell>
      <div slot="title" class="title van-multi-ellipsis--l2">
        {{ article.title }}
      </div>
      <div slot="label">
        <div class="cover-wrap" v-if="article.cover.type === 3">
          <div class="cover-wrap-item" v-for="(image, index) in article.cover.images" :key="index">
            <van-image class="cover-item" fit="cover" :src="image" />
          </div>
        </div>
        <div class="label-wrap">
          <span class="author">{{ article.aut_name }}</span>
          <span class="date">{{ article.pubdate | relativeTime }}</span>
        </div>
      </div>
      <div slot="default" class="cover-right" v-if="article.cover.type === 1">
        <van-image fit="cover" :src="article.cover.images[0]" />
      </div>
    </van-cell>
    <van-grid :column-num="3" direction="horizontal" center clickable class="btn-operate">
      <van-grid-item icon-prefix="my-icon" icon="pinglun" :text="String(article.comm_count)" />
      <van-grid-item icon-prefix="my-icon" icon="dianzan" :text="String(article.like_count)" />
      <van-grid-item icon-prefix="my-icon" icon="shoucang" :text="String(article.collect_count)" />
    </van-grid>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {},
  components: {}
};
</script>
<style scoped lang="less">
.article-item {
  margin-bottom: 5px;
  .btn-operate {
    height: 38px;
    /deep/ .van-grid-item__content {
      height: 75%;
    }
  }
  .title {
    font-size: 16px;
    color: #3a3a3a;
    line-height: 28px;
  }
  /deep/ .van-cell__value {
    flex: unset;
    width: 116px;
    height: 73px;
    margin-left: 12px;
  }
  .cover-right {
    width: 116px;
    height: 73px;
    .van-image {
      width: 100%;
      height: 100%;
    }
  }
  .cover-wrap {
    display: flex;
    padding: 10px 0;
    .cover-wrap-item {
      flex: 1;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item {
        width: 100%;
        height: 73px;
      }
    }
  }
  .label-wrap {
    span {
      margin-right: 12px;
    }
  }
}
</style>
