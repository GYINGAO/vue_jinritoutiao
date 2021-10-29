<template>
  <van-cell-group>
    <van-cell
      icon="search"
      v-for="(item, index) in suggestions"
      :key="index"
      @click="$emit('search', item)"
    >
      <div slot="title" v-html="highlight(item, searchText)"></div>
    </van-cell>
  </van-cell-group>
</template>
<script>
import { getSuggestions } from 'api/search';
import { debounce } from 'lodash';
export default {
  name: '',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: []
    };
  },
  methods: {
    // 关键词高亮显示
    highlight(source, keyword) {
      const reg = new RegExp(keyword, 'gi');
      return source.replace(reg, `<span style="color:#e5615b">${keyword}</span>`);
    }
  },
  components: {},
  watch: {
    // 获取联想建议，防抖
    searchText: {
      handler: debounce(async function() {
        if (!this.searchText.trim()) return;
        const res = await getSuggestions({ q: this.searchText.trim() });
        this.suggestions = res.data.options;
      }, 500),
      immediate: true // 该回调在侦听器开始后立即调用
    }
  }
};
</script>
<style scoped lang="less"></style>
