<template>
  <div class="content" :style="{height:'100%', paddingBottom:'20px'}">
    <a-layout :style="{height:'100%'}">
      <mgroup-tree ref="mgroup" @mgroupChange="handleMgroupChange"></mgroup-tree>
      <a-layout-content :style="{padding:'0 24px', height:'100%'}">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="16">
              <a-col span="8">
                <a-form-item :label="$t('task.name')">
                  <a-input v-model="queryParam.name" :placeholder="$t('task.taskPlaceholder')" />
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item :label="$t('common.audit')">
                  <a-select
                    v-model="queryParam.audit"
                    :placeholder="$t('common.choosePlaceholder')"
                    default-value
                  >
                    <a-select-option value>{{ $t('common.all') }}</a-select-option>
                    <a-select-option value="0">{{ $t('common.auditOk') }}</a-select-option>
                    <a-select-option value="1">{{ $t('common.auditWait') }}</a-select-option>
                    <a-select-option value="2">{{ $t('common.auditFail') }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <template v-if="advanced"></template>
              <a-col :md="!advanced && 6 || 24" :sm="24">
                <span
                  class="table-page-search-submitButtons"
                  :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
                >
                  <a-button
                    type="primary"
                    @click="$refs.table.refresh(true)"
                  >{{ $t('common.search') }}</a-button>
                  <a-button
                    style="margin-left: 8px"
                    @click="() => queryParam = {}"
                  >{{ $t('common.reset') }}</a-button>
                  <a v-show="false" @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? $t('common.collapse') : $t('common.expand') }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <div class="table-operator">
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item key="1">
                <router-link :to="{ name: 'taskEdit' }">
                  <a-icon type="mobile" />
                  {{ $t('task.horizontal') }}
                </router-link>
              </a-menu-item>
              <a-menu-item key="2">
                <router-link :to="{ name: 'taskEdit' }">
                  <a-icon type="mobile" />
                  {{ $t('task.vertical') }}
                </router-link>
              </a-menu-item>
            </a-menu>
            <a-button v-action:task:add type="primary" icon="plus">
              {{ $t('common.new') }}
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
          <a-button
            v-action:task:edit
            type="primary"
            :disabled="selectedRowKeys.length !== 1"
            icon="edit"
            @click="handleEdit()"
          >{{ $t('common.edit') }}</a-button>
          <a-button
            v-action:task:del
            type="primary"
            :disabled="selectedRowKeys.length <= 0"
            icon="delete"
            @click="handleDelete()"
          >{{ $t('common.del') }}</a-button>
          <a-button
            v-action:task:audit
            type="primary"
            :disabled="selectedRowKeys.length <= 0"
            icon="audit"
            @click="handleAudit()"
          >{{ $t('common.audit') }}</a-button>
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
          <span slot="audit" slot-scope="text, record">
            <a-button type="link" size="small" @click="showAuditRecord(record.id)">
              <a-badge v-if="text === 0" status="success" :text="$t('common.auditOk')" />
              <a-badge v-if="text === 1" status="processing" :text="$t('common.auditWait')" />
              <a-badge v-if="text === 2" status="error" :text="$t('common.auditFail')" />
            </a-button>
          </span>
          <span slot="validDate" slot-scope="text, record">
            <span v-if="text.length>0 || record.end.length>0">{{ text }} ~ {{ record.end }}</span>
            <span v-else>{{ $t('common.empty') }}</span>
          </span>
        </s-table>
      </a-layout-content>
    </a-layout>
    <component ref="model" :is="current" @ok="handleOk" @close="handleClose"></component>
    <a-drawer
      :title="$t('task.auditRecord')"
      placement="right"
      :closable="false"
      @close="onAuditRecordClose"
      :visible="auditRecordVisible"
    >
      <a-timeline :pending="loadingAuditRecord">
        <a-timeline-item
          v-for="record in auditRecord"
          :key="record.id"
          :color="filterTimeLineColor(record.audit)"
        >
          <p>{{ record.createTime }}</p>
          <p v-if="record.audit === 0">{{ record.userName }}{{ $t('task.auditPass') }}</p>
          <p v-if="record.audit === 1">{{ record.userName }}{{ $t('task.auditWait') }}</p>
          <p v-if="record.audit === 2">{{ record.userName }}{{ $t('task.auditFail') }}</p>
          <p v-if="record.audit === -1">{{ $t('common.noRecord') }}</p>
          <p v-if="record.remark && record.remark.length > 0">{{ record.remark }}</p>
        </a-timeline-item>
      </a-timeline>
    </a-drawer>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getTaskList, delTask, auditTaskRecords } from '@/api/task'
import MgroupTree from '../mgroup/MgroupTree'
import TaskAudit from './TaskAudit'

export default {
  name: 'TaskList',
  components: {
    STable,
    MgroupTree,
    TaskAudit
  },
  data () {
    return {
      current: '',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        pageNumber: 1,
        pageSize: 10
      },
      // 表头
      columns: [
        {
          title: this.$t('task.name'),
          dataIndex: 'name',
          sorter: true
        },
        {
          title: this.$t('common.validDate'),
          dataIndex: 'start',
          sorter: false,
          scopedSlots: { customRender: 'validDate' }
        },
        {
          title: this.$t('common.audit'),
          dataIndex: 'audit',
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'audit' }
        },
        {
          title: this.$t('user.userName'),
          dataIndex: 'userName',
          align: 'center',
          sorter: false
        },
        {
          title: this.$t('common.createTime'),
          dataIndex: 'createTime',
          align: 'center',
          sorter: true
        }
      ],

      loadData: parameter => {
        this.queryParam.mgroupId = this.$refs.mgroup.getSelected()
        return getTaskList(Object.assign(parameter, this.queryParam))
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
      optionAlertShow: false,
      auditRecordVisible: false,
      loadingAuditRecord: false,
      auditRecord: []
    }
  },
  filters: {
  },
  created () {

  },
  methods: {
    handleEdit (record) {

    },
    handleAudit () {
      this.current = 'TaskAudit'
      this.$nextTick(() => {
        this.$refs.model.audit(this.selectedRowKeys)
      })
    },
    handleDelete () {
      var that = this
      this.$confirm({
        title: this.$t('task.delTitle', [this.selectedRowKeys.length]),
        content: this.$t('task.delContent'),
        okType: 'danger',
        onOk () {
          return delTask(that.selectedRowKeys).then(res => {
            if (res.code === 200) {
              that.$refs.table.clearSelected()
              that.$refs.table.refresh()
            } else {
              that.$notification['error']({
                message: this.$t('common.error'),
                description: res.errMsg || this.$t('common.tryLater'),
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
    handleMgroupChange (mgroup) {
      this.$refs.table.refresh(true)
    },
    showAuditRecord (id) {
      this.auditRecordVisible = true
      this.loadingAuditRecord = this.$t('common.loading')
      this.auditRecord = []
      auditTaskRecords(id)
        .then(res => {
          if (res.code === 200) {
            this.auditRecord = res.result
          } else {
            this.auditRecord = [{
              audit: -1
            }]
          }

          this.loadingAuditRecord = false
        }, () => {
          this.auditRecord = [{
            audit: -1
          }]
          this.loadingAuditRecord = false
        })
    },
    onAuditRecordClose () {
      this.auditRecordVisible = false
      this.auditRecord = []
    },
    filterTimeLineColor (audit) {
      var colors = ['green', 'blue', 'red']
      if (audit < 0 || audit >= colors.length) {
        return 'blue'
      }

      return colors[audit]
    }
  },
  watch: {

  }
}
</script>
