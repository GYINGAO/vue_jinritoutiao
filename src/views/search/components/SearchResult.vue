<template>
  <div class="result-container">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item, index) in results" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>
<script>
import { getSearchResult } from 'api/search';
export default {
  name: 'SearchResult',
  props: {
    results: {
      type: Array,
      required: true
    },
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
      page: 1
    };
  },
  methods: {
    async onLoad() {
      this.page++;
      const res = await getSearchResult({
        page: this.page,
        per_page: 15,
        q: this.searchText.trim()
      });
      this.results.push(...res.data.results);
      if (res.data.results.length) {
        this.loading = false;
      } else {
        this.finished = true;
      }
    }
  },
  components: {}
};
</script>
<style scoped lang="less">
.result-container {
  position: fixed;
  top: 54px;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow: auto;
}
</style>
