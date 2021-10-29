<template>
  <div>
    <img class="img" ref="image" :src="img" />
    <van-nav-bar
      :border="false"
      left-text="取消"
      right-text="确定"
      @click-left="onCancel"
      @click-right="onConfirm"
    >
    </van-nav-bar>
  </div>
</template>
<script>
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import { editPhoto } from 'api/user';
export default {
  name: '',
  props: {
    file: {
      type: File,
      required: true
    }
  },
  data() {
    return {
      img: window.URL.createObjectURL(this.file),
      cropper: null
    };
  },
  methods: {
    onCancel() {
      this.$emit('close');
    },
    async onConfirm() {
      this.$toast.loading({
        message: '上传中...',
        forbidClick: true,
        duration: 0
      });

      try {
        const file = await this.getCroppedCanvas();
        const formData = new FormData();
        formData.append('photo', file);
        const res = await editPhoto(formData);
        this.$emit('update', res.data.photo);
        this.$emit('close');
        this.$toast.success('修改成功');
      } catch (error) {
        console.log(error);
        this.$toast.fail('修改失败');
      }
      this.isLoading = false;
    },
    getCroppedCanvas() {
      return new Promise((resolve, reject) => {
        this.cropper.getCroppedCanvas().toBlob(file => {
          resolve(file);
        });
      });
    }
  },
  components: {},
  mounted() {
    const image = this.$refs.image;
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    });
  }
};
</script>
<style scoped lang="less">
.van-nav-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 20px;
  background-color: transparent;
  /deep/ .van-nav-bar__left,
  /deep/ .van-nav-bar__right {
    margin: 0 50px;
    span {
      color: #fff;
      font-size: 18px;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
