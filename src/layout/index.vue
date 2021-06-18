<template>
  <div>
    <router-view></router-view>
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
  name: '',
  data() {
    return {
      active: 'home'
    };
  },
  methods: {},
  components: {}
};
</script>
<style scoped lang="less"></style>
