<template>
  <div class="template-preview">
    <div
      class="area"
      :style="{left:containerStyle.x+'px', width:containerStyle.w+'px', height:containerStyle.h+'px', top:containerStyle.y+'px'}"
    >
      <div v-for="style in areaStyles" :key="style.id" :style="style"></div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    areas: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      containerStyle: {},
      areaStyles: []
    }
  },
  computed: {
    areaStyle () {
      var style = {
        left: '0px',
        top: '0px',
        width: '10px',
        height: '10px',
        background: 'red'
      }

      return style
    }
  },
  watch: {
    areas () {
      this.loadData()
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      var width = 166
      var height = 166
      if (!this.areas.areas) {
        return
      }
      if (this.areas.width < this.areas.height) {
        var newWidth1 = parseInt(width * this.areas.width / this.areas.height)
        var newHeight1 = parseInt(height)
        this.containerStyle = {
          w: newWidth1,
          h: newHeight1,
          x: width > newWidth1 ? parseInt((width - newWidth1) / 2) : 0,
          y: height > newHeight1 ? parseInt((height - newHeight1) / 2) : 0
        }
      } else {
        var newWidth2 = parseInt(width)
        var newHeight2 = parseInt(height * this.areas.height / this.areas.width)
        this.containerStyle = {
          w: newWidth2,
          h: newHeight2,
          x: width > newWidth2 ? parseInt((width - newWidth2) / 2) : 0,
          y: height > newHeight2 ? parseInt((height - newHeight2) / 2) : 0
        }
      }
      this.areaStyles = []
      if (this.areas.areas) {
        const colors = ['#42A5F5', '#66BB6A', '#FFA726', '#8D6E63', '#ef5350', '#7E57C2']
        this.areas.areas = JSON.parse(this.areas.areas)
        this.areas.areas.forEach((area, idx) => {
          var style = {
            position: 'absolute',
            left: parseInt(this.containerStyle.w * area.x / this.areas.width) + 'px',
            top: parseInt(this.containerStyle.h * area.y / this.areas.height) + 'px',
            width: parseInt(this.containerStyle.w * area.w / this.areas.width) + 'px',
            height: parseInt(this.containerStyle.h * area.h / this.areas.height) + 'px',
            background: colors[idx % colors.length]
          }
          this.areaStyles.push(style)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.template-preview {
  width: 100%;
  height: 0;
  padding-bottom: 100%;

  .area {
    background: url(~@/assets/alpha.png);
    position: relative;
  }
}
</style>
