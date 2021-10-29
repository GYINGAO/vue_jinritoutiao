<template>
  <div>
    <keep-alive :exclude="['ProfileEdit', 'Chat']">
      <router-view></router-view>
    </keep-alive>
    <van-tabbar v-model="active" route>
      <van-tabbar-item name="home" icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item name="qa" icon="comment-o" to="/qa">问答</van-tabbar-item>
      <van-tabbar-item name="video" icon="video-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item name="profile" icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: 'Layout',
  data() {
    return {
      active: 'home'
    };
  },
  methods: {},
  components: {},
  mounted() {
    this.$store.commit('addCachePage', 'Layout');
  }
};
</script>
<style scoped lang="less"></style>
