<template>
  <van-cell-group>
    <van-cell
      icon="search"
      v-for="(item, index) in suggestions"
      :key="index"
      :title="item"
      @click="onSearch(item)"
    >
    </van-cell>
  </van-cell-group>
</template>
<script>
export default {
  name: '',
  props: {
    suggestions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    onSearch(text) {
      this.$emit('search', text);
    }
  },
  components: {}
};
</script>
<style scoped lang="less"></style>
