<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    @ok="() => setModal1Visible(false)"
    @cancel="() => setModal1Visible(false)"
    :footer="null"
  >
    <video id="media" ref="media" controls autoplay style="background-color:#fff;height:100%;width:100%;"></video>
  </a-modal>
</template>

<script>
import flvjs from 'flv.js'
export default {
  name: 'FlvPlayer',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      title: '视频',
      visible: false
    }
  },
  methods: {
    show (media) {
      this.title = media.name
      this.visible = true
      const flvSrc = media.path
      this.$nextTick(function () {
        if (flvjs.isSupported()) {
          const videoElement = this.$refs.media
          var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            // url: 'http://yunxianchang.live.ujne7.com/vod-system-bj/TLaf2cc9d469939803949187b46da16c45.flv'
            url: flvSrc
          })
          flvPlayer.attachMediaElement(videoElement)
          flvPlayer.load()
          flvPlayer.play()
        }
      })
    },
    setModal1Visible (visible) {
      this.visible = visible
    }
  },
  mounted () {
    const videoDom = this.$refs.media
    console.log('videoDom', videoDom)
  }
}
</script>

<style scoped>
</style>
