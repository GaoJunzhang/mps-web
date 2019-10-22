<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <div class="tinymce">
      <editor id="tinymce" v-model="tinymceHtml" :init="init"></editor>
    </div>
    <div v-html="tinymceHtml" ref="sub" v-show="false"></div>
  </a-modal>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
export default {
  name: 'SubtitleForm',
  components: {
    Editor
  },
  data () {
    return {
      init: {
        language_url: '/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/ui/oxide',
        height: 300,
        plugins: 'colorpicker textcolor wordcount contextmenu',
        fontsize_formats: '9px 10px 12px 13px 14px 16px 18px 21px 24px 28px 32px 36px', // 第二步
        // font_formats: 'Lato=Lato;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats',
        toolbar:
          'bold italic underline strikethrough | fontsizeselect fontselect | forecolor backcolor | bullist numlist | undo redo | removeformat',
        branding: false,
        menubar: false
      },
      tinymceHtml: '',
      maskClosable: false,
      title: '编辑字幕',
      confirmLoading: false,
      visible: false
    }
  },
  methods: {
    show (mGroupId, mGroupName) {
      console.log('mGroupId', mGroupId)
      console.log('mGroupName', mGroupName)
      this.visible = true
    },
    handleSubmit () {
      console.log('sub', this.$refs.sub)
      // console.log(tinymce.activeEditor.getContent())
      // console.log(tinymce.activeEditor.getBody())
      // console.log(this.tinymceHtml)
      const activeEditor = tinymce.activeEditor
      const editBody = activeEditor.getBody()
      console.log('style', editBody.style)
      console.log('getContent', tinymce.activeEditor.getContent())
      console.log('body', editBody)
      console.log('html', editBody)
      // console.log('font-size', tinymce.activeEditor.dom.getStyle('tinymce', 'font-size', true))
      // console.log('family', tinymce.activeEditor.dom.getStyle('tinymce', 'font-family', true))
      // console.log('css1', tinymce.activeEditor.dom.getSize(editBody))
      // console.log('css2', tinymce.activeEditor.dom.getAttribs(editBody))
      // console.log('css4', tinymce.activeEditor.dom.getAttrib('tinymce', 'size', '16px'))
      activeEditor.selection.select(editBody)
      const text = activeEditor.selection.getContent({ 'format': 'text' })
      console.log(this.tinymceHtml)
      console.log(text)
    },
    handleCancel () {
      this.visible = false
      this.$emit('close')
    }
  },
  mounted () {
    tinymce.init({
      selector: '#textarea',
      // 注册button
      toolbar: 'mybutton',

      setup: function (editor) {
        // 定义按钮，
        editor.addButton('mybutton', {
          // 按钮，名
          text: '预览',
          // 是否显示图标
          icon: false,
          // onclick事件
          onclick: function () {
            // 这里点击后会插入一句话
            editor.insertContent('&nbsp;<b>It\'s my button!</b>&nbsp;')
          }
        })
      }
    })
  }
}
</script>
