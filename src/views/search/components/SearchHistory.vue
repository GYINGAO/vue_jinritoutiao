<template>
  <div>
    <van-cell-group>
      <van-cell title="历史记录" center>
        <template #right-icon>
          <van-icon v-if="!isDeleting" name="delete-o" @click="isDeleting = true" />
          <div class="delete-wrap" v-else>
            <span @click="deleteAll">全部删除</span>
            <span @click="isDeleting = false">完成</span>
          </div>
        </template>
      </van-cell>
      <van-cell
        icon="search"
        v-for="(item, index) in history"
        :key="index"
        :title="item"
        @click="$emit('history-search', item)"
      >
        <template v-if="isDeleting" #right-icon>
          <van-icon name="close" @click="history.splice(index, 1)" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    history: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleting: false
    };
  },
  methods: {
    deleteAll() {
      this.$emit('deleteAll');
    }
  }
};
</script>
<style scoped lang="less">
.delete-wrap {
  span {
    margin-left: 5px;
    color: #9a9a9a;
    font-size: 13px;
  }
}
</style>
