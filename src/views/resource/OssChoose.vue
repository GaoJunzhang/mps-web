<template>
  <div>
    <a-button type="primary" @click="() => visible = true" icon="setting">
      选择文件
    </a-button>
    <span @click="clearSelectData" class="clear">清空已选</span>
    <a-collapse defaultActiveKey="1" :bordered="false">
      <a-collapse-panel header="已选择">
        <span class="select-count">{{ selectOss.length }}</span>
      </a-collapse-panel>
    </a-collapse>
    <a-drawer
      title="选择云盘文件"
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="visible"
      :width="800"
    >
      <div class="content">
        <div class="table-page-search-wrapper">
          <a-form layout="inline" ref="sform">
            <a-row>
              <a-col :md="16" :sm="24">
                <a-select placeholder="请选择" v-model="queryParam.fileType">
                  <a-select-option value="exe">exe</a-select-option>
                  <a-select-option value="pico apk/">pico apk</a-select-option>
                  <a-select-option value="video">video</a-select-option>
                </a-select>
              </a-col>
              <a-col :md="16" :sm="24">
                <a-select placeholder="请选择" v-model="queryParam.fileChildType">
                  <a-select-option value="file/">文件</a-select-option>
                  <a-select-option value="proImg/">预览图</a-select-option>
                  <a-select-option value="proVideo/">预览视频</a-select-option>
                </a-select>
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
        <a-table
          :pagination="pagination"
          :columns="columns"
          :dataSource="data"
          @change="handleTableChange"
        >
          <span slot="action" slot-scope="text, record">
            <a-button icon="plus" type="primary" @click="addOss(record)">添加</a-button>
          </span>
          <a href="#" slot="proImg" slot-scope="text, record">
            <viewer :images="[record.proImg]">
              <img v-for="src in [record.proImg]" :src="src" :key="src" style="width: 80px;height: 80px;border-radius:5px;">
            </viewer>
          </a>
          <div slot="size" slot-scope="text, record">
            <a-tag color="#f50">{{ record.size }}</a-tag>
          </div>
        </a-table>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { pageOssData } from '@/api/resource'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer/src/component.vue'
import '../../local/global'
export default {
  name: 'OssChoose',
  props: {
  },
  components: {
    Viewer
  },
  data () {
    return {
      visible: false,
      selectOss: [],
      queryParam: {
        fileChildType: '',
        fileType: ''
      },
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        {
          title: '缩略图',
          dataIndex: 'proImg',
          scopedSlots: { customRender: 'proImg' }
        },
        // {
        //   title: '名称',
        //   dataIndex: 'key'
        // },
        {
          title: '文件大小',
          dataIndex: 'size',
          scopedSlots: { customRender: 'size' }
        },
        {
          title: '更新时间',
          dataIndex: 'lastModified'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onChange
        }
      },
      data: [],
      pagination: {},
      totalOss: 0,
      nextMarker: '', // oss下一次分页起点
      maxKeys: 10 // oss每页页数,
    }
  },
  methods: {
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    searchForm () {
      this.getOssDataList()
    },
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination)
      const pager = { ...this.pagination }
      this.pagination = pager
      this.queryParam.pageNo = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.getOssDataList()
    },
    addOss (v) {
      const that = this
      let flag = true
      this.selectOss.forEach(e => {
        if (v.id === e.id) {
          that.$message.warning('已经添加过啦，请勿重复选择')
          flag = false
        }
      })
      if (flag) {
        const u = {
          id: v.id,
          fileName: global.OSS_URL + v.key,
          size: v.size
        }
        that.selectOss.push(u)
        that.$emit('on-change', that.selectOss)
        that.$message.info(`添加成功`)
      }
    },
    clearSelectData () {
      this.selectOss = []
      this.$emit('on-change', this.selectOss)
    },
    getOssDataList () {
      let dir = 'oss/'
      if (this.queryParam.fileType !== undefined && this.queryParam.fileType !== '') {
        dir += this.queryParam.fileType
      }
      if (this.queryParam.fileChildType !== undefined && this.queryParam.fileChildType !== '') {
        dir += this.queryParam.fileChildType
      }
      console.log('=====')
      console.log(dir)
      const params = {
        nextMarker: this.nextMarker, // oss下一次分页起点
        maxKeys: this.maxKeys, // ss每页页数
        dir: dir, // oss指定目录,
        keyPrefix: this.queryParam.fileName
      }
      pageOssData(params).then(res => {
        if (res.success) {
          res.result.summaryList.forEach(function (v, k) {
            const fileTmp = v.key
            const fileType = fileTmp.substr(fileTmp.lastIndexOf('.')).toLowerCase()
            if (global.IMGSTR_URL.indexOf(fileType) !== -1) {
              v.flag = 0
              v.proImg = global.OSS_URL + v.key
            } else if (global.VIDEOSTR_URL.indexOf(fileType) !== -1) {
              v.flage = 1
              v.proImg = global.VIDEOIMG_URL
            } else if ('.apk'.indexOf(fileType) !== -1) {
              v.flage = 2
              v.proImg = global.APKIMG_URL
            } else if (global.EXESTR_URL.indexOf(fileType) !== -1) {
              v.flage = 3
              v.proImg = global.EXEIMG_URL
            } else {
              v.flage = 5
              v.proImg = global.FILEIMG_URL
            }
            v.size = transSiz(v.size)
            v.id = k
          })
          this.nextMarker = res.result.nextMarker
          this.data = res.result.summaryList
          this.totalOss = res.result.total

          const pagination = { ...this.pagination }
          pagination.total = res.result.total
          this.pagination = pagination
        }
      })
    }
  },
  created () {
    this.getOssDataList()
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

<style lang="less">
  .clear {
    font-size: 12px;
    margin-left: 15px;
    color: #40a9ff;
    cursor: pointer;
  }

  .collapse {
    font-size: 12px;
    margin-top: 15px;
    width: 500px;
  }

  .my-drawer-footer {
    z-index: 10;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
  }

  .select-count {
    font-size: 13px;
    font-weight: 600;
    color: #40a9ff;
  }
</style>
