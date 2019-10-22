<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入名称"
            v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]"
          />
        </a-form-item>
        <a-form-item label="账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入账号"
            v-decorator="['account', {rules: [{required: true, min: 6, message: '请输入至少6个字符！'}]}]"
          />
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
            v-decorator="['role', {rules: [{ required: true, message: '请选择角色!' }]}]"
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

export default {
  data () {
    return {
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
    this.loadRoles()
  },
  methods: {
    add () {
      this.title = '新建用户'
      this.visible = true
    },
    edit (record) {
      this.title = '修改用户'
      this.visible = true
      this.userId = record.id
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'name', 'account', 'status', 'role'))
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          params.userId = this.userId
          saveUser(params).then(res => {
            if (res.errCode === 0) {
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
    }
  }
}
</script>
