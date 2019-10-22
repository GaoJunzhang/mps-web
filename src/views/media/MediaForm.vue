<template>
  <a-drawer
    title="上传文件"
    width="650"
    placement="right"
    @close="onClose"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <div style="align:center">
      <!--<mgroup-select-tree @change="change" :mGroupId="mGroupId"></mgroup-select-tree>-->
      <a-tag color="#f50">      <a-icon type="tag" />   {{ mGroupTitle }}</a-tag>
      <a-upload-dragger
        name="file"
        :multiple="true"
        :action="uploadOssUrl"
        :headers="accessToken"
        :beforeUpload="handleBeforeUpload"
        :remove="handleRemove"
        :data="uploadParam"
        @change="handleChange">
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">单击或拖动文件到此区域以上传</p>
        <p class="ant-upload-hint">支持单次或批量上传</p>
      </a-upload-dragger>
    </div>
    <div style="position: absolute;left: 0;bottom: 0;width: 100%;border-top: 1px solid #e9e9e9;padding: 10px 16px;background: #fff;text-align: right">
      <a-button type="primary" @click="onClose">完成</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { uploadOss } from '@/api/oss'
// import MgroupSelectTree from './MgroupSelectTree'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  name: 'MediaForm',
  // components: {
  //   MgroupSelectTree
  // },
  data () {
    return {
      destroyOnClose: true,
      uploadOssUrl: uploadOss + '?t=' + new Date().getTime(),
      accessToken: {},
      visible: false,
      confirmLoading: false,
      treeExpandedKeys: [],
      value: undefined,
      mGroupId: undefined,
      mGroupTitle: ''
    }
  },
  methods: {
    uploadParam (file) {
      const param = {}
      const that = this
      param.size = file.size
      param.name = file.name
      if (file.type.indexOf('image') !== -1) {
        param.type = 0
      } else if (file.type.indexOf('video') !== -1) {
        param.type = 1
      } else if (file.type.indexOf('audio') !== -1) {
        param.type = 2
      } else if (file.type.indexOf('application') !== -1) {
        param.type = 3
      }
      param.mGroupId = that.mGroupId
      return param
    },
    onChange (value) {
      this.value = value
    },
    show (mgroupId, title) {
      if (mgroupId) {
        this.mGroupId = mgroupId
        this.mGroupTitle = title
      }
      this.accessToken = {
        'Access-Token': Vue.ls.get(ACCESS_TOKEN)
      }
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    },
    change (value) {
      this.mGroupId = value
    },
    handleChange (info) {
      const status = info.file.status
      if (status === 'done') {
        this.$message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name}文件上传失败.`)
      }
    },
    handleRemove (v) {
      if (v.response === undefined || v.response.success === null) {
        this.$message.error('文件异常')
        return
      }
      console.log('删除', v.response)
    },
    handleBeforeUpload (file) {
      return new Promise((resolve, reject) => {
        if (!this.mGroupId) {
          this.$message.error('请选择媒体组')
          // eslint-disable-next-line
          return reject(false)
        }
        return resolve(true)
      })
    },
    onClose () {
      this.visible = false
    }
  }
}
</script>
