<template>
  <div class="article-list" ref="list">
    <van-pull-refresh
      v-model="refreshing"
      success-duration="1000"
      :success-text="refreshSuccessText"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-list-item v-for="(item, index) in articleList" :key="index" :article="item" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticleList } from 'api/article';
import ArticleListItem from 'components/ArticleListItem';
import { debounce } from 'lodash';
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      articleList: [],
      timestamp: null,
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      refreshSuccessText: '',
      scrollTop: 0
    };
  },
  methods: {
    async onLoad() {
      try {
        const res = await getArticleList({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        });
        this.articleList.push(...res.data.results);
        if (res.data.results.length) {
          this.timestamp = res.data.pre_timestamp;
          this.loading = false;
        } else {
          this.finished = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async onRefresh() {
      this.finished = false;
      try {
        const res = await getArticleList({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        });
        const { results } = res.data;
        this.articleList.unshift(...results);
        this.refreshSuccessText = `更新了${results.length}条数据`;
        this.refreshing = false;
      } catch (error) {
        console.log(error);
      }
    }
  },
  components: { ArticleListItem },
  mounted() {
    const list = this.$refs.list;
    list.onscroll = debounce(() => {
      this.scrollTop = list.scrollTop;
    }, 50);
  },
  // 组件被缓存时，下面两个生命周期函数会被执行
  activated() {
    // 重新设置滚动距离
    this.$refs.list.scrollTop = this.scrollTop;
  },
  deactivated() {}
};
</script>
<style scoped lang="less">
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow: auto;
}
</style>
