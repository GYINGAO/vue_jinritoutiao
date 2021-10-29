<template>
  <div>
    <van-nav-bar
      title="个人信息"
      right-text="保存"
      left-arrow
      @click-left="$router.back()"
      @click-right="onSave"
    />
    <van-cell-group>
      <input type="file" hidden ref="avatar" accept="image/*" @change="onFileChange" />
      <van-cell title="头像" is-link center>
        <van-image
          class="avatar"
          round
          fit="cover"
          :src="userInfo.photo || require('./avatar.png')"
          @click="$refs.avatar.click()"
        />
      </van-cell>
      <van-cell title="昵称" :value="userInfo.name" is-link @click="showName = true" />
      <van-cell title="介绍" is-link @click="showIntro = true" />
    </van-cell-group>
    <van-cell-group class="group-two">
      <van-cell
        title="性别"
        :value="userInfo.gender === 0 ? '男' : '女'"
        is-link
        @click="showGender = true"
      />
      <van-cell title="生日" is-link @click="showBirthday = true">
        <div class="birthday" slot="default" v-if="userInfo.birthday === null">
          待完善
        </div>
        <div slot="default" v-else>{{ userInfo.birthday }}</div>
      </van-cell>
      <van-cell title="地区" is-link @click="showLocation = true">
        <div class="location" slot="default" v-if="userInfo.location === ''">
          待完善
        </div>
        <div slot="default" v-else>{{ userInfo.location }}</div>
      </van-cell>
      <van-cell title="手机号" is-link :value="userInfo.mobile" />
    </van-cell-group>
    <!-- 选择性别 -->
    <van-popup class="gender-popup" v-model="showGender" round position="bottom">
      <van-cell-group class="choose-gender">
        <van-cell
          clickable
          center
          @click="
            showGender = false;
            userInfo.gender = 0;
          "
        >
          <span slot="title">男</span>
        </van-cell>
        <van-cell
          clickable
          center
          @click="
            showGender = false;
            userInfo.gender = 1;
          "
        >
          <span slot="title">女</span>
        </van-cell>
      </van-cell-group>
      <van-button block class="cancl" @click="showGender = false">取消</van-button>
    </van-popup>
    <!-- 选择生日 -->
    <van-popup class="birthday-popup" v-model="showBirthday" position="bottom" round>
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatterDate"
        confirm-button-text="完成"
        @cancel="showBirthday = false"
        @confirm="onConfirmBirthday"
      />
    </van-popup>
    <!-- 选择地区 -->
    <van-popup class="location-popup" v-model="showLocation" position="bottom" round>
      <van-cascader
        v-model="userInfo.location"
        title="请选择所在地区"
        :field-names="fieldNames"
        :options="locationOptions"
        @close="showLocation = false"
        @finish="onFinishLocation"
      />
    </van-popup>
    <!-- 修改个性签名 -->
    <van-popup class="intro-popup" v-model="showIntro" position="bottom">
      <van-field
        v-model="userInfo.intro"
        rows="5"
        autosize
        type="textarea"
        maxlength="100"
        placeholder="请输入个性签名"
        show-word-limit
        border
      />
      <van-button
        class="btn-confirm"
        :class="{ active: introBtnIsActive }"
        :disabled="!introBtnIsActive"
        @click="showIntro = false"
        >确认</van-button
      >
    </van-popup>
    <!-- 修改昵称 -->
    <van-popup class="name-popup" v-model="showName" position="bottom">
      <van-field
        v-model="userInfo.name"
        rows="1"
        autosize
        label="昵称"
        type="textarea"
        maxlength="12"
        placeholder="请输入昵称"
        show-word-limit
      />
      <van-button
        class="btn-confirm"
        :class="{ active: nameBtnIsActive }"
        :disabled="!nameBtnIsActive"
        @click="showName = false"
        >确认</van-button
      >
    </van-popup>

    <!-- 裁剪头像 -->
    <van-popup
      class="avatar-popup"
      v-model="showAvatar"
      style="height:100%;width:100%"
      position="bottom"
    >
      <update-avatar
        v-if="showAvatar"
        :file="previewImg"
        @close="onAvatarClose"
        @update="userInfo.photo = $event"
      ></update-avatar>
    </van-popup>
  </div>
</template>
<script>
import { readLocalData } from 'api/local';
import { getProfile, getUserInfo, editProfile } from 'api/user';
import UpdateAvatar from './components/UpdateAvatar.vue';
export default {
  name: 'ProfileEdit',
  data() {
    return {
      userInfo: {
        location: '',
        base64: ''
      },
      showGender: false,
      showBirthday: false,
      showLocation: false,
      showIntro: false,
      showName: false,
      showAvatar: false,
      minDate: new Date(1921, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      locationOptions: [],
      fieldNames: {
        text: 'name',
        value: 'code',
        children: 'child'
      },
      isLoading: false,
      previewImg: ''
    };
  },
  methods: {
    onAvatarClose() {
      this.showAvatar = false;
    },
    onFileChange() {
      // const blob = window.URL.createObjectURL(this.$refs.avatar.files[0]);
      // this.previewImg = blob;
      this.previewImg = this.$refs.avatar.files[0];
      this.showAvatar = true;
      // 清空file,解决相同文件不处罚change事件
      this.$refs.avatar.value = '';
    },
    async onSave() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      });
      try {
        const res = await editProfile({
          name: this.userInfo.name,
          gender: this.userInfo.gender,
          birthday: this.userInfo.birthday,
          intro: this.userInfo.intro
        });
        console.log(res);
        this.$toast.success('保存成功');
        this.$router.back();
      } catch (error) {
        console.log(error);
        this.$toast.fail('保存失败');
      }
    },
    formatterDate(type, val) {
      if (type === 'year') {
        return val + '年';
      }
      if (type === 'month') {
        return val + '月';
      }
      if (type === 'day') {
        return val + '日';
      }
      return val;
    },
    onConfirmBirthday(value) {
      console.log(value);
      this.userInfo.birthday = this.moment(value).format('YYYY-MM-DD');
      this.showBirthday = false;
    },
    onFinishLocation({ selectedOptions }) {
      this.showLocation = false;
      this.userInfo.location = selectedOptions.map(option => option.name).join('/');
    },
    getCityData() {
      readLocalData('/city/region.json')
        .then(res => {
          this.locationOptions = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    async getUserInfo() {
      try {
        const res = await getProfile();
        const { data } = await getUserInfo();
        this.userInfo = { ...this.userInfo, ...res.data, ...data };
      } catch (error) {
        console.log(error);
      }
    }
  },
  components: { UpdateAvatar },
  created() {
    this.getCityData();
    this.getUserInfo();
  },
  computed: {
    introBtnIsActive() {
      return this.userInfo.intro !== '';
    },
    nameBtnIsActive() {
      return this.userInfo.name !== '';
    }
  }
};
</script>
<style scoped lang="less">
.avatar {
  width: 28px;
  height: 28px;
  padding: 0;
}
.group-two {
  margin-top: 6px;
  .birthday,
  .location {
    color: #3296fa;
  }
}
.gender-popup {
  .choose-gender {
    border-radius: 30px;
    .van-cell {
      position: relative;
      height: 58px;
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 19px;
        color: #007aff;
      }
    }
  }
  .cancl {
    height: 58px;
    font-size: 19px;
    color: #d86262;
  }
}
.intro-popup {
  background-color: #f4f5f6;
  .btn-confirm {
    width: 57px;
    height: 30px;
    font-size: 12px;
    margin: 9px;
    background-color: #cacaca;
    color: #fff;
    border-radius: 8px;
    transform: translateX(300px);
  }
  .active {
    background-color: #1989fa;
    color: #fff;
  }
}
.name-popup {
  .btn-confirm {
    width: 57px;
    height: 30px;
    font-size: 12px;
    margin: 9px;
    background-color: #cacaca;
    color: #fff;
    border-radius: 8px;
    transform: translateX(300px);
  }
  .active {
    background-color: #1989fa;
    color: #fff;
  }
}
.avatar-popup {
  background-color: #000;
}
</style>
