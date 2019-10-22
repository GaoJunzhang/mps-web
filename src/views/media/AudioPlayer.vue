<template>
  <a-drawer
    :placement="placement"
    :destroyOnClose="true"
    @close="onClose"
    height="110"
    :visible="showAudioPlayer"
  >
    <aplayer
      autoplay
      :music="musicList">
    </aplayer>
  </a-drawer>
</template>

<script>

import aplayer from 'vue-aplayer'
export default {
  name: 'AudioPlayer',
  props: {
    pdfurl: {
      type: String,
      default: 'http://seeyoomps.oss-cn-shanghai.aliyuncs.com/mpsoss/1569822332842.mp3'
    }
  },
  components: {
    aplayer: aplayer
  },
  data () {
    return {
      placement: 'bottom',
      showAudioPlayer: false,
      musicList: {
        title: 'Music',
        artist: 'zgj',
        src: this.pdfurl,
        pic: 'https://s2.ax1x.com/2019/09/24/ukh3WQ.png'
      }
    }
  },
  computed: {
    url () {
      return this.pdfurl
    }
  },
  methods: {
    show (mobj) {
      this.showAudioPlayer = true
      this.musicList.src = mobj.path
      this.musicList.title = mobj.name
    },
    onClose () {
      this.showAudioPlayer = false
    }
  },
  mounted () {

  }

}
</script>

<style scoped>
</style>
