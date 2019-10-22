<template>
  <a-modal
    :maskClosable="true"
    :title="$t('task.property')"
    :width="640"
    :visible="visiblePropertyModal"
    @ok="handlePropertyOk"
    @cancel="handlePropertyCancel"
  >
    <a-form :form="form">
      <a-form-item
        v-if="formLoop"
        :label="$t('task.loop')"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number
          :min="1"
          :placeholder="$t('task.loop')"
          v-decorator="['loop', {initialValue:1,rules: [{required: true, message: $t('task.loopError')}]}]"
        />
      </a-form-item>
      <a-form-item
        v-if="formDuration"
        :label="$t('task.duration')"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number
          :min="5"
          :placeholder="$t('task.duration')"
          v-decorator="['duration', {initialValue:15,rules: [{required: true, message: $t('task.durationError')}]}]"
        />
      </a-form-item>
      <a-form-item
        v-if="formSpeed"
        :label="$t('task.speed')"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number
          :min="1"
          :max="5"
          :placeholder="$t('task.speed')"
          v-decorator="['speed', {initialValue:1,rules: [{required: true, message: $t('task.speedError')}]}]"
        />
      </a-form-item>
      <a-form-item
        v-if="formVolume"
        :label="$t('task.volume')"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-slider :min="0" :max="100" v-decorator="['volume', {initialValue:100}]" />
      </a-form-item>
      <a-form-item
        v-if="formValidDate"
        :label="$t('common.validDate')"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-range-picker
          v-decorator="['validDate', {rules: [{ type: 'array' }]}]"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
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
      visiblePropertyModal: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      editProperty: []
    }
  },
  created () {
  },
  computed: {
    formLoop () {
      return this.showFormItem('loop')
    },
    formSpeed () {
      return this.showFormItem('speed')
    },
    formVolume () {
      return this.showFormItem('volume')
    },
    formValidDate () {
      return this.showFormItem('validDate')
    },
    formDuration () {
      return this.showFormItem('duration')
    }
  },
  methods: {
    moment,
    show (editProperty, configs) {
      this.visiblePropertyModal = true
      this.editProperty = editProperty
      this.form.resetFields()
      if (configs) {
        var config = {}
        this.editProperty.forEach(prop => {
          if (prop === 'validDate') {
            if (configs.start.length > 0 && configs.end.length > 0) {
              config.validDate = [
                moment(configs.start, 'YYYY-MM-DD HH:mm:ss'),
                moment(configs.end, 'YYYY-MM-DD HH:mm:ss')
              ]
            }
          } else {
            config[prop] = configs[prop]
          }
        })
        this.$nextTick(() => {
          this.form.setFieldsValue(config)
        })
      }
    },
    showFormItem (prop) {
      return this.editProperty.find(obj => obj === prop)
    },
    handlePropertyOk () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          this.visiblePropertyModal = false
          if (values.validDate && values.validDate.length === 2) {
            values.start = values.validDate[0].format('YYYY-MM-DD HH:mm:ss')
            values.end = values.validDate[0].format('YYYY-MM-DD HH:mm:ss')
          } else if (this.showFormItem('validDate')) {
            values.start = ''
            values.end = ''
          }
          delete values.validDate
          this.$emit('ok', values)
        }
      })
    },
    handlePropertyCancel () {
      this.visiblePropertyModal = false
    }
  }
}
</script>
