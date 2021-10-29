<template>
  <div class="my-container">
    <div class="my-info">
      <div class="login" v-if="user">
        <van-cell center class="user-info" :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            :src="userInfo.photo || require('../profile-edit/avatar.png')"
            fit="cover"
            @click="previewAvatar"
          />
          <div slot="title" class="username">{{ userInfo.name || '昵称' }}</div>
          <van-button
            size="small"
            round
            slot="default"
            class="btn"
            @click="$router.push('/profile/edit')"
            >编辑资料</van-button
          >
        </van-cell>
        <van-grid center :border="false" class="data-info" clickable>
          <van-grid-item>
            <div slot="text">
              <div class="num">{{ userInfo.art_count || 0 }}</div>
              <div class="text">头条</div>
            </div>
          </van-grid-item>
          <van-grid-item>
            <div slot="text">
              <div class="num">{{ userInfo.follow_count || 0 }}</div>
              <div class="text">关注</div>
            </div>
          </van-grid-item>
          <van-grid-item>
            <div slot="text">
              <div class="num">{{ userInfo.fans_count || 0 }}</div>
              <div class="text">粉丝</div>
            </div>
          </van-grid-item>
          <van-grid-item>
            <div slot="text">
              <div class="num">{{ userInfo.like_count || 0 }}</div>
              <div class="text">获赞</div>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
      <div
        class="logout"
        v-else
        @click="$router.push({ name: 'login', query: { redirect: '/profile' } })"
      >
        <van-image class="image" round :src="require('./avatar.png')" fit="cover" />
        <div class="text">登录 / 注册</div>
      </div>
    </div>
    <van-grid :column-num="2" class="my-grid" clickable border>
      <van-grid-item to="/profile/collection">
        <van-icon slot="icon" class-prefix="my-icon" name="shoucang" color="#eb5253" />
        <span slot="text">收藏</span>
      </van-grid-item>
      <van-grid-item to="/profile/collection">
        <van-icon slot="icon" class-prefix="my-icon" name="lishi" color="#ff9d1d" />
        <span slot="text">历史</span>
      </van-grid-item>
    </van-grid>
    <van-cell-group>
      <van-cell title="消息通知" is-link />
      <van-cell title="小智同学" is-link to="/chat" />
    </van-cell-group>
    <van-button class="btn-logout" block color="#d86262" plain v-if="user" @click="onLogout"
      >退出登录</van-button
    >
  </div>
</template>
<script>
import { removeItem } from 'utils/storage';
import { mapState } from 'vuex';
import { ImagePreview } from 'vant';
import { getUserInfo } from 'api/user';
export default {
  name: 'Profile',
  data() {
    return {
      userInfo: {}
    };
  },
  methods: {
    previewAvatar() {
      ImagePreview({
        images: [this.userInfo.photo || require('../profile-edit/avatar.png')],
        closeable: true
      });
    },
    onLogout() {
      this.$dialog
        .confirm({
          title: '退出提示',
          message: '确认退出吗？'
        })
        .then(() => {
          this.$store.commit('setUser', null);
          removeItem('TOUTIAO_USER');
        })
        .catch(() => {});
    },
    async getUserInfo() {
      if (this.user) {
        try {
          const res = await getUserInfo();
          this.userInfo = res.data;
        } catch (error) {
          console.log(error);
        }
      }
    }
  },
  components: {},
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.getUserInfo();
  }
};
</script>
<style scoped lang="less">
.my-container {
  .my-grid {
    margin-bottom: 5px;
    .my-icon {
      font-size: 23px;
    }
    span {
      font-size: 14px;
      margin-top: 10px;
    }
  }
  .my-info {
    position: relative;
    height: 180px;
    background: url('./banner.png') no-repeat;
    background-size: 100% 100%;
    .login {
      .user-info {
        height: 115px;
        background-color: unset;
        .avatar {
          width: 66px;
          height: 66px;
        }
        .username {
          color: #fff;
          margin-left: 13px;
          font-size: 16px;
        }
        .btn {
          height: 25px;
        }
      }
      .data-info {
        color: #fff;
        ::v-deep .van-grid-item__content {
          text-align: center;
          background-color: unset;
        }
        .num {
          transform: translateY(-6px);
          font-size: 18px;
        }
        .text {
          font-size: 12px;
        }
      }
    }
    .logout {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .image {
        width: 70px;
        height: 70px;
      }
      .text {
        color: #fff;
        font-size: 14px;
      }
    }
  }
  .btn-logout {
    border: none;
    margin-top: 5px;
  }
}
</style>
