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
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      size="default"
      ref="table"
      row-key="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :customRow="rowClick"
    >
      <span slot="action" slot-scope="text,record">
        <a-button v-if="isAdd" icon="plus" type="primary" @click="addUser(record)">添加</a-button>
      </span>
      <span slot="avatar" slot-scope="text,record">
        <a-avatar :src="record.avatar" icon="user" style="backgroundColor:#87d068"/>
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getUserList } from '@/api/user'
export default {
  name: 'Userchoose',
  props: {
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  components: {
    STable
  },
  data () {
    return {
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
      advanced: false,
      queryParam: {},
      // 表头
      columns: [
        {
          title: '头像',
          dataIndex: 'avatar',
          scopedSlots: { customRender: 'avatar' }
        },
        {
          title: '账号',
          dataIndex: 'account',
          sorter: true
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          sorter: true
        },
        {
          title: '名称',
          dataIndex: 'name',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log('传回来的', res.result)
            return res.result
          })
      },
      rowClick: record => ({
        // 事件
        on: {
          click: () => {
            // 点击改行时要做的事情
            // ......
            console.log(record, 'record')
            this.$emit('clickRow', record)
          }
        }
      })
    }
  },
  methods: {
    showallot () {},
    addUser (record) {
      this.$emit('addUser', record)
    }
  }
}
</script>

<style scoped>

</style>
