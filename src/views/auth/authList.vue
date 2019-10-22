<template>
  <div>
    <a-card>
      <a-row>
        <a-col :span="12" :order="1">
          <div class="content">
            <div class="table-page-search-wrapper">
              <div class="table-operator">
                <a-button
                  v-action:user:add
                  type="primary"
                  icon="plus"
                  @click="createMenu(0)"
                >添加栏目
                </a-button>
                <a-button
                  v-action:role:add
                  type="primary"
                  :disabled="showAddNode"
                  icon="edit"
                  @click="createMenu(1)"
                >添加子节点
                </a-button>
                <a-button
                  v-action:user:del
                  type="primary"
                  :disabled="checkedKeys.length <= 0"
                  icon="delete"
                  @click="handleDelete()"
                >删除
                </a-button>
              </div>
            </div>
          </div>
          <a-tree
            checkable
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            v-model="checkedKeys"
            @select="onSelect"
            @check="onCheck"
            :selectedKeys="selectedKeys"
            :checkStrictly="true"
            :treeData="treeData"
          />
        </a-col>
        <a-col :span="12" :order="2">
          <a-card>

            <a-form :form="form" @submit="handleSubmit">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="类型"
              >
                <a-tag color="pink" v-if="lev==1">分组栏目</a-tag>
                <a-tag color="green" v-if="lev==2">页面菜单</a-tag>
                <a-tag color="orange" v-if="lev==3">权限菜单</a-tag>
              </a-form-item>
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
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
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="父节点"
                has-feedback
              >
                <a-input
                  id="parentName"
                  placeholder="父节点"
                  disabled
                  v-decorator="[
                    'parentName'
                  ]"
                />
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
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
                v-if="lev!=3"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="Component"
                help="Component组件地址"
                has-feedback
              >
                <a-input
                  id="component"
                  placeholder="component"
                  v-decorator="[
                    'component',
                    {rules: [{ required: true, message: '请输入页面路径' }]}
                  ]"
                />
              </a-form-item>
              <a-form-item
                v-if="lev!=3"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="path"
                help="path"
                has-feedback
              >
                <a-input
                  id="path"
                  placeholder="跳转路径"
                  v-decorator="[
                    'path',
                    {rules: [{ required: true, message: '请输入跳转路径' }]}
                  ]"
                />
              </a-form-item>
              <a-form-item
                v-if="lev!=3"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="图标"
                has-feedback
              >
                <a-input ref="icons" v-model="menu.icon" placeholder="点击右侧按钮选择图标">
                  <a-icon v-if="menu.icon" slot="suffix" type="close-circle" @click="deleteIcons"/>
                  <a-icon slot="addonAfter" type="setting" style="cursor: pointer" @click="chooseIcons"/>
                </a-input>
              </a-form-item>
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="排序"
                has-feedback
              >
                <a-input-number
                  :min="0"
                  @change="handleNumberChange"
                  :precision="0.1"
                  v-decorator="[
                    'sort'
                  ]"
                />
              </a-form-item>
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="是否显示"
                has-feedback
              >
                <a-switch checkedChildren="是" unCheckedChildren="否" v-model="isShow" @change="changeHidden"/>
              </a-form-item>
              <a-form-item
                :wrapper-col="{ span: 12, offset: 5 }"
              >
                <a-button
                  type="primary"
                  html-type="submit"
                >
                  确认
                </a-button>
              </a-form-item>

            </a-form>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
    <icons
      @choose="handleIconChoose"
      @close="handleIconCancel"
      :iconChooseVisible="iconChooseVisible">
    </icons>
    <menu-form ref="menuForm" @close="handleMenuAddClose" @success="handleOk" :menuAddVisiable="menuAddVisiable" :pauth="pauth"></menu-form>
  </div>
</template>

<script>
import menuForm from './menuForm'
import Icons from './Icons'
import { getPermission } from '@/api/role'
import { getAuthById, delAuth, saveAuth } from '@/api/menu'
import pick from 'lodash.pick'

export default {
  components: { Icons, menuForm },
  data () {
    return {
      showAddNode: true,
      checkedAuth: {},
      menuAddVisiable: false,
      iconChooseVisible: false,
      menu: {
        icon: ''
      },
      pauth: null,
      form: this.$form.createForm(this),
      selectedRowKeys: [],
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      lev: 0,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      isShow: true,
      hidden: 0
    }
  },
  methods: {
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      if (checkedKeys.checked.length > 0) {
        this.getAuthById(checkedKeys.checked[0])
      }
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      if (selectedKeys.length === 1 && info.selectedNodes[0].data.props.component) {
        this.showAddNode = false
      } else {
        this.showAddNode = true
      }
      this.selectedKeys = selectedKeys
      if (selectedKeys.length > 0) {
        this.getAuthById(selectedKeys[0])
      }
    },
    loadPermissions () {
      getPermission().then(res => {
        this.treeData = res.permission
        this.expandedKeys.push(res.permission[0].key)
      })
    },
    handleNumberChange (value) {
      this.number = {
        ...validatePrimeNumber(value),
        value
      }
    },
    getAuthById (id) {
      getAuthById(id).then(res => {
        const { form: { setFieldsValue } } = this
        this.lev = res.result.lev
        this.menu.icon = res.result.icon
        this.checkedAuth = res.result
        this.hidden = res.result.hidden
        if (res.result.hidden === 0) {
          this.isShow = true
        } else {
          this.isShow = false
        }
        this.$nextTick(() => {
          setFieldsValue(pick(res.result, 'name', 'action', 'sort', 'parentName', 'component', 'path'))
        })
      })
    },
    handleSubmit (e) {
      const that = this
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('that.checkedAuth', that.checkedAuth)
          that.checkedAuth.name = values.name
          if (that.checkedAuth.lev !== 3) {
            that.checkedAuth.component = values.component
            that.checkedAuth.icon = that.menu.icon
            that.checkedAuth.path = values.path
          } else {
            that.checkedAuth.path = ''
            that.checkedAuth.component = ''
            that.checkedAuth.icon = ''
          }
          that.checkedAuth.action = values.action
          that.checkedAuth.sort = values.sort
          that.checkedAuth.hidden = that.hidden
          if (that.checkedAuth.parentId == null) {
            that.checkedAuth.parentId = ''
          }
          saveAuth(that.checkedAuth).then(res => {
            if (res.success === true) {
              that.$message.success('保存成功')
              that.loadPermissions()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    handleDelete () {
      const ids = []
      console.log('this.checkedKeys', this.checkedKeys)
      this.checkedKeys.checked.forEach(function (v, k) {
        ids.push(v)
      })
      var that = this
      this.$confirm({
        title: '确定删除' + this.checkedKeys.checked.length + '个菜单?',
        content: '删除后不可恢复',
        okType: 'danger',
        onOk () {
          return delAuth(ids).then(res => {
            if (res.success === true) {
              that.$message.success('删除成功')
              that.checkedKeys = []
              that.selectedRowKeys = []
              that.loadPermissions()
            } else {
              that.$notification['error']({
                message: '错误',
                description: res.message || '请求出现错误，请稍后再试',
                duration: 10
              })
            }
          })
        }
      })
    },
    deleteIcons () {
      this.menu.icon = ''
    },
    chooseIcons () {
      this.iconChooseVisible = true
    },
    handleIconCancel () {
      this.iconChooseVisible = false
    },
    handleIconChoose (value) {
      this.menu.icon = value
      this.iconChooseVisible = false
    },
    handleOk () {
      this.loadPermissions()
    },
    createMenu (type) {
      this.menuAddVisiable = true
      if (type === 1) {
        this.pauth = this.checkedAuth
      } else {
        this.pauth = null
      }
      this.$refs.menuForm.add(type)
    },
    handleMenuAddClose () {
      this.menuAddVisiable = false
    },
    changeHidden (checked) {
      this.isShow = checked
      if (checked === true) {
        this.hidden = 0
      } else {
        this.hidden = 1
      }
    }
  },
  created () {
    this.loadPermissions()
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
    errorMsg: 'The prime between 8 and 12 is 11!'
  }
}
</script>

<style scoped>

</style>
