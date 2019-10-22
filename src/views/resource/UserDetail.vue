<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="昵称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入昵称"
            v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]"
          />
        </a-form-item>
        <a-form-item label="账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入账号"
            v-decorator="['account', {rules: [{required: true, min: 6, message: '请输入至少6个字符！'}]}]"
          />
        </a-form-item>
        <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入密码"
            type="password"
            v-decorator="['password', {rules: [{required: true, min: 6, message: '请输入至少6个字符！'}]}]"
          />
        </a-form-item>
        <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入手机号"
            v-decorator="['mobile', {rules: [{required: true, min: 6, message: '请输入至少6个字符！'}]}]"
          />
        </a-form-item>
        <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="输入图片地址" v-decorator="['avatar', {rules: [{required: true, message: '请输入选择头像'}]}]">
            <a-upload
              slot="addonAfter"
              name="file"
              :multiple="true"
              :action="uploadOssUrl"
              :headers="accessToken"
              @change="handleChange"
              :accept="accept"
            >
              <a-button type="primary" icon="cloud-upload">上传</a-button>
            </a-upload>
          </a-input>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['status', {initialValue: 1, rules: [{ required: true, message: '请选择状态!' }]}]"
            placeholder="请选择状态"
          >
            <a-select-option v-for="item in status" :key="item.key">{{ item.val }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['roleId', {rules: [{ required: true, message: '请选择角色!' }]}]"
            placeholder="请选择角色"
          >
            <a-select-option v-for="item in roles" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { getAllRoles, saveUser } from '@/api/user'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { uploadAvatar } from '@/api/oss'
import Vue from 'vue'

export default {
  data () {
    return {
      accept: '.jpg, .jpeg , .png , .gif, .bmp',
      headers: {
        authorization: 'authorization-text'
      },
      uploadOssUrl: uploadAvatar,
      accessToken: {},
      maskClosable: false,
      title: '新建用户',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      status: [
        {
          key: 0,
          val: '禁用'
        },
        {
          key: 1,
          val: '启用'
        }
      ],
      userId: null,
      isEdit: false,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      roles: []
    }
  },
  created () {
    this.accessToken = {
      'accessToken': Vue.ls.get(ACCESS_TOKEN)
    }
    this.loadRoles()
  },
  methods: {
    add () {
      this.title = '新建用户'
      this.visible = true
    },
    edit (record) {
      console.log(record)
      this.title = '修改用户'
      this.visible = true
      this.userId = record.id
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'name', 'account', 'status', 'roleId', 'password', 'avatar', 'status', 'mobile'))
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          params.id = this.userId
          console.log('上传参数==', params)
          saveUser(params).then(res => {
            if (res.success === true) {
              this.visible = false
              this.$emit('ok', values)
            } else {
              this.$notification['error']({
                message: '错误',
                description: res.errMsg || '请求出现错误，请稍后再试',
                duration: 4
              })
            }

            this.confirmLoading = false
          }, () => {
            this.confirmLoading = false
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.$emit('close')
    },
    loadRoles () {
      getAllRoles({}).then(res => {
        this.roles = res
        return res
      })
    },
    handleChange (info) {
      console.log('上传文件', info.file.response)
      const res = info.file.response
      const status = info.file.status
      if (status === 'done') {
        if (res.success === true) {
          const record = {}
          record.avatar = res.result
          const { form: { setFieldsValue } } = this
          this.$nextTick(() => {
            setFieldsValue(pick(record, 'avatar'))
          })
        }
        this.$message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name}文件上传失败.`)
      }
    }
  }
}
</script>
