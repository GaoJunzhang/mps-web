<template>
  <div class="area">
    <a-upload-dragger
      name="file"
      :multiple="true"
      :data="uploadParam"
      listType="picture"
      action="/mgroup/uploadMedia"
      @change="handleChange"
      @beforeUpload="beforeUpload"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">Click or drag file to this area to upload</p>
      <p
        class="ant-upload-hint"
      >Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
    </a-upload-dragger>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  created () {
  },
  methods: {
    uploadParam (file) {
      return {
        name: file.name
      }
    },
    beforeUpload (file, fileList) {
      return true
    },
    handleChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.area {
  width: 100%;
  height: 100%;
}
</style>
