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
    <template slot="footer">
      <a-button key="failed" @click="handleSubmit(0)">{{ $t('task.auditFail') }}</a-button>
      <a-button key="pass" type="primary" @click="handleSubmit(1)">{{ $t('task.auditPass') }}</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="$t('task.remark')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            :placeholder="$t('task.remarkPlaceholeder')"
            :autosize="{ minRows: 2, maxRows: 6 }"
            v-decorator="['remark', {rules: [{required: false}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { auditTask } from '@/api/task'

export default {
  data () {
    return {
      maskClosable: false,
      title: this.$t('common.audit'),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      visible: false,
      ids: []
    }
  },
  created () {
  },
  methods: {
    audit (ids) {
      this.ids = ids
      this.visible = true
    },
    handleSubmit (audit) {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          params.ids = this.ids
          params.audit = audit
          auditTask(params).then(res => {
            if (res.code === 200) {
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
