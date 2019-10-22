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
        <a-form-item :label="$t('common.name')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :placeholder="$t('mgroup.namePlaceholder')"
            v-decorator="['name', {rules: [{required: true, min: 2, message: this.$t('mgroup.nameRules')}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { saveTemplate } from '@/api/template'

export default {
  data () {
    return {
      maskClosable: false,
      title: this.$t('task.saveTemplate'),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      params: {},
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created () {
  },
  methods: {
    show (params) {
      this.title = this.$t('task.saveTemplate')
      this.visible = true
      this.params = params
      if (params.name) {
        this.$nextTick(() => {
          this.form.setFieldsValue({ name: params.name })
        })
      }
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          this.params.name = values.name
          saveTemplate(this.params).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: this.$t('common.success'),
                description: this.$t('task.saveTemplateSuccess'),
                duration: 4
              })
              this.visible = false
              this.$emit('ok', res.result)
            } else {
              this.$notification['error']({
                message: this.$t('common.error'),
                description: res.errMsg || this.$t('common.tryLater'),
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
    }
  }
}
</script>
