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
        <a-form-item :label="$t('mgroup.shareDir')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['share', {initialValue: 0, rules: [{ required: true, message: this.$t('mgroup.shareRules') }]}]"
            :placeholder="$t('mgroup.namePlaceholder')"
          >
            <a-select-option v-for="item in status" :key="item.key">{{ item.val }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('mgroup.remark')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            :placeholder="$t('mgroup.remarkPlaceholeder')"
            :autosize="{ minRows: 2, maxRows: 6 }"
            v-decorator="['remark', {rules: [{required: false}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { saveMgroup } from '@/api/mgroup'

export default {
  data () {
    return {
      maskClosable: false,
      title: this.$t('mgroup.mgroup'),
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
          val: this.$t('common.no')
        },
        {
          key: 1,
          val: this.$t('common.yes')
        }
      ],
      mgroupId: null,
      parentId: null,
      isEdit: false,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created () {
  },
  methods: {
    add (mgroupId) {
      this.title = this.$t('mgroup.newMgroup')
      this.visible = true
      if (mgroupId >= 0) {
        this.parentId = mgroupId
      }
    },
    edit (mgroup) {
      this.title = this.$t('mgroup.editMgroup')
      this.visible = true
      this.mgroupId = mgroup.key
      mgroup.name = mgroup.title
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(mgroup, 'name', 'share', 'remark'))
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          params.mgroupId = this.mgroupId
          params.parentId = this.parentId
          saveMgroup(params).then(res => {
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
