<template>
  <div>
    <van-nav-bar>
      <van-button class="btn-search" slot="title" icon="search" color="#5babfb" round to="/search">
        搜索
      </van-button>
    </van-nav-bar>
    <van-tabs v-model="activeTab">
      <van-tab v-for="item in myChannels" :key="item.id" :title="item.name">
        <article-list :channel="item"></article-list>
      </van-tab>
      <div slot="nav-right" class="zhanweifu"></div>
      <div slot="nav-right" class="hamburger-wrap" @click="isEditChannelShow = true">
        <van-icon class-prefix="my-icon" name="gengduo" />
      </div>
    </van-tabs>
    <van-popup
      class="edit-channel-popup"
      v-model="isEditChannelShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      round
      get-container="body"
    >
      <channel-edit
        :my-channels="myChannels"
        :active-tab="activeTab"
        @close="isEditChannelShow = false"
        @update-active="activeTab = $event"
      ></channel-edit>
    </van-popup>
  </div>
</template>
<script>
import { getChannels } from 'api/channel';
import { mapState } from 'vuex';
import { getItem } from 'utils/storage';
import ArticleList from './components/ArticleList';
import ChannelEdit from './components/ChannelEdit.vue';
export default {
  name: 'Home',
  data() {
    return {
      activeTab: 0,
      myChannels: [],
      isEditChannelShow: false
    };
  },
  methods: {
    async loadChannels() {
      try {
        const res = await getChannels();
        if (this.user) {
          this.myChannels = res.data.channels;
        } else {
          this.myChannels = getItem('my-channels') || res.data.channels;
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  components: { ArticleList, ChannelEdit },
  created() {
    this.loadChannels();
  },
  computed: {
    ...mapState(['user'])
  }
};
</script>
<style scoped lang="less">
::v-deep .van-nav-bar__title {
  max-width: 100%;
  .btn-search {
    border: none;
    width: 277px;
    height: 32px;
    .van-button__text {
      font-size: 14px;
    }
    .van-button__icon {
      font-size: 16px;
    }
  }
}
.zhanweifu {
  flex-shrink: 0;
  width: 35px;
}

.hamburger-wrap {
  position: fixed;
  top: 53px;
  right: 0px;
  width: 35px;
  background-color: #fff;
  z-index: 100;
  .my-icon-gengduo {
    font-size: 20px;
  }
}

.edit-channel-popup {
  width: 100%;
  height: 100%;
}

.tuijian {
  color: #e5615b !important;
}
</style>
