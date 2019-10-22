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
        <a-form-item label="设备名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['deviceName', { rules: [{ required: true, message: '请输入设备名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="设备编号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['deviceMac', { rules: [{ required: false}] }]"
          />
        </a-form-item>
        <a-form-item label="设备类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select v-decorator="['deviceTypeId', { rules: [{ required: true, message: '请选择设备类型'}] }]">
            <a-select-option v-for="item in typeList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="预留字段1" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['filed1', { rules: [{ required: false}] }]"
          />
        </a-form-item>
        <a-form-item label="预留字段2" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['filed2', { rules: [{ required: false}] }]"
          />
        </a-form-item>
        <a-form-item label="预留字段3" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['filed3', { rules: [{ required: false}] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { addDevice, getAllDeviceType } from '@/api/resource'
export default {
  name: 'DeviceDetail',
  data () {
    return {
      visible: false,
      formLoading: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      mdl: {},
      typeList: []
    }
  },
  methods: {
    add () {
      this.mdl = null
      this.visible = true
    },
    getTypeList () {
      getAllDeviceType().then(res => {
        if (res.success === true) {
          this.typeList = res.result
        } else {
          this.message.error('初始化设备类型失败')
        }
      })
    },
    edit (record) {
      this.mdl = record
      this.visible = true
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'deviceName', 'deviceMac', 'deviceTypeId', 'filed1', 'filed2', 'filed3'))
      })
    },
    handleCancel () {
      this.visible = false
    },
    checkIsNull (dtId) {
      let flag = true
      for (let i = 0; i < this.typeList.length; i++) {
        if (dtId === this.typeList[i].id) {
          if (this.typeList[i].isNull === 1) {
            flag = false
          }
          break
        }
      }
      return flag
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          const param = values
          console.log('values', values)
          if (!this.checkIsNull(param.deviceTypeId) && (param.deviceMac === '' || param.deviceMac === null)) {
            this.$message.info('该类型设备编号不允许为空')
            return
          }
          if (this.mdl != null) {
            param.isDelete = this.mdl.isDelete
            param.id = this.mdl.id
          } else {
            param.isDelete = 0
          }
          console.log('param', param)
          _this.confirmLoading = true
          addDevice(param).then(res => {
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
  },
  mounted () {
    this.getTypeList()
  }
}
</script>

<style scoped>

</style>
