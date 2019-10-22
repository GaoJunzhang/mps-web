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
                <a-form-item :label="$t('media.type')">
                  <a-select
                    v-model="queryParam.type"
                    :placeholder="$t('common.choosePlaceholder')"
                    default-value
                  >
                    <a-select-option value>{{ $t('common.all') }}</a-select-option>
                    <a-select-option value="0">{{ $t('mediaType.img') }}</a-select-option>
                    <a-select-option value="1">{{ $t('mediaType.video') }}</a-select-option>
                    <a-select-option value="2">{{ $t('mediaType.audio') }}</a-select-option>
                    <a-select-option value="3">{{ $t('mediaType.application') }}</a-select-option>
                    <a-select-option value="4">{{ $t('mediaType.subtitle') }}</a-select-option>
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
          <a-button v-action:media:upload type="primary" icon="upload" @click="showUpload">
            {{ $t('common.upload') }}
          </a-button>
          <a-button v-action:media:addSubtitle type="primary" icon="plus" @click="showSubtitle">
            {{ $t('media.addSubtitle') }}
          </a-button>
          <a-button
            v-action:media:edit
            type="primary"
            :disabled="selectedRowKeys.length !== 1"
            icon="edit"
            @click="handleEdit()"
          >{{ $t('common.edit') }}</a-button>
          <a-button
            v-action:media:del
            type="primary"
            :disabled="selectedRowKeys.length <= 0"
            icon="delete"
            @click="handleDelete()"
          >{{ $t('common.del') }}</a-button>
          <a-button
            v-action:media:audit
            type="primary"
            :disabled="selectedRowKeys.length <= 0"
            icon="audit"
            @click="handleAudit()"
          >{{ $t('common.audit') }}</a-button>
          <!--<a-button-->
          <!--v-action:task:audit-->
          <!--type="primary"-->
          <!--icon="rise"-->
          <!--@click="handleUploadStatus()"-->
          <!--&gt;{{ $t('media.uploadStatus') }}</a-button>-->
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
          <a href="#" slot="path" @click="player(record)" slot-scope="text, record">
            <viewer v-if="record.type==0" :images="[record.path]">
              <img v-for="src in [record.path]" :src="src" :key="src" style="width: 80px;height: 80px;border-radius:5px;">
            </viewer>
            <img v-if="record.type==2" src="https://s2.ax1x.com/2019/09/24/ukh3WQ.png" style="width: 80px;height: 80px;border-radius:5px;"/>
            <img v-if="record.type==1" :src="record.proImg" style="width: 80px;height: 80px;border-radius:5px;"/>
            <img v-if="record.type==3" src="https://s2.ax1x.com/2019/09/24/uk4plj.png" style="width: 80px;height: 80px;border-radius:5px;"/>
          </a>
          <div slot="type" slot-scope="text, record">
            <a-tag v-if="record.type==0" color="#f50">{{ $t('mediaType.img') }}</a-tag>
            <a-tag v-if="record.type==1" color="#87d068">{{ $t('mediaType.video') }}</a-tag>
            <a-tag v-if="record.type==2" color="#2db7f5">{{ $t('mediaType.audio') }}</a-tag>
            <a-tag v-if="record.type==3" color="#108ee9">{{ $t('mediaType.application') }}</a-tag>
          </div>
          <span slot="width" slot-scope="text,record">{{ record.width }} * {{ record.height }}</span>
        </s-table>
      </a-layout-content>
      <audio-player ref="audioplayer"></audio-player>
    </a-layout>
    <media-form ref="mediaForm" @success="handleOk"></media-form>
    <a-drawer
      title="上传情况"
      placement="left"
      :closable="false"
      @close="onClose"
      width="550"
      :visible="visible"
    >
      <a-list
        itemLayout="horizontal"
        :dataSource="uploadData"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta
            description="上传进度"
          >
            <a slot="title" href="#">{{ item.name }}</a>
            <!--<a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />-->
          </a-list-item-meta>
          <div>
            <a-progress type="circle" :percent="30" :width="50" />
          </div>
        </a-list-item>
      </a-list>
    </a-drawer>
    <flv-player ref="flvmodel"></flv-player>

    <a-modal
      title="编辑"
      :visible="editvisible"
      @ok="handleMgOk"
      @cancel="handleCancel"
      :destroyOnClose="true"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入名称"
              v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]"
            />
          </a-form-item>
          <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="备注"
              v-decorator="['remark']"
            />
          </a-form-item>
          <a-form-item label="媒体组" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <mgroup-select-tree @change="handleChange" :mGroupId="rowMgroupId" :mGroupName="rowMgroupName"></mgroup-select-tree>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <subtitle-form ref="subtitleForm" @ok="handleSubTitleOk"></subtitle-form>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getMediaData, delMedia, getTransStatus, saveMedia } from '@/api/media'
import MgroupTree from '../mgroup/MgroupTree'
import MediaForm from './MediaForm'
import FlvPlayer from './FlvPlayer'
import AudioPlayer from './AudioPlayer'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer/src/component.vue'
import MgroupSelectTree from './MgroupSelectTree'
import pick from 'lodash.pick'
import SubtitleForm from './SubtitleForm'

export default {
  name: 'TaskList',
  components: {
    STable,
    MgroupTree,
    MediaForm,
    FlvPlayer,
    AudioPlayer,
    Viewer,
    MgroupSelectTree,
    SubtitleForm
  },
  data () {
    return {
      confirmLoading: false,
      rowMgroupId: '',
      rowMgroupName: '',
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      uploadData: [
        {
          'name': '视频',
          'rate': 30
        }
      ],
      visible: false,
      editvisible: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: this.$t('mediaType.img'),
          dataIndex: 'path',
          sorter: false,
          scopedSlots: { customRender: 'path' }
        },
        {
          title: this.$t('media.name'),
          dataIndex: 'name',
          width: 40,
          sorter: true
        },
        {
          title: this.$t('media.type'),
          dataIndex: 'type',
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'type' }
        },
        {
          title: this.$t('media.resolution'),
          dataIndex: 'width',
          align: 'center',
          sorter: false,
          scopedSlots: { customRender: 'width' }
        },
        {
          title: this.$t('media.size'),
          dataIndex: 'size',
          align: 'center',
          sorter: true
        },
        {
          title: this.$t('media.duration'),
          dataIndex: 'duration',
          align: 'center',
          sorter: false
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
          title: this.$t('media.mGroupName'),
          dataIndex: 'mGroupName',
          align: 'center',
          sorter: false
        },
        {
          title: this.$t('media.remark'),
          dataIndex: 'remark',
          align: 'center',
          sorter: false
        },
        {
          title: this.$t('common.createTime'),
          dataIndex: 'createTime',
          align: 'center',
          sorter: true,
          defaultSortOrder: 'descend'
        }
      ],

      loadData: parameter => {
        const that = this
        that.queryParam.mgroupId = that.$refs.mgroup.getSelected()
        return getMediaData(Object.assign(parameter, that.queryParam))
          .then(res => {
            res.result.data.forEach(function (v, k) {
              v.size = that.tradSize(v.size)
              v.proImg = v.path.replace(/\.[^/.]+$/, '.jpg')
            })
            this.$refs.table.clearSelected()
            res.result.pageNo += 1
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
      }
    }
  },
  methods: {
    handleEdit () {
      const record = this.selectedRows[0]
      this.editvisible = true
      this.rowMgroupId = record.mGroupId + ''
      this.rowMgroupName = record.mGroupName
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'name', 'remark'))
      })
    },
    handleAudit () {
      this.$nextTick(() => {
        this.$refs.model.audit(this.selectedRowKeys)
      })
    },
    handleDelete () {
      var that = this
      that.$confirm({
        title: that.$t('task.delTitle', [that.selectedRowKeys.length]),
        content: that.$t('task.delContent'),
        okType: 'danger',
        onOk () {
          delMedia(that.selectedRowKeys).then(res => {
            if (res.success === true) {
              that.$message.success('删除成功')
              that.$refs.table.refresh()
            } else {
              that.$notification['error']({
                message: this.$t('common.error'),
                description: res.message || this.$t('common.tryLater'),
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
      this.$refs.table.refresh()
    },
    handleMgroupChange (mgroup) {
      this.$refs.table.refresh(true)
    },
    showUpload () {
      const selectGroupNode = this.$refs.mgroup.getSelectedNode()
      if (selectGroupNode == null) {
        this.$message.error('请选择媒体组')
        return
      }
      this.$refs.mediaForm.show(selectGroupNode.key, selectGroupNode.title)
    },
    tradSize (size) {
      if (!size) { return '' }
      var num = 1024.00 // byte
      if (size < num) { return size + 'B' }
      if (size < Math.pow(num, 2)) { return (size / num).toFixed(2) + 'K' } // kb
      if (size < Math.pow(num, 3)) { return (size / Math.pow(num, 2)).toFixed(2) + 'M' } // M
      if (size < Math.pow(num, 4)) { return (size / Math.pow(num, 3)).toFixed(2) + 'G' } // G
      return (size / Math.pow(num, 4)).toFixed(2) + 'T' // T
    },
    getTransStatus () {
      getTransStatus().then(res => {
        this.uploadData = res.result
      })
    },
    // handleUploadStatus () {
    //   // this.getTransStatus()
    //   this.visible = true
    // },
    onClose () {
      this.visible = false
    },
    player (mobj) {
      if (mobj.type === 1) {
        if (mobj.remark === 'transitioning') {
          this.$message.info('文件转换中，请稍后查看')
          this.$refs.table.refresh(true)
          return
        }
        this.$nextTick(() => {
          this.$refs.flvmodel.show(mobj)
        })
      }
      if (mobj.type === 2) {
        this.$refs.audioplayer.show(mobj)
      }
    },
    handleCancel () {
      this.editvisible = false
    },
    handleChange (v) {
      this.rowMgroupId = v
    },
    handleMgOk () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          params.mGroupId = this.rowMgroupId
          params.id = this.selectedRowKeys[0]
          if (params.remark === null) {
            params.remark = ''
          }
          saveMedia(params).then(res => {
            if (res.success) {
              this.$message.info('编辑成功')
              this.$refs.table.refresh(true)
              this.editvisible = false
            } else {
              this.$notification['error']({
                message: '错误',
                description: res.errMsg || '请求出现错误，请稍后再试',
                duration: 4
              })
            }

            this.confirmLoading = false
          }, () => {
            this.confirmLoading = false
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    showSubtitle () {
      const selectGroupNode = this.$refs.mgroup.getSelectedNode()
      if (selectGroupNode == null) {
        this.$message.error('请选择媒体组')
        return
      }
      this.$refs.subtitleForm.show(selectGroupNode.key, selectGroupNode.title)
    },
    handleSubTitleOk () {
      this.$message.info('编辑字幕好了')
    }
  },
  watch: {

  }
}
</script>
