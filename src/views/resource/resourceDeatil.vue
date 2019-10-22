<template>
  <a-modal
    title="设备类型"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <a-spin :spinning="formLoading">
      <a-form :form="form">
        <a-form-item label="标签名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请输入设备名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="备注" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['remark', { rules: [{ required: false}] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { addResourceLab } from '@/api/resource'
export default {
  name: 'DeviceDetail',
  data () {
    return {
      visible: false,
      formLoading: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      mdl: {}
    }
  },
  methods: {
    add () {
      this.mdl = null
      this.visible = true
      this.form.resetFields()
      const record = {}
      record.isNull = '0'
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'isNull'))
      })
    },
    edit (record) {
      this.mdl = record
      this.visible = true
      const { form: { setFieldsValue } } = this
      record.isNull += ''
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'name', 'isNull', 'remark'))
      })
    },
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          const param = values
          console.log('values', values)

          if (this.mdl != null) {
            param.isDelete = this.mdl.isDelete
            param.id = this.mdl.id
          } else {
            param.isDelete = 0
          }
          console.log('param', param)
          _this.confirmLoading = true
          addResourceLab(param).then(res => {
            console.log(res)
            if (res.success) {
              _this.handleCancel()
              this.$emit('ok', values)
              _this.$message.success('保存成功')
            } else {
              _this.$message.error(res.message)
            }
          })
          _this.confirmLoading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
