<template>
  <div class="search-container">
    <form action="/" class="search-input">
      <van-search
        slot="left"
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @cancel="$router.back()"
        @input="onInput"
        autofocus
        background="#3296fa"
      />
    </form>
    <search-result v-if="isResultShow" :results="results" :search-text="searchText" />
    <search-history
      v-else-if="!searchText"
      :history="history"
      @deleteAll="deleteAll"
      @history-search="onHistorySearch"
    />
    <search-suggestion v-else :suggestions="suggestions" @search="onSuggestionSearch" />
  </div>
</template>
<script>
import SearchHistory from './components/SearchHistory.vue';
import SearchResult from './components/SearchResult.vue';
import SearchSuggestion from './components/SearchSuggestion.vue';
import { debounce } from 'lodash';
import { getSuggestions, getSearchResult, getHistory, deleteHistory } from 'api/search';
import { mapState } from 'vuex';
import { getItem, setItem } from 'utils/storage';
export default {
  name: 'Search',
  data() {
    return {
      searchText: '',
      isResultShow: false,
      suggestions: [],
      results: [],
      page: 1,
      per_page: 15,
      history: []
    };
  },
  methods: {
    onHistorySearch(text) {
      this.searchText = text;
      this.onSearch();
    },
    onSuggestionSearch(text) {
      this.searchText = text;
      this.onSearch();
    },
    async onSearch() {
      if (this.searchText.trim() === '') {
        this.results = [];
        return;
      }
      // 判断数组中是否已存在
      if (this.history.indexOf(this.searchText.trim()) === -1) {
        this.history.push(this.searchText);
      }
      // 判断用户是否登录
      if (this.user) {
      } else {
        setItem('my-history', this.history);
      }
      // 点击搜索，显示搜索结果
      this.isResultShow = true;
      // 获取搜索结果
      const res = await getSearchResult({
        page: this.page,
        per_page: this.per_page,
        q: this.searchText.trim()
      });
      this.results = res.data.results;
    },
    // 获取联想建议，防抖
    onInput: debounce(async function() {
      this.isResultShow = false;
      const res = await getSuggestions({ q: this.searchText });
      this.suggestions = res.data.options;
    }, 500),
    async getUserHistory() {
      if (this.user) {
        const res = await getHistory();
        this.history = res.data.keywords;
      } else {
        this.history = getItem('my-history') || [];
      }
    },
    async deleteAll() {
      await deleteHistory();
      this.history = [];
    }
  },
  components: { SearchHistory, SearchResult, SearchSuggestion },
  created() {
    this.getUserHistory();
  },
  computed: {
    ...mapState(['user'])
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
