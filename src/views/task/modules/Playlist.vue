<template>
  <div class="playlist">
    <a-row style="margin-bottom:12px;">
      <span style="font-weight:bold;">{{ $t('task.playlist') }}</span>
      <a-button-group style="float:right">
        <a-button
          icon="plus"
          size="small"
          type="default"
          @click="onAddMedia"
          :title="$t('common.new')"
        />
        <a-button
          icon="check"
          size="small"
          type="default"
          @click="onCheckAll"
          :title="$t('common.checkAll')"
        />
        <a-button
          icon="edit"
          size="small"
          type="default"
          :disabled="!isSelectMedia"
          @click="onEditMedias"
          :title="$t('common.edit')"
        />
        <a-button
          icon="delete"
          size="small"
          type="danger"
          :disabled="!isSelectMedia"
          @click="onClearMedia"
          :title="$t('common.del')"
        />
      </a-button-group>
    </a-row>
    <span v-if="medias.length <= 0">{{ $t('task.noData') }}</span>
    <a-list v-else itemLayout="horizontal" :dataSource="medias">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a slot="actions">
          <a-button
            icon="edit"
            size="small"
            type="link"
            @click="onEditMedia(index)"
            :title="$t('common.edit')"
          />
          <a-button
            icon="close"
            size="small"
            type="link"
            @click="onDelMedia(index)"
            :title="$t('common.del')"
            style="color:red"
          />
        </a>
        <a-row style="width:100%" type="flex" justify="space-around" align="middle">
          <a-col :span="1">
            <a-checkbox @change="onCheckMedia(index)" :checked="item.check"></a-checkbox>
          </a-col>
          <a-col :span="20">
            <div class="name">{{ item.name }}</div>
            <div v-if="item.type === 1" class="prop">
              <a-row>
                <span>{{ $t('task.loop') }} : {{ item.loop }}</span>
                <span class="prop-next">{{ $t('task.volume') }} : {{ item.volume }}</span>
              </a-row>
            </div>
            <div v-if="item.type === 2" class="prop">
              <div>{{ $t('task.duration') }} : {{ item.duration }}</div>
            </div>
            <div v-if="item.type === 3" class="prop">
              <a-row>
                <span>{{ $t('task.loop') }} : {{ item.loop }}</span>
                <span class="prop-next">{{ $t('task.speed') }} : {{ item.speed }}</span>
              </a-row>
            </div>
            <div
              v-if="item.start.length>0||item.end.length>0"
              class="prop"
            >{{ $t('common.validDate') }} : {{ item.start }} ~ {{ item.end }}</div>
            <div v-else class="prop">{{ $t('common.validDate') }} : {{ $t('common.empty') }}</div>
          </a-col>
        </a-row>
      </a-list-item>
    </a-list>
    <media-property-win ref="mediaProperty" @ok="onReturnProperty" />
    <a-drawer
      :title="$t('task.areaProperty')"
      placement="right"
      :width="800"
      :closable="false"
      :visible="mediaDrawerShow"
      @close="onCloseMediaDrawer"
    ></a-drawer>
  </div>
</template>

<script>
import moment from 'moment'
import MediaPropertyWin from './win/MediaPropertyWin'

export default {
  components: {
    MediaPropertyWin
  },
  data () {
    return {
      type: '',
      visiblePropertyModal: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      medias: [],
      editMediaIndex: -1
    }
  },
  created () {
  },
  computed: {
    isSelectMedia () {
      var idx = this.medias.findIndex(item => { return item.check })
      return idx >= 0
    }
  },
  methods: {
    moment,
    init (type, medias) {
      this.type = type
      this.medias = medias
    },
    onAddMedia () {
      this.medias.push({
        id: 0,
        name: Math.floor(Math.random() * 10) + '-media',
        loop: 1,
        speed: 1,
        duration: 15,
        volume: 100,
        type: Math.floor(Math.random() * 10) % 3 + 1,
        start: '',
        end: '',
        check: false
      })
    },
    onClearMedia () {
      for (let idx = this.medias.length - 1; idx >= 0; idx--) {
        if (this.medias[idx].check) {
          this.medias.splice(idx, 1)
        }
      }
    },
    onDelMedia (idx) {
      this.medias.splice(idx, 1)
    },
    onCheckMedia (idx) {
      this.medias[idx].check = !this.medias[idx].check
    },
    onCheckAll () {
      var idx = this.medias.findIndex(item => { return !item.check })
      if (idx >= 0) {
        this.medias.forEach(item => { item.check = true })
      } else {
        this.medias.forEach(item => { item.check = false })
      }
    },
    handlePropertyOk () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          this.visiblePropertyModal = false
        }
      })
    },
    handlePropertyCancel () {
      this.visiblePropertyModal = false
    },
    onEditMedias () {
      this.editMediaIndex = -1
      let editPropertys = ['validDate']
      this.medias.forEach(media => {
        if (media.check) {
          switch (media.type) {
            case 1:
              editPropertys.push(...['loop', 'volume'])
              break
            case 2:
              editPropertys.push(...['duration'])
              break
            case 3:
              editPropertys.push(...['loop', 'speed'])
              break
          }
        }
      })
      editPropertys = Array.from(new Set(editPropertys))
      this.$refs.mediaProperty.show(editPropertys)
    },
    onEditMedia (idx) {
      this.editMediaIndex = idx
      const media = this.medias[idx]
      let editPropertys = []
      switch (media.type) {
        case 1:
          editPropertys = ['loop', 'volume', 'validDate']
          break
        case 2:
          editPropertys = ['duration', 'validDate']
          break
        case 3:
          editPropertys = ['loop', 'speed', 'validDate']
          break
      }
      this.$refs.mediaProperty.show(editPropertys, media)
    },
    onReturnProperty (props) {
      if (this.editMediaIndex < 0 || this.editMediaIndex >= this.medias.length) {
        this.medias.forEach(media => {
          if (media.check) {
            Object.assign(media, props)
          }
        })
        return
      }
      Object.assign(this.medias[this.editMediaIndex], props)
    }
  }
}
</script>

<style lang="less" scoped>
.playlist {
  .name {
    color: black;
    margin-bottom: 5px;
  }
  .prop {
    font-size: 10px;
    color: #ccc;

    .prop-next {
      margin-left: 24px;
    }
  }
}
</style>
