<template>
  <div class="container">
    <div class="toolbar">
      <a-button
        icon="play-circle"
        :title="$t('task.mix')"
        size="small"
        type="link"
        @click="onAddArea('Mix')"
      ></a-button>
      <a-button
        icon="gateway"
        :title="$t('task.adv')"
        size="small"
        type="link"
        @click="onAddArea('Adv')"
      ></a-button>
      <a-button
        icon="picture"
        :title="$t('task.pic')"
        size="small"
        type="link"
        @click="onAddArea('Pic')"
      ></a-button>
      <a-button
        icon="file-text"
        :title="$t('task.txt')"
        size="small"
        type="link"
        @click="onAddArea('Txt')"
      ></a-button>
      <a-dropdown>
        <a-button icon="ellipsis" size="small" type="link"></a-button>
        <a-menu slot="overlay">
          <a-menu-item>
            <a-button
              icon="cloud"
              :title="$t('task.weather')"
              size="small"
              type="link"
              @click="onAddArea('Weather')"
            ></a-button>
          </a-menu-item>
          <a-menu-item>
            <a-button
              icon="qrcode"
              :title="$t('task.qrcode')"
              size="small"
              type="link"
              @click="onAddArea('Qrcode')"
            ></a-button>
          </a-menu-item>
          <a-menu-item>
            <a-button
              icon="calendar"
              :title="$t('task.calendar')"
              size="small"
              type="link"
              @click="onAddArea('Calendar')"
            ></a-button>
          </a-menu-item>
          <a-menu-item>
            <a-button
              icon="robot"
              :title="$t('task.logo')"
              size="small"
              type="link"
              @click="onAddArea('Logo')"
            ></a-button>
          </a-menu-item>
          <a-menu-item>
            <a-button
              icon="chrome"
              :title="$t('task.html')"
              size="small"
              type="link"
              @click="onAddArea('Html')"
            ></a-button>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-divider type="vertical" />
      <a-button
        icon="edit"
        size="small"
        type="link"
        :disabled="activitedArea.length <= 0"
        @click="onAreaEdit"
      ></a-button>
      <a-button
        icon="delete"
        size="small"
        type="link"
        :disabled="activitedArea.length <= 0"
        @click="onDeleteArea"
      ></a-button>
      <a-divider type="vertical" />
      <a-dropdown>
        <a-button icon="bg-colors" size="small" type="link"></a-button>
        <a-menu slot="overlay" size="small">
          <a-menu-item @click="onBgColor()">
            <a-icon type="bg-colors" />
            {{ $t('task.backgroundColor') }}
          </a-menu-item>
          <a-menu-item>
            <a-icon type="bg-colors" />
            {{ $t('task.backgroundPic') }}
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-button
        v-action:template:add
        icon="save"
        :title="$t('task.saveTemplate')"
        size="small"
        type="link"
        @click="onSaveTemplate"
      ></a-button>
      <a-button
        icon="bars"
        :title="$t('task.loadTemplate')"
        size="small"
        type="link"
        @click="onLoadTemplate"
      ></a-button>
      <a-button
        icon="zoom-in"
        :title="$t('task.zoomIn')"
        size="small"
        type="link"
        @click="onZoomIn"
      ></a-button>
      <a-button
        icon="zoom-out"
        :title="$t('task.zoomOut')"
        size="small"
        type="link"
        @click="onZoomOut"
      ></a-button>
      <a-switch class="switch" size="small" @change="onAutoEdgeChange" defaultChecked></a-switch>
      <a-divider type="vertical" />
      <a-button
        icon="sync"
        :title="$t('task.direction')"
        size="small"
        type="link"
        @click="onChangeScreen"
      ></a-button>
      <a-button
        icon="fullscreen"
        :title="$t('task.fullscreen')"
        size="small"
        type="link"
        @click="onFullscreen"
      ></a-button>
    </div>
    <div ref="areaContainer" class="areacontainer">
      <div
        v-if="!loadingArea"
        class="area"
        :style="{left:containerStyle.x+'px', width:containerStyle.w+'px', height:containerStyle.h+'px', top:containerStyle.y+'px'}"
      >
        <div class="areabg" :style="{background:backgroundStyle}"></div>
        <vue-draggable-resizable
          v-for="area in areas"
          :ref="area.k"
          :key="area.k"
          :area="area.k"
          :resizable="true"
          :parent="true"
          :w="area.w"
          :h="area.h"
          :x="area.x"
          :y="area.y"
          :minWidth="5"
          :minHeight="5"
          @resizestop="onAreaResize"
          @dragstop="onAreaResize"
          @activated="onAreaActived"
          @deactivated="onAreaDeactived"
          @dblclick.native="onDbClickArea"
        >
          <component :is="'Area'+area.type"></component>
        </vue-draggable-resizable>
      </div>
    </div>
    <a-drawer
      :title="$t('task.areaProperty')"
      placement="right"
      :width="500"
      :closable="false"
      :visible="areaPropertyShow"
      @close="onCloseProperty"
    >
      <a-form layout="vertical" hideRequiredMark>
        <a-row :gutter="8">
          <a-col :span="6">
            <a-form-item :label="$t('task.x')">
              <a-input-number :min="0" :max="screen.w-areaSize.w" v-model="areaSize.x" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('task.y')">
              <a-input-number :min="0" :max="screen.h-areaSize.h" v-model="areaSize.y" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('task.w')">
              <a-input-number :min="1" :max="screen.w-areaSize.x" v-model="areaSize.w" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('task.h')">
              <a-input-number :min="1" :max="screen.h-areaSize.y" v-model="areaSize.h" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <component ref="property" :is="propertyComponent"></component>
    </a-drawer>
    <component ref="model" :is="currentModel" @ok="handleModelOk" @close="handleModelClose"></component>
  </div>
</template>

<script>
import { triggerWindowHideSideEvent } from '@/utils/util'
import VueDraggableResizable from './VueDraggableResizable'
import ObserveResize from 'simple-element-resize-detector'
import set from 'lodash.set'
import AreaMix from './area/AreaMix'
import AreaAdv from './area/AreaAdv'
import AreaPic from './area/AreaPic'
import AreaTxt from './area/AreaTxt'
import AreaWeather from './area/AreaWeather'
import AreaHtml from './area/AreaHtml'
import AreaLogo from './area/AreaLogo'
import AreaQrcode from './area/AreaQrcode'
import Playlist from './Playlist'
import AdvProp from './AdvProp'
import BackgroundColorWin from './win/BackgroundColorWin'
import SaveTemplateWin from './template/SaveTemplateWin'
import TemplateChoose from './template/TemplateChoose'

export default {
  components: {
    VueDraggableResizable,
    AreaMix,
    AreaAdv,
    AreaPic,
    AreaTxt,
    AreaWeather,
    AreaHtml,
    AreaLogo,
    AreaQrcode,
    Playlist,
    AdvProp,
    BackgroundColorWin,
    SaveTemplateWin,
    TemplateChoose
  },
  mounted () {
    var that = this
    ObserveResize(this.$el.parentNode, () => {
      setTimeout(() => {
        that.onResize()
      }, 100)
    })

    window.addEventListener(
      'resize',
      event => {
        that.onResize()
      },
      false
    )
    setTimeout(() => {
      this.onResize()
    }, 1000)
  },
  data () {
    return {
      areaKey: 0,
      areaEdge: 20,
      fullscreen: false,
      loadingArea: true,
      areaPropertyShow: false,
      propertyComponent: '',
      screen: {
        w: 1920,
        h: 1080
      },
      zoom: 100,
      activitedArea: '',
      containerStyle: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      },
      background: {
        color: '',
        media: {
          id: 0
        }
      },
      areaSize: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      },
      areas: [],
      currentModel: '',
      currentTemplate: {
        templateId: 0,
        name: ''
      }
    }
  },
  created () {
  },
  watch: {
    areaSize: {
      deep: true,
      handler: function (newSize) {
        var obj = this.areas.find(item => item.k === this.activitedArea)
        set(obj, 'x', this.calcNewSize(newSize.x, this.containerStyle.w, this.screen.w))
        set(obj, 'y', this.calcNewSize(newSize.y, this.containerStyle.h, this.screen.h))
        var w = this.calcNewSize(newSize.w, this.containerStyle.w, this.screen.w)
        var h = this.calcNewSize(newSize.h, this.containerStyle.h, this.screen.h)
        set(obj, 'w', w <= 0 ? 1 : w)
        set(obj, 'h', h <= 0 ? 1 : h)
      }
    }
  },
  computed: {
    backgroundStyle () {
      if (this.background.color.length > 0) {
        return this.background.color
      }
      return ''
    }
  },
  methods: {
    getKey (prefix) {
      return prefix + (++this.areaKey)
    },
    calcNewSize (oldVal, newSize, oldSize) {
      return parseInt(oldVal * newSize / oldSize)
    },
    onChangeScreen () {
      if (this.screen.w === 1080) {
        this.screen.w = 1920
        this.screen.h = 1080
      } else {
        this.screen.w = 1080
        this.screen.h = 1920
      }

      this.onResize()
    },
    onAutoEdgeChange (val) {
      this.areaEdge = val ? 20 : 0
    },
    onFullscreen () {
      this.fullscreen = !this.fullscreen
      this.$emit('fullscreen', this.fullscreen)
      if (this.fullscreen) {
        triggerWindowHideSideEvent()
      }
      this.onResize()
    },
    onResize () {
      this.loadingArea = true
      setTimeout(() => {
        if (!this.$refs.areaContainer) {
          return
        }
        this.loadingArea = false
        var oldWidth = this.containerStyle.w
        var oldHeight = this.containerStyle.h
        var width = this.$refs.areaContainer.clientWidth
        var height = this.$refs.areaContainer.clientHeight

        if (width / height > this.screen.w / this.screen.h) {
          var newWidth1 = parseInt(Math.round(this.screen.w / this.screen.h * height) * this.zoom / 100)
          var newHeight1 = parseInt(height * this.zoom / 100)
          this.containerStyle = {
            w: newWidth1,
            h: newHeight1,
            x: width > newWidth1 ? parseInt((width - newWidth1) / 2) : 0,
            y: height > newHeight1 ? parseInt((height - newHeight1) / 2) : 0
          }
        } else {
          var newWidth2 = parseInt(width * this.zoom / 100)
          var newHeight2 = parseInt(Math.round(this.screen.h / this.screen.w * width) * this.zoom / 100)
          this.containerStyle = {
            w: newWidth2,
            h: newHeight2,
            x: width > newWidth2 ? parseInt((width - newWidth2) / 2) : 0,
            y: height > newHeight2 ? parseInt((height - newHeight2) / 2) : 0
          }
        }

        if (oldWidth !== 0 && oldHeight !== 0) {
          this.areas.forEach(area => {
            area.x = parseInt(this.containerStyle.w * area.x / oldWidth)
            area.y = parseInt(this.containerStyle.h * area.y / oldHeight)
            area.w = parseInt(this.containerStyle.w * area.w / oldWidth)
            area.h = parseInt(this.containerStyle.h * area.h / oldHeight)
          })
        }
      }, 300)
    },
    onAreaResize (x, y, w, h) {
      var obj = this.areas.find(item => item.k === this.activitedArea)
      set(obj, 'x', x)
      set(obj, 'y', y)
      set(obj, 'w', w)
      set(obj, 'h', h)

      if (this.areaEdge > 0) {
        this.areas.forEach(area => {
          if (area.k === this.activitedArea) {
            return
          }
          if (Math.abs(area.x + area.w - x) <= this.areaEdge) {
            x = area.x + area.w
          }
          if (Math.abs(x + w - area.x) <= this.areaEdge) {
            x = area.x - w
          }
          if (Math.abs(area.y + area.h - y) <= this.areaEdge) {
            y = area.y + area.h
          }
          if (Math.abs(y + h - area.y) <= this.areaEdge) {
            y = area.y - h
          }
        })
      }

      this.$nextTick(() => {
        set(obj, 'x', x)
        set(obj, 'y', y)
      })
    },
    onAreaActived (key) {
      this.activitedArea = key
    },
    onAreaDeactived (key) {
      if (this.activitedArea === key) {
        this.activitedArea = ''
      }
    },
    loadData (areas) {
      this.areas = areas
      this.areas.forEach(area => {
        if (!area.k) {
          area.k = this.getKey('area')
        }
      })
    },
    onZoomIn () {
      this.zoom += 5
      if (this.zoom > 100) {
        this.zoom = 100
      }
      this.onResize()
    },
    onZoomOut () {
      this.zoom -= 5
      if (this.zoom < 25) {
        this.zoom = 25
      }
      this.onResize()
    },
    onSaveTemplate () {
      if (this.areas.length <= 0) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('task.noAreaError'),
          duration: 4
        })
        return
      }
      this.currentModel = 'SaveTemplateWin'
      this.$nextTick(() => {
        var area = []
        this.areas.forEach(obj => {
          area.push({
            x: this.calcNewSize(obj.x, this.screen.w, this.containerStyle.w),
            y: this.calcNewSize(obj.y, this.screen.h, this.containerStyle.h),
            w: this.calcNewSize(obj.w, this.screen.w, this.containerStyle.w),
            h: this.calcNewSize(obj.h, this.screen.h, this.containerStyle.h),
            type: obj.type
          })
        })
        this.$refs.model.show({
          templateId: 0,
          name: this.currentTemplate.name,
          width: this.screen.w,
          height: this.screen.h,
          areas: JSON.stringify(area)
        })
      })
    },
    onLoadTemplate () {
      this.currentModel = 'TemplateChoose'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    },
    onBgColor () {
      this.currentModel = 'BackgroundColorWin'
      this.$nextTick(() => {
        this.$refs.model.show(this.background.color)
      })
    },
    onAddArea (type) {
      if (this.areas.length >= 16) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('task.maxAreaCntError', ['16']),
          duration: 4
        })
        return
      }
      this.areas.push({
        k: this.getKey('area'), x: 0, y: 0, w: 100, h: 100, type: type, playlist: []
      })
    },
    onAreaEdit () {
      var obj = this.areas.find(item => item.k === this.activitedArea)
      this.areaSize = {
        x: this.calcNewSize(obj.x, this.screen.w, this.containerStyle.w),
        y: this.calcNewSize(obj.y, this.screen.h, this.containerStyle.h),
        w: this.calcNewSize(obj.w, this.screen.w, this.containerStyle.w),
        h: this.calcNewSize(obj.h, this.screen.h, this.containerStyle.h)
      }
      this.areaPropertyShow = true
      switch (obj.type) {
        case 'Mix':
        case 'Pic':
        case 'Txt':
          this.propertyComponent = 'Playlist'
          this.$nextTick(() => {
            this.$refs.property.init(obj.type, obj.playlist)
          })
          break
        case 'Adv':
          this.propertyComponent = 'AdvProp'
          break
        case 'Weather':
        case 'Logo':
        case 'Qrcode':
          break
      }
    },
    onDeleteArea () {
      var idx = this.areas.findIndex(item => item.k === this.activitedArea)
      if (idx >= 0) {
        this.activitedArea = ''
        this.areas.splice(idx, 1)
      }
    },
    onCloseProperty () {
      this.areaPropertyShow = false
      this.propertyComponent = ''
    },
    onDbClickArea (e) {
      this.onAreaEdit()
    },
    handleModelOk (value) {
      switch (this.currentModel) {
        case 'BackgroundColorWin':
          this.background.color = value
          break
        case 'SaveTemplateWin':
          this.currentTemplate.id = value
          break
        case 'TemplateChoose':
          this.screen = {
            w: value.width,
            h: value.height
          }
          this.areas = []
          value.areas.forEach((area, idx) => {
            var w = this.calcNewSize(area.w, this.containerStyle.w, this.screen.w)
            var h = this.calcNewSize(area.h, this.containerStyle.h, this.screen.h)
            var a = {
              k: this.getKey('area'),
              x: this.calcNewSize(area.x, this.containerStyle.w, this.screen.w),
              y: this.calcNewSize(area.y, this.containerStyle.h, this.screen.h),
              w: w <= 0 ? 1 : w,
              h: h <= 0 ? 1 : h,
              type: area.type,
              playlist: []
            }
            this.areas.push(a)
          })
          this.onResize()
          break
      }

      this.currentModel = ''
    },
    handleModelClose () {
      this.currentModel = ''
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .toolbar {
    background: #fff;
    height: 32px;
    padding-top: 4px;
    font-size: 8px;

    .switch {
      margin-top: -4px;
    }
  }

  .areacontainer {
    width: 100%;
    height: calc(100% - 32px);
    background: rgba(224, 224, 224, 0.65);
    position: relative;

    .area {
      background: url(~@/assets/alpha.png);
      position: relative;
      box-shadow: 0px 0px 5px rgb(245, 245, 245);

      .areabg {
        position: absolute;
        left: 0;
        top: 0;
        // z-index: -9999999;
        width: 100%;
        height: 100%;
        background: '';
      }
    }
  }
}
</style>
