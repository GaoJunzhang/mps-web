<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="640"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-form-item :label="$t('common.name')" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          :placeholder="$t('task.taskPlaceholder')"
          v-decorator="['name', {rules: [{required: true, message: $t('task.taskPlaceholder')}]}]"
        />
      </a-form-item>
      <a-form-item :label="$t('task.duration')" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-time-picker
          :allowEmpty="false"
          :placeholder="$t('task.durationPlaceholder')"
          v-decorator="['duration', {initialValue: moment('23:59:59', 'HH:mm:ss'), rules: [{type: 'object', required: true, message: $t('task.durationPlaceholder')}]}]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      maskClosable: false,
      title: this.$t('task.template'),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this),
      visible: false
    }
  },
  created () {
  },
  methods: {
    moment,
    show () {
      this.visible = true
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          this.visible = false
          this.$emit('ok', values)
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
