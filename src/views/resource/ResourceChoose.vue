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
    >
      <span slot="action" slot-scope="text,record">
        <a-button icon="plus" type="primary" @click="addResource(record)">添加</a-button>
      </span>
      <a href="#" slot="proImg" slot-scope="text, record">
        <viewer :images="[record.proImg]">
          <img v-for="src in [record.proImg]" :src="src" :key="src" style="width: 80px;height: 80px;border-radius:5px;">
        </viewer>
      </a>
    </s-table>
  </div>
</template>

<script>
import { STable } from '@/components'
import { resourceData } from '@/api/resource'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer/src/component.vue'
export default {
  name: 'Userchoose',
  components: {
    STable,
    Viewer
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
          title: '资源名称',
          dataIndex: 'name'
        },
        {
          title: '资源大小',
          dataIndex: 'size',
          scopedSlots: { customRender: 'size' }
        },
        {
          title: '预览图',
          dataIndex: 'proImg',
          scopedSlots: { customRender: 'proImg' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return resourceData(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log('传回来的', res.result)
            return res.result
          })
      }
    }
  },
  methods: {
    showallot () {},
    addResource (record) {
      this.$emit('addResource', record)
    }
  }
}
</script>
