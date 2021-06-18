<template>
  <div>
    <van-nav-bar title="收藏 / 历史" left-arrow @click-left="$router.back()" />
    <van-tabs v-model="activeName" sticky swipeable animated>
      <van-tab title="收藏" name="collection">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <article-list-item
            v-for="(item, index) in collections"
            :key="index"
            :article="item"
          ></article-list-item>
        </van-list>
      </van-tab>
      <van-tab title="历史" name="history">历史</van-tab>
    </van-tabs>
  </div>
</template>
<script>
import ArticleListItem from 'components/ArticleListItem';
import { getCollections } from 'api/article';
export default {
  name: '',
  data() {
    return {
      activeName: 'collection',
      finished: false,
      loading: false,
      collections: []
    };
  },
  methods: {
    onLoad() {},
    async getUserCollection() {
      try {
        const res = await getCollections();
        this.collections = res.data.results;
        console.log(this.collections);
      } catch (error) {
        console.log(error);
      }
    }
  },
  components: {
    ArticleListItem
  },
  created() {
    this.getUserCollection();
  }
};
</script>
<style scoped lang="less"></style>
