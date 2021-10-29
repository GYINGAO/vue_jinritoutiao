<template>
  <div class="result-container">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item, index) in results" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>
<script>
import { getSearchResult } from 'api/search';
import { setItem } from 'utils/storage';
export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
      results: [],
      page: 1,
      per_page: 15
    };
  },
  methods: {
    async onLoad() {
      this.searchText = this.searchText.trim();
      if (this.searchText === '') {
        this.results = [];
        this.searchText = '';
        return;
      }
      const { data } = await getSearchResult({
        page: this.page,
        per_page: this.per_page,
        q: this.searchText.trim()
      });
      this.results.push(...data.results);
      this.loading = false;
      if (data.results.length) {
        this.page++;
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
