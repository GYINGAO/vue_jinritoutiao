<template>
  <div class="login-container">
    <i class="iconfont icon-shouji"></i>
    <van-nav-bar class="app-nav-bar" title="登录 / 注册" left-arrow @click-left="$router.back()" />
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="loginForm"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-field
        name="mobile"
        v-model="user.mobile"
        clearable
        center
        icon-prefix="my-icon"
        left-icon="shouji"
        placeholder="请输入手机号"
        :rules="formRules.mobile"
      />
      <van-field
        name="code"
        v-model="user.code"
        clearable
        center
        icon-prefix="my-icon"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down
            :time="1000 * 60"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          >
            <template #default="timeData">
              <span class="block">{{ timeData.seconds }} s</span>
            </template>
          </van-count-down>
          <van-button
            class="send-btn"
            size="mini"
            type="primary"
            :loading="isSendCodeLoading"
            @click.prevent="onSendCode"
            v-else
            >获取验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" color="#6db4fb" block native-type="submit">确认</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { login, sendCode } from 'api/user';
export default {
  name: 'Login',
  data() {
    return {
      isSendCodeLoading: false,
      isCountDownShow: false,
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      formRules: {
        mobile: [
          { required: true, message: '请填写手机号' },
          { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      }
    };
  },
  methods: {
    onSendCode() {
      this.$refs.loginForm
        .validate('mobile')
        .then(async () => {
          try {
            this.isSendCodeLoading = true;
            await sendCode(this.user.mobile);
            this.$toast({
              message: '发送成功',
              duration: 1000
            });
            this.isCountDownShow = true;
          } catch (err) {
            if (err.response.status === 429) {
              this.$toast({
                message: '发送太频繁，请稍后再试',
                duration: 1000
              });
            } else {
              this.$toast({
                duration: 1000
              });
            }
          }
          this.isSendCodeLoading = false;
        })
        .catch(({ message }) => {
          this.$toast({
            message,
            duration: 1000
          });
        });
    },
    onFailed({ errors }) {
      if (errors[0]) {
        this.$toast({
          message: errors[0].message,
          duration: 1000
        });
      }
    },
    async onLogin() {
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: 0
      });
      try {
        const res = await login(this.user);
        this.$store.commit('setUser', res.data);
        this.$toast.success('登录成功');
        this.$router.back();
      } catch (err) {
        console.log(err);
        this.$toast.fail('手机号或验证码错误');
      }
    }
  },
  components: {}
};
</script>
<style scoped lang="less">
.block {
  display: inline-block;
  width: 35px;
  color: #666666;
  font-size: 12px;
  text-align: center;
  border: 1px solid #666666;
  border-radius: 10px;
}
.login-container {
  .login-btn-wrap {
    padding: 26px 16px;
    .login-wrap {
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
