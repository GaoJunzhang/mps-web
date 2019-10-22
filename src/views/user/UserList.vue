<template>
  <div class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col span="8">
            <a-form-item :label="$t('user.name')">
              <a-input v-model="queryParam.name" :placeholder="$t('user.namePlaceholder')" />
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label="$t('user.account')">
              <a-input v-model="queryParam.account" :placeholder="$t('user.accountPlaceholder')" />
            </a-form-item>
          </a-col>

          <template v-if="advanced">
            <a-col span="8">
              <a-form-item :label="$t('common.status')">
                <a-select v-model="queryParam.status" :placeholder="$t('common.choosePlaceholder')" default-value>
                  <a-select-option value>{{ $t('common.all') }}</a-select-option>
                  <a-select-option value="1">{{ $t('common.enable') }}</a-select-option>
                  <a-select-option value="2">{{ $t('common.disable') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 6 || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
            >
              <a-button type="primary" @click="$refs.table.refresh(true)">{{ $t('common.search') }}</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">{{ $t('common.reset') }}</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? $t('common.collapse') : $t('common.expand') }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button
        v-action:user:add
        type="primary"
        icon="plus"
        @click="newUser()"
      >{{ $t('common.new') }}</a-button>
      <a-button
        v-action:user:edit
        type="primary"
        :disabled="selectedRowKeys.length !== 1"
        icon="edit"
        @click="handleEdit()"
      >{{ $t('common.edit') }}</a-button>
      <a-button
        v-action:user:del
        type="primary"
        :disabled="selectedRowKeys.length <= 0"
        icon="delete"
        @click="handleDelete()"
      >{{ $t('common.del') }}</a-button>
    </div>

    <s-table
      size="default"
      ref="table"
      row-key="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusColorFilter" :text="text | statusFilter" />
      </span>
    </s-table>

    <component ref="model" :is="current" @ok="handleOk" @close="handleClose"></component>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getUserList, delUser } from '@/api/user'
import UserForm from './User'

const statusMap = {
  0: {
    color: 'error',
    text: '禁用'
  },
  1: {
    color: 'success',
    text: '启用'
  }
}

export default {
  name: 'UserList',
  components: {
    STable,
    UserForm
  },
  data () {
    return {
      current: '',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          sorter: true
        },
        {
          title: '账号',
          dataIndex: 'account',
          sorter: true
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          sorter: false
        },
        {
          title: '状态',
          dataIndex: 'status',
          sorter: true,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '最后登录时间',
          dataIndex: 'loginTime',
          sorter: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },

      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusColorFilter (type) {
      return statusMap[type].color
    }
  },
  created () {

  },
  methods: {
    handleEdit (record) {
      this.current = 'userForm'
      this.$nextTick(() => {
        this.$refs.model.edit(this.selectedRows[0])
      })
    },
    handleDelete () {
      const param = { ids: this.selectedRowKeys }
      var that = this
      this.$confirm({
        title: '确定删除' + this.selectedRowKeys.length + '个用户?',
        content: '删除后不可恢复',
        okType: 'danger',
        onOk () {
          return delUser(param).then(res => {
            if (res.errCode === 0) {
              that.$refs.table.refresh()
            } else {
              that.$notification['error']({
                message: '错误',
                description: res.errMsg || '请求出现错误，请稍后再试',
                duration: 4
              })
            }
          })
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleOk () {
      this.current = ''
      this.$refs.table.refresh()
    },
    handleClose () {
      this.current = ''
    },
    newUser () {
      this.current = 'userForm'
      this.$nextTick(() => {
        this.$refs.model.add()
      })
    }
  },
  watch: {

  }
}
</script>
