<template>
  <div class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" ref="sform">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名称">
              <a-input v-model="queryParam.name" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="searchForm">{{ $t('common.search') }}</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">{{ $t('common.reset') }}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button
        v-action:role:add
        type="primary"
        icon="plus"
        @click="$refs.detail.add()"
      >{{ $t('common.new') }}</a-button>
      <a-button
        v-action:role:add
        type="primary"
        :disabled="selectedRowKeys.length !== 1"
        icon="edit"
        @click="handleEdit()"
      >{{ $t('common.edit') }}</a-button>
      <a-button
        v-action:role:del
        type="primary"
        :disabled="selectedRowKeys.length <= 0"
        icon="delete"
        @click="handleDelete()"
      >{{ $t('common.del') }}</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      row-key="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.detail.edit(record)">{{ $t('common.edit') }}</a>
        <a-divider type="vertical"/>
        <a @click="handleDelete(record)">{{ $t('common.del') }}</a>
      </span>
    </s-table>

    <roele-detail ref="detail" @ok="handleOk"></roele-detail>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getRoleData, delRole } from '@/api/role'
import RoeleDetail from './modules/RoleDetail'
export default {
  name: 'TableList',
  components: {
    STable,
    RoeleDetail
  },
  data () {
    return {
      // description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      currView: 'index',
      visible: false,

      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        name: '',
        pageNumber: 1,
        pageSize: 10
      },
      // 表头
      columns: [
        {
          title: '唯一识别码',
          dataIndex: 'role'
        },
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getRoleData(this.queryParam).then(res => {
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onChange
        }
      },
      optionAlertShow: false
    }
  },
  methods: {
    init () {
    },
    handleEdit () {
      this.$refs.detail.edit(this.selectedRows[0])
    },
    handleDelete (record) {
      const ids = []
      if (record != null) {
        ids.push(record.id)
      } else {
        this.selectedRowKeys.forEach(function (v, k) {
          ids.push(v)
        })
      }
      var that = this
      this.$confirm({
        title: '确定删除' + this.selectedRowKeys.length + '个角色?',
        content: '删除后不可恢复',
        okType: 'danger',
        onOk () {
          console.log(ids)
          return delRole(ids).then(res => {
            if (res.success === true) {
              that.$message.success('删除成功')
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
    handleOk () {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    searchForm () {
      this.$refs.table.refresh()
    },
    submited () {
      this.currView = 'index'
    }
  },
  mounted () {
    this.init()
  },
  watch: {
  }
}
</script>
