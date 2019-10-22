<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="630"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <div id="components-layout-demo-basic">
      <a-layout>
        <a-layout-header>
          <a-select
            showSearch
            optionFilterProp="children"
            defaultValue="16px"
            class="aselect"
            @change="handleSizeChange"
            :filterOption="filterOption"
          >
            <a-select-option v-for="i in fonts" :key="i">{{ i }}</a-select-option>
          </a-select>
          <a-select
            showSearch
            optionFilterProp="children"
            defaultValue="宋体"
            class="aselect"
            @change="handleFamilyChange"
            :filterOption="filterOption"
          >
            <a-select-option v-for="i in fontsFamily" :key="i">{{ i }}</a-select-option>
          </a-select>
          <a-popover
            title="字体颜色"
            trigger="click"
            v-model="fontvisible"
            placement="bottom"
            class="aselect"
          >
            <sketch-picker v-model="colors" slot="content" @input="updateValue"/>
            <a-button :style="fStyle">颜色</a-button>
          </a-popover>
          <a-popover
            title="背景颜色"
            trigger="click"
            v-model="bvisible"
            placement="bottom"
            class="aselect"
          >
            <sketch-picker v-model="colors" slot="content" @input="updateBValue"/>
            <a-button :style="bStyle">背景</a-button>
          </a-popover>
          <a-button @click="resetStyle">清除样式</a-button>
        </a-layout-header>
        <a-layout-content>
          <a-textarea placeholder="请输入字幕" :autosize="true" :style="subtitleStyle"/>
        </a-layout-content>
      </a-layout>
    </div>
  </a-modal>
</template>

<script>
import { Material, Compact, Swatches, Slider, Sketch, Chrome, Photoshop } from 'vue-color'
export default {
  name: 'SubtitleForm',
  components: {
    'material-picker': Material,
    'compact-picker': Compact,
    'swatches-picker': Swatches,
    'slider-picker': Slider,
    'sketch-picker': Sketch,
    'chrome-picker': Chrome,
    'photoshop-picker': Photoshop
  },
  data () {
    return {
      fontvisible: false,
      bvisible: false,
      maskClosable: false,
      title: '编辑字幕',
      confirmLoading: false,
      visible: false,
      fonts: [],
      fontsFamily: [ '宋体', '黑体', '微软雅黑' ],
      colors: '#194d33',
      fStyle: {
        background: 'black',
        color: 'white'
      },
      bStyle: {
        background: 'white'
      },
      subtitleStyle: {
        'color': 'black',
        'height': '120px',
        'font-family': '宋体',
        'font-size': '16px',
        'background-color': 'white'
      }
    }
  },
  methods: {
    show (mGroupId, mGroupName) {
      console.log('mGroupId', mGroupId)
      console.log('mGroupName', mGroupName)
      this.visible = true
    },
    handleSubmit () {
    },
    handleCancel () {
      this.visible = false
      this.$emit('close')
    },
    handleSizeChange (v) {
      console.log(v)
      this.subtitleStyle['font-size'] = v
    },
    handleFamilyChange (v) {
      console.log(v)
      this.subtitleStyle['font-family'] = v
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    initFontSizes () {
      for (let i = 9; i <= 36; i++) {
        this.fonts.push(i + 'px')
      }
    },
    updateValue (v) {
      console.log(v.hex)
      this.fStyle.background = v.hex
      this.subtitleStyle.color = v.hex
    },
    updateBValue (v) {
      console.log(v.hex)
      this.bStyle.background = v.hex
      this.subtitleStyle['background-color'] = v.hex
    },
    resetStyle () {
      this.subtitleStyle = {
        'color': 'black',
        'height': '120px',
        'font-family': '宋体',
        'font-size': '16px',
        'background-color': 'white'
      }
    }
  },
  mounted () {
    this.initFontSizes()
  }
}
</script>
<style>
  #components-layout-demo-basic {
    text-align: center;
  }
  #components-layout-demo-basic .ant-layout-header{
    background: #7dbcea;
    color: #fff;
  }

  #components-layout-demo-basic .ant-layout-sider {
    background: #3ba0e9;
    color: #fff;
  }
  .aselect {
    width: 80px;
    margin-right: 5px;
  }
</style>
