<template>
  <div class="channel-edit">
    <van-cell :border="false" center class="channel-title">
      <span slot="title">我的频道</span>
      <van-button class="edit" slot="default" round color="#f85a5a" plain @click="onEdit">
        {{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>
    <van-grid :gutter="10" class="channel-wrap">
      <van-grid-item
        class="channel-item"
        :class="{ active: index === activeTab }"
        v-for="(item, index) in myChannels"
        :key="item.id"
        :text="item.name"
        :icon="item.id !== 0 && isEdit ? 'close' : ''"
        @click="onChannelClick(index, item)"
      />
    </van-grid>

    <van-cell :border="false" center class="channel-title">
      <span slot="title">频道推荐</span>
    </van-cell>
    <van-grid :gutter="10" class="channel-wrap">
      <van-grid-item
        class="channel-item"
        v-for="item in restChannels"
        :key="item.id"
        :text="item.name"
        @click="onAdd(item)"
      />
    </van-grid>
  </div>
</template>
<script>
import { getAllChannels, setChannel, deleteChannel } from 'api/channel';
import { mapState } from 'vuex';
import { setItem } from 'utils/storage';
export default {
  name: '',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    activeTab: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isEdit: false,
      allChannels: []
    };
  },
  methods: {
    onEdit() {
      this.isEdit = !this.isEdit;
    },
    async onAdd(channel) {
      if (this.isEdit) {
        this.myChannels.push(channel);
        // 数据持久化
        if (this.user) {
          await setChannel({
            channels: [
              {
                id: channel.id,
                seq: this.myChannels.length
              }
            ]
          });
        } else {
          setItem('my-channels', this.myChannels);
        }
      }
    },
    onChannelClick(index, channel) {
      if (this.isEdit && index !== 0) {
        this.removeChannel(index, channel);
      } else {
        this.switchChannel(index);
      }
    },
    async removeChannel(index, channel) {
      if (index <= this.activeTab) {
        this.$emit('update-active', this.activeTab - 1);
      }
      this.myChannels.splice(index, 1);
      // 数据持久化
      if (this.user) {
        await deleteChannel(channel.id);
      } else {
        setItem('my-channels', this.myChannels);
      }
    },
    switchChannel(index) {
      // 子传父
      this.$emit('close');
      this.$emit('update-active', index);
    },
    async loadAllChannels() {
      try {
        const res = await getAllChannels();
        this.allChannels = res.data.channels;
      } catch (error) {
        console.log(error);
      }
    }
  },
  components: {},
  computed: {
    ...mapState(['user']),
    restChannels() {
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id;
        });
      });
      // const arr = [];
      // this.allChannels.forEach(item => {
      //   const id = item.id;
      //   let boo = true;
      //   this.myChannels.forEach(value => {
      //     if (id === value.id) {
      //       boo = false;
      //     }
      //   });
      //   if (boo) arr.push(item);
      // });
      // return arr;
    }
  },
  created() {
    this.loadAllChannels();
  }
};
</script>
<style scoped lang="less">
.channel-edit {
  padding-top: 54px;
  .channel-title {
    font-size: 16px;
    color: #333;
    .edit {
      width: 58px;
      height: 24px;
      font-size: 13px;
    }
  }
  .channel-wrap {
    margin-bottom: 30px;
    .channel-item {
      width: 8px;
      height: 43px;
      /deep/ .van-grid-item__content {
        position: relative;
        background-color: #f4f5f6;
        .van-grid-item__text {
          font-size: 13px;
          color: #222222;
          margin-top: unset;
        }
        .van-grid-item__icon {
          position: absolute;
          top: -7px;
          right: -7px;
          font-size: 18px;
        }
      }
    }
    .active {
      /deep/ .van-grid-item__text {
        color: #e5615b !important;
        font-weight: bold;
      }
    }
  }
}
</style>
