<template>
  <a-drawer
    title="添加菜单"
    :maskClosable="false"
    width="650"
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="menuAddVisiable"
    :pauth="pauth"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">

    <a-form :form="form">
      <a-form-item
        v-bind="formItemLayout"
        label="类型"
      >
        <a-tag color="pink" v-if="pauth == null">分组栏目</a-tag>
        <a-tag color="green" v-if="pauth != null && pauth.lev==1">页面菜单</a-tag>
        <a-tag color="orange" v-if="pauth != null &&pauth.lev==2">权限按钮</a-tag>
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        has-feedback
        label="父节点"
        v-if="pauth!=null"
      >
        <a-input
          disabled
          v-decorator="[
            'parentName',
            {rules: [{ required: true, message: '请输入父节点' }]}
          ]"
          id="name"
          placeholder="菜单名称"
        />
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        has-feedback
        label="菜单名称"
      >
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入菜单名称' }]}
          ]"
          id="name"
          placeholder="菜单名称"
        />
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="action"
        has-feedback
      >
        <a-input
          id="action"
          placeholder="action"
          v-decorator="[
            'action',
            {rules: [{ required: true, message: '请输入action' }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="Component"
        help="Component组件地址"
        has-feedback
        v-if="pauth!=null && pauth.lev!=2"
      >
        <a-input
          id="component"
          placeholder="component"
          v-decorator="[
            'component',
            {rules: [{ required: true, message: '请输入component' }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="path"
        help="跳转路径"
        has-feedback
        v-if="pauth==null || (pauth != null && pauth.lev==1)"
      >
        <a-input
          id="path"
          placeholder="跳转路径"
          v-decorator="[
            'path',
            {rules: [{ required: true, message: '跳转路径' }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="图标"
        has-feedback
        v-if="pauth==null || (pauth != null && pauth.lev==1)"
      >
        <a-input ref="icons" v-model="menu.icon" placeholder="点击右侧按钮选择图标">
          <a-icon v-if="menu.icon" slot="suffix" type="close-circle" @click="deleteIcons"/>
          <a-icon slot="addonAfter" type="setting" style="cursor: pointer" @click="chooseIcons"/>
        </a-input>
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="是否显示"
        has-feedback
      >
        <a-switch checkedChildren="是" unCheckedChildren="否" v-model="isShow" @change="changeHidden"/>
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="排序"
        has-feedback
      >
        <a-input-number
          :min="0"
          @change="handleNumberChange"
          v-decorator="[
            'sort'
          ]"
        />
      </a-form-item>
    </a-form>
    <div style="position: absolute;left: 0;bottom: 0;width: 100%;border-top: 1px solid #e9e9e9;padding: 10px 16px;background: #fff;text-align: right">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="formLoading">提交</a-button>
    </div>

    <icons
      @choose="handleIconChoose"
      @close="handleIconCancel"
      :iconChooseVisible="iconChooseVisible">
    </icons>
  </a-drawer>
</template>

<script>
import Icons from './Icons'
import { saveAuth } from '@/api/menu'
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'MenuForm',
  components: { Icons },
  props: {
    menuAddVisiable: {
      type: Boolean,
      default: false
    },
    pauth: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pId: '',
      formLoading: false,
      confirmLoading: false,
      menu: {
        icon: ''
      },
      form: this.$form.createForm(this),
      iconChooseVisible: false,
      formItemLayout,
      isShow: true,
      hidden: 0
    }
  },
  methods: {
    handleSubmit () {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          const param = values
          param.code = ''
          param.icon = that.menu.icon
          param.hidden = that.hidden
          if (that.pauth != null) {
            param.parentId = that.pauth.id
            param.lev = that.pauth.lev + 1
            if (that.pauth.type === 1 && that.pauth.lev === 1) {
              param.type = 1
            } else {
              param.type = 2
              param.component = ''
              param.path = ''
              param.icon = ''
            }
          } else {
            param.lev = 1
            param.type = 1
            param.component = 'RouteView'
          }
          saveAuth(param).then(res => {
            if (res.success) {
              that.onClose()
              that.$message.success('保存成功')
              this.$emit('success')
            } else {
              that.$message.error(res.message)
            }
          })
          that.confirmLoading = false
        }
      })
    },
    deleteIcons () {
      this.menu.icon = ''
    },
    chooseIcons () {
      this.iconChooseVisible = true
    },
    handleNumberChange (value) {
      this.number = {
        ...validatePrimeNumber(value),
        value
      }
    },
    reset () {
      this.loading = false
      this.menu = {}
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleIconCancel () {
      this.iconChooseVisible = false
    },
    handleIconChoose (value) {
      this.menu.icon = value
      this.iconChooseVisible = false
    },
    add (type) {
      const that = this
      const { form: { setFieldsValue } } = this
      if (type === 0) {
        setTimeout(() => {
          setFieldsValue({
            'sort': 0
          })
        }, 0)
      }
      if (type === 1) {
        setTimeout(() => {
          setFieldsValue({
            'parentName': that.pauth.name,
            'sort': 0
          })
        }, 0)
      }
    },
    changeHidden (checked) {
      this.isShow = checked
      if (checked === true) {
        this.hidden = 0
      } else {
        this.hidden = 1
      }
    }
  }
}

function validatePrimeNumber (number) {
  if (number === 11) {
    return {
      validateStatus: 'success',
      errorMsg: null
    }
  }
  return {
    validateStatus: 'error',
    errorMsg: '排序不能小于0!'
  }
}
</script>

<style scoped>

</style>
