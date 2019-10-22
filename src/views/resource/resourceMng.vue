<template>
  <div class="content">
    <add-resource v-if="currView=='add'" @submited="submited" :ossObj="ossObj"></add-resource>
    <div v-if="currView=='index'">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" ref="sform">
          <a-row>
            <a-col :md="16" :sm="24">
              <a-form-item label="资源名称">
                <a-input v-model="queryParam.name" placeholder="请输入资源名称" />
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
          type="primary"
          icon="plus"
          @click="showResourceDetail(0)"
        >{{ $t('common.new') }}</a-button>
        <a-button
          type="primary"
          :disabled="selectedRowKeys.length !== 1"
          icon="edit"
          @click="showResourceDetail(1)"
        >{{ $t('common.edit') }}</a-button>
        <a-button
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
        :customRow="rowClick"
      >
        <div slot="size" slot-scope="text, record">
          <a-tag color="#f50">{{ record.size }}</a-tag>
        </div>
        <a href="#" slot="proImg" slot-scope="text, record">
          <viewer :images="[record.proImg]">
            <img v-for="src in [record.proImg]" :src="src" :key="src" style="width: 80px;height: 80px;border-radius:5px;">
          </viewer>
        </a>
        <a href="#" slot="proVideo" @click="player(record)" slot-scope="text, record">
          <img src="https://s2.ax1x.com/2019/09/24/ukh1Jg.png" style="width: 80px;height: 80px;border-radius:5px;"/>
        </a>
      </s-table>
    </div>
    <a-modal
      title="预览视频"
      :width="800"
      :visible="videoVisible"
      @cancel="() => videoVisible=false"
      :destroyOnClose="true"
    >
      <iframe
        :src="videoUrl"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
        style="width:100%;height:550px;"></iframe>
    </a-modal>
  </div>
</template>

<script>
import { STable } from '@/components'
import { resourceData, delResourceIds } from '@/api/resource'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer/src/component.vue'
import AddResource from './addResource'
export default {
  name: 'DeviceList',
  components: {
    STable,
    Viewer,
    AddResource
  },
  data () {
    return {
      videoUrl: '',
      currView: 'index',
      visible: false,
      videoVisible: false,
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
      ossObj: null,
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
          title: '预览视频',
          dataIndex: 'proVideo',
          scopedSlots: { customRender: 'proVideo' }
        },
        {
          title: '地址',
          dataIndex: 'url'
        },
        {
          title: '资源内容',
          dataIndex: 'content'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '预留1',
          dataIndex: 'filed1'
        },
        {
          title: '预留2',
          dataIndex: 'filed2'
        },
        {
          title: '预留3',
          dataIndex: 'filed3'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return resourceData(this.queryParam).then(res => {
          console.log(res.result)
          res.result.data.forEach(function (v, k) {
            v.size = transSiz(v.size)
            v.key = v.id
          })
          this.$refs.table.clearSelected()
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
      }),
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
    showResourceDetail (flag) {
      this.currView = 'add'
      if (flag === 1) {
        this.ossObj = this.selectedRows[0]
      }
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
        title: '确定删除?',
        content: '删除后不可恢复',
        okType: 'danger',
        onOk () {
          console.log(ids)
          return delResourceIds(ids).then(res => {
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
      // this.$refs.table.refresh()
    },
    handleAllot () {
      this.$emit('allot')
    },
    addDtype (record) {
      console.log('addDr', record)
      this.$emit('addDr', record)
    },
    player (obj) {
      this.videoUrl = obj.proVideo
      this.videoVisible = true
    }
  },
  mounted () {
    this.init()
  },
  watch: {
  }
}
function transSiz (size) {
  if (size >= 1048576) {
    size = size / 1048576
    return parseFloat(size).toFixed(2) + 'MB'
  } else {
    size = size / 1024
    return parseFloat(size).toFixed(2) + 'KB'
  }
}
</script>
