<template>
  <a-modal
    title="角色详情"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="formLoading">
      <a-card :bordered="false" :style="{ height: '100%' }">
        <a-row :gutter="24">
          <a-col :md="4">
            <a-list itemLayout="vertical" :dataSource="roles">
              <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
                <a-list-item-meta :style="{ marginBottom: '0' }">
                  <span slot="description" style="text-align: center; display: block">{{ item.describe }}</span>
                  <a slot="title" style="text-align: center; display: block" @click="edit(item)">{{ item.name }}</a>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-col>
          <a-col :md="20">
            <div style="max-width: 800px">
              <a-divider v-if="isMobile()"/>
              <a-form :form="form" :layout="isMobile() ? 'vertical' : 'horizontal'">
                <a-form-item label="唯一识别码">
                  <a-input
                    v-decorator="[ 'role', {rules: [{ required: true, message: '请输入唯一识别码!' }]} ]"
                    placeholder="请填写角色名称"/>
                </a-form-item>
                <a-form-item label="角色名称">
                  <a-input
                    v-decorator="[ 'name', {rules: [{ required: true, message: '请输入角色名称!' }]} ]"
                    placeholder="请填写角色名称"/>
                </a-form-item>

                <a-form-item label="备注说明">
                  <a-textarea
                    :row="3"
                    v-decorator="[ 'description']"
                    placeholder="请填写备注说明"/>
                </a-form-item>

                <a-form-item label="拥有权限">
                  <a-tree
                    checkable
                    @expand="onExpand"
                    :expandedKeys="expandedKeys"
                    :autoExpandParent="autoExpandParent"
                    v-model="checkedKeys"
                    @select="onSelect"
                    @check="onCheck"
                    :selectedKeys="selectedKeys"
                    :treeData="treeData"
                    :checkStrictly="true"
                  />
                </a-form-item>

              </a-form>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </a-spin>
  </a-modal>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import pick from 'lodash.pick'
import { getRoleAuths, saveRole, getPermission } from '@/api/role'

export default {
  name: 'RoleModal',
  mixins: [mixinDevice],
  components: {},
  data () {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      visible: false,
      confirmLoading: false,
      formLoading: true,
      form: this.$form.createForm(this),
      mdl: {},
      checkedAuth: [],
      roles: []
    }
  },
  created () {
    this.loadPermissions()
  },
  watch: {
    checkedKeys (val) {
      console.log('onCheck', val)
      this.checkedAuth = val
    }
  },
  methods: {
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(this.mdl, 'name', 'role', 'description'))
      })
      this.loadRolePermission(record.id)
      const roleObj = {}
      roleObj.name = this.mdl.name
      roleObj.describe = this.mdl.name
      this.roles = []
      this.roles.push(roleObj)
      console.log('this.mdl', this.mdl)
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          const param = values
          param.authIds = _this.checkedAuth
          console.log('values', values)

          if (this.mdl != null) {
            param.isDelete = this.mdl.isDelete
            param.id = this.mdl.id
          } else {
            param.isDelete = 0
          }
          console.log('param', param)
          _this.confirmLoading = true
          saveRole(param).then(res => {
            console.log(res)
            if (res.success) {
              _this.close()
              this.$emit('ok', values)
              _this.$message.success('保存成功')
            } else {
              _this.$message.error(res.message)
            }
          })
          _this.confirmLoading = false
        }
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleCancel () {
      this.close()
    },
    add () {
      this.mdl = null
      this.form.resetFields()
      this.checkedKeys = []
      this.visible = true
    },

    loadPermissions () {
      getPermission().then(res => {
        this.treeData = res.permission
        this.expandedKeys.push(res.permission[0].key)
      })
      this.formLoading = false
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys.checked
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      console.log(selectedKeys)
      this.selectedKeys = selectedKeys
    },
    loadRolePermission (roleId) {
      const param = {
        roleId: roleId
      }
      getRoleAuths(param).then(res => {
        const checked = []
        res.rolePermission.forEach(function (v, k) {
          checked.push(v.key)
        })
        this.checkedKeys = checked
      })
      this.formLoading = false
    }
  }
}
</script>

<style scoped>

</style>
