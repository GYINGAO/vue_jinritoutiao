<template>
  <div class="search-container">
    <!-- 搜索框 -->
    <form action="/" class="search-input">
      <van-search
        slot="left"
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        autofocus
        background="#3296fa"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText" />
    <!-- 搜索历史 -->
    <search-history
      v-else-if="!searchText.trim()"
      @history-search="onSearch"
      :history="history"
      @delete-all="deleteAll"
    />
    <!-- 搜索建议 -->
    <search-suggestion v-else :search-text="searchText" @search="onSearch" />
  </div>
</template>
<script>
import SearchHistory from './components/SearchHistory.vue';
import SearchResult from './components/SearchResult.vue';
import SearchSuggestion from './components/SearchSuggestion.vue';
import { mapState } from 'vuex';
import { getHistory, deleteHistory } from 'api/search';
import { getItem, setItem, removeItem } from 'utils/storage';
import { uniq } from 'lodash';
export default {
  name: 'Search',
  data() {
    return {
      searchText: '',
      isResultShow: false,
      history: []
    };
  },
  methods: {
    onSearch(text) {
      this.searchText = text;
      this.isResultShow = true;
      // 删除已搜索内容,把最新搜索历史放到最前
      const index = this.history.indexOf(this.searchText);
      if (index > -1) this.history.splice(index, 1);
      this.history.unshift(this.searchText);
      setItem('my-history', this.history);
    },
    // 获取搜索历史
    async getUserHistory() {
      this.history = getItem('my-history') || [];
      if (this.user) {
        const res = await getHistory();
        this.history.push(...res.data.keywords);
        // 数组去重
        // this.history = Array.from(new Set(this.history));
        this.history = uniq(this.history);
      }
    },
    // 删除所有搜索记录
    async deleteAll() {
      this.history = [];
      if (this.user) {
        await deleteHistory();
        this.$toast.success('删除成功');
      } else {
        removeItem('my-history');
      }
    }
  },
  components: { SearchHistory, SearchResult, SearchSuggestion },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.getUserHistory();
  }
};
</script>
<style scoped lang="less">
.search-container {
  .search-input {
    .van-search__action {
      color: #fff;
    }
  }
}
</style>
